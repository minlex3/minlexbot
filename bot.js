const TelegramBot = require('node-telegram-bot-api')
const config = require('config')

const Response = require('./models/Response')
const Message = require('./models/Message')
const User = require('./models/User')

const startBot = () => {
  const bot = new TelegramBot(config.get('tokenTelegram'), { polling: true })

  // Command '/help'
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id
    const text = `Hello, I'm Minlex bot. You can send messages. Admin will answer them.\n
  /help - Open help
  /echo - Return your message, check the connection with the server
  /info - Show your info in DB (id, telegram id, last message)
  /count_messages - Find out how many messages you have sent in total
  /count_replies - Find out how many replies you have in total
  /refresh - Retry sending messages that were not delivered due to errors`

    bot.sendMessage(chatId, text)
  })

  // Command '/echo'
  bot.onText(/\/echo (.+)/, (msg, match) => {
    console.log('MSG:', msg)
    console.log('MAtch:', match)

    const chatId = msg.chat.id
    const resp = match[1]

    bot.sendMessage(chatId, resp)
  })

  // Command '/info'
  bot.onText(/\/info/, async (msg) => {
    let text = "You aren't in DB yet"
    const chatId = msg.chat.id
    const user = await User.findOne({ id: chatId })

    if (user) {
      text = `Your info, ${user.username}: \n\nId: ${user._id}\nTelegram id: ${user.id}\nLast message: ${user.lastMessage}`
    }

    bot.sendMessage(chatId, text)
  })

  // Command '/count_messages'
  bot.onText(/\/count_messages/, async (msg) => {
    let text = "You haven't sent messages yet"
    const chatId = msg.chat.id
    const owner = await User.findOne({ id: chatId })

    if (owner) {
      const messages = await Message.find({ owner: owner })
      if (messages.length == 1) {
        text = `You have left ${messages.length} message`
      } else {
        text = `You have left ${messages.length} messages`
      }
    }

    bot.sendMessage(chatId, text)
  })

  // Command '/count_replies'
  bot.onText(/\/count_replies/, async (msg) => {
    let text = "You haven't received an answer yet"
    let count = 0
    const chatId = msg.chat.id
    const owner = await User.findOne({ id: chatId })

    if (!owner) {
      bot.sendMessage(chatId, text)
    } else {
      const messages = await Message.find({ owner: owner })

      messages.forEach(async (message) => {
        const responses = await Response.find({ messageId: message.messageId })
        count += responses.length
        if (messages.indexOf(message) == messages.length - 1) {
          if (count > 1) {
            text = `You have ${count} responses`
          } else {
            text = `You have ${count} response`
          }
          bot.sendMessage(chatId, text)
        }
      })
    }
  })

  // Command '/refresh'
  bot.onText(/\/refresh/, async (msg) => {
    const chatId = msg.chat.id
    const owner = await User.findOne({ id: chatId })

    if (owner) {
      const messages = await Message.find({ owner: owner })

      messages.forEach(async (message) => {
        const responses = await Response.find({
          messageId: message.messageId,
          isSent: false,
        })

        if (responses.length) {
          responses.forEach(async (response) => {
            const resp = response.text
            const messageId = response.messageId

            response.isSent = true
            await response.save()

            await message.responses.push(response)
            await message.save()

            bot.sendMessage(chatId, resp, { reply_to_message_id: messageId })
          })
        } else if (messages.indexOf(message) == messages.length - 1) {
          const def = `${owner.username}, it looks like all answers have been delivered...`
          bot.sendMessage(chatId, def)
        }
      })
    }
  })

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    if (!text.startsWith('/')) {
      const userId = msg.chat.id
      let name = userId
      let firstName = 'John'
      let lastName = 'Doe'

      if (msg.chat.username) {
        name = msg.chat.username
      }
      if (msg.chat.first_name) {
        firstName = msg.chat.first_name
      }
      if (msg.chat.last_name) {
        lastName = msg.chat.last_name
      }

      let candidate = await User.findOne({ id: userId })

      if (!candidate) {
        const user = new User({
          id: userId,
          username: name,
          firstName: firstName,
          lastName: lastName,
        })
        await user.save()
        candidate = await User.findOne({ id: userId })
      } else {
        candidate.username = name
        candidate.firstName = firstName
        candidate.lastName = lastName

        await candidate.save()
      }

      const message = new Message({
        messageId: msg.message_id,
        text: msg.text,
        owner: candidate,
      })
      await message.save()

      candidate.newMessages += 1
      candidate.lastMessage = msg.text
      await candidate.messages.push(message)
      await candidate.save()

      let answer = ''
      if (text.length > 50) {
        answer = text.slice(0, 50) + '...'
      } else {
        answer = text
      }

      const res = `Thanks for contacting, ${name}.\n\nI\'ll answer "${answer}", when i think of.`

      bot.sendMessage(chatId, res)
    }
  })
}

module.exports = startBot
