const { Schema, model } = require('mongoose');

const donationSchema = new Schema(
  {
    donationValue:
    {
      type: Number
    },
    userId:
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    payment_id:
    {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Donation', donationSchema);