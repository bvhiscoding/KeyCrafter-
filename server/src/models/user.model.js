const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name must be at most 50 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number'],
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    addresses: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        label: {
          type: String,
          required: [true, 'Address label is required'],
          enum: ['home', 'work', 'other'],
        },
        name: {
          type: String,
          required: [true, 'Recipient name is required'],
          trim: true,
          minlength: [2, 'Recipient name must be at least 2 characters long'],
          maxlength: [50, 'Recipient name must be at most 50 characters long'],
        },
        address: {
          type: String,
          required: [true, 'Address is required'],
          trim: true,
          maxlength: [200, 'Address must be at most 200 characters long'],
        },
        ward: {
          type: String,
          required: [true, 'Ward is required'],
          trim: true,
          maxlength: [100, 'Ward must be at most 100 characters long'],
        },
        district: {
          type: String,
          required: [true, 'District is required'],
          trim: true,
          maxlength: [100, 'District must be at most 100 characters long'],
        },
        city: {
          type: String,
          required: [true, 'City is required'],
          trim: true,
          maxlength: [100, 'City must be at most 100 characters long'],
        },
        phone: {
          type: String,
          trim: true,
          required: [true, 'Phone number is required'],
          match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number'],
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('User', userSchema);
