const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String, default: 'John' },
  lastName: { type: String, default: 'Doe' },
  messages: [{ type: Types.ObjectId, ref: 'Message' }],
  newMessages: { type: Number, default: 0 },
  lastMessage: { type: String, default: '' },
})

module.exports = model('User', schema)
