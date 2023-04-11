import mongoose = require('mongoose');

enum UpdateEventStatus {
    Ontime = 'ontime',
    Missing = 'missing',
    Resolved = 'resolved',
}

const UpdateEventScheme = new mongoose.Schema(
  {
    txHash: {
      type: String,
      required: true,
    },
    blockIncluded: {
      type: Number,
      required: true,
    },
    status: {
        type: UpdateEventStatus,
        required: true,
    },
    startBlockNumber: {
        type: Number,
        required: true,
    },
    prevHash: {
        type: String,
        required: true,
    },
    root: {
        type: String,
        required: true,
    },
    numFinal: {
        type: Number,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UpdateEvent', UpdateEventScheme);
