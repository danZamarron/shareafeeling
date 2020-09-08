const User = require("../models/User")
const Feeling = require("../models/Feeling")
const Comment = require("../models/Comment")

exports.getAddComment = async (req, res, next) => {

  let {feelingId} = req.params;
  const feeling = await Feeling.findById(feelingId)

  res.render("comments/add", feeling);
};

exports.postAddComment = async (req, res, next) => {

  let {comment} = req.body;
  let {feelingId} = req.params

  if (!comment) {    
    res.render(`comments/add/${feelingId}`, {errorMessage: 'Un comentario es requerido'});
    return;
  }

  let commentObj = await Comment.create({
    comment: comment,
    userId: req.user._id,
    feelingId: feelingId
  })

  console.log(commentObj)


  await User.findByIdAndUpdate(req.user._id,{ $push: { userComments: commentObj._id } })

  await Feeling.findByIdAndUpdate(feelingId,{ $push: { commentsId: commentObj._id } })

  res.redirect(`/feelings/${feelingId}`);
};


exports.getEditComment = async (req, res, next) => {
  let {commentId} = req.params
  let comment = await Comment.findById(commentId)
  const feel = await Feeling.findById(comment.feelingId)
  comment.titleFeeling = feel.title
  res.render("comments/edit", comment);
};

exports.postEditComment = async (req, res, next) => {
  let {commentId} = req.params
  let {comment} = req.body;
  
  if (!comment) {    
    res.render(`comments/edit/${commentId}`, {errorMessage: 'Un comentario es requerido'});
    return;
    }

  const commentObj = await Comment.findByIdAndUpdate(commentId, {
    comment: comment
  }, {new: true})  

  res.redirect(`/feelings/${commentObj.feelingId}`);
};

exports.getDeleteComment = async(req, res) => {  
  let {commentId} = req.params
  await Comment.findByIdAndRemove(commentId)
  res.redirect('/')
}
