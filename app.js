const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const startBot = require('./bot')

const app = express()

app.use(express.json({ extended: true }))

app.use('/api/message', require('./routes/message.routes'))

// // start frontend part
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUrl'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    app.listen(PORT, () =>
      console.log(`\nApp and bot has been started on port ${PORT}...\n`)
    )
  } catch (e) {
    console.log('Server Error: ', e.message)
    process.exit(1)
  }
}

//starting server
start()

//starting bot
startBot()
