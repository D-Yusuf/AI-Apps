import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {type: String, default: "Anonymous"},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profilePicture: {type: String, default: ""},
  calendar: {type: Array, default: []},
  flashcards: [{type: Schema.Types.ObjectId, ref: "Flashcards"}],
  chats: {type: Array, default: []},

  createdAt: {type: Date, default: Date.now},
});

export default model('User', UserSchema);
