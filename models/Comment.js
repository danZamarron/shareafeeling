const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
  {
    comment:
    {
      type: String
    },
    userId:
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    feelingId:
    {
      type: Schema.Types.ObjectId,
      ref: "Feeling"
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Comment', commentSchema);