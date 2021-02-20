const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  messageId: { type: Number, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  owner: { type: Types.ObjectId, ref: 'User' },
  responses: [{ type: Types.ObjectId, ref: 'Response' }],
})

module.exports = model('Message', schema)
