import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    source: {
      type: String,
      default: 'contact_modal',
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active'
    },
    notificationSent: {
      type: Boolean,
      default: false
    },
    ip: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

subscriberSchema.index({ createdAt: -1 });

export default mongoose.model('Subscriber', subscriberSchema);
