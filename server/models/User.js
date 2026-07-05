const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/.+@stu\.manit\.ac\.in$/, 'Please use a valid @stu.manit.ac.in email address']
  },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  campus: { type: String, default: 'MANIT' },
  walletBalance: { 
    type: Number, 
    default: () => Number(process.env.MOCK_STARTING_BALANCE) || 2000 
  }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
