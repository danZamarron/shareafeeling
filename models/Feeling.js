const { Schema, model } = require('mongoose');

const feelingSchema = new Schema(
  {
    title: {
      type: String,
      trim: true
    },
    feeling:
    {
      type: String
    },
    feelingImagePath:
    {
      type: String
    },
    userId:
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    },    
    commentsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = model('Feeling', feelingSchema);