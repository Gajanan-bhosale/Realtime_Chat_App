import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      trim: true,
      required: function () {
        return this.isGroupChat;
      },
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    groupCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    groupDescription: {
      type: String,
      trim: true,
    },

    groupImage: {
      type: String,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'message',
    },

    lastMessageAt: {
      type: Date,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

chatSchema.index({ participants: 1 });

export default mongoose.model('Chat', chatSchema);
