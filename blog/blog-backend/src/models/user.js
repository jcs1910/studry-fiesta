import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String
});

UserSchema.methods.setPassword = async function(password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function(password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true / false
};

// serialize 인스턴스 함수를 통해 hashedPassword 필드가 응답되지 않도록 데이터를 JSON으로 변환한 후 delete
UserSchema.methods.serialize = function() {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.statics.findByUsername = function(username) {
  return this.findOne({ username }); // static함수에서의 this는 모델을 가리킴. 여기서는 User
};

const User = mongoose.model('User', UserSchema);

export default User;
