const { Router } = require('express')
const TelegramBot = require('node-telegram-bot-api')
const config = require('config')
// const auth = require('../middleware/auth.middleware')
const User = require('../models/User')
const Message = require('../models/Message')
const Response = require('../models/Response')

const router = Router()

// /api/message/list
router.get('/list', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (e) {
    res.status(500).json({ message: 'Something wrong. Try again.' })
  }
})

// /api/message/user/:id
router.get('/user/:id', async (req, res) => {
  try {
    const owner = await User.findById({ _id: req.params.id })
    let messages = await Message.find({ owner: owner })

    owner.newMessages = 0
    owner.save()

    res.json(messages)
  } catch (e) {
    res.status(500).json({ message: 'Something wrong. Try again.' })
  }
})

// /api/message/message/:id
router.get('/message/:id', async (req, res) => {
  try {
    let responses = []
    const owner = await User.findById({ _id: req.params.id })
    const messages = await Message.find({ owner: owner })

    for (let m of messages) {
      responses.push(await Response.find({ messageId: m.messageId }))
    }

    res.json(responses)
  } catch (e) {
    res.status(500).json({ message: 'Something wrong. Try again.' })
  }
})

// /api/message/user/send
router.post('/send', async (req, res) => {
  try {
    const { messageId, text } = req.body

    message = await Message.findOne({ messageId })
    user = await User.findById({ _id: message.owner })

    const response = new Response({
      userId: user.id,
      messageId: messageId,
      text: text,
      isSent: true,
      toMessage: message,
    })

    await response.save()

    message.isRead = true
    await message.responses.push(response)
    await message.save()

    // Отправка ботом сообщения
    const bot = new TelegramBot(config.get('tokenTelegram'), { polling: false })

    bot.sendMessage(user.id, text, { reply_to_message_id: messageId })

    res.status(201).json({ message: 'Response is sent' })
  } catch (e) {
    res.status(500).json({ message: 'Somthing wrong. Try again.' })
  }
})

module.exports = router
