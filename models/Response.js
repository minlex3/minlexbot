const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  userId: { type: Number, required: true },
  messageId: { type: Number, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isSent: { type: Boolean, default: false },
  toMessage: [{ type: Types.ObjectId, ref: 'Message' }],
})

module.exports = model('Response', schema)
