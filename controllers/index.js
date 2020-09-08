const User = require("../models/User")
const Feeling = require("../models/Feeling")
const Comment = require("../models/Comment")

exports.getIndex = (req, res, next) => {
  
  res.render('index');
};

exports.getProfile = async (req, res, next) => {
  
  let currentUser = req.user._id
  let userFeelings = await Feeling.find({userId: currentUser})
  let userComments = await Comment.find({userId: currentUser}).populate("feelingId")

  res.render('profile', {userFeelings, userComments});
};

exports.getSearchResults = async (req, res, next) => {
  
  let {searchFeeling} = req.query;
  const feelings = await Feeling.find({ title: { $regex: `.*${searchFeeling}.*`, $options: 'i' } });
  res.render('feelings/list', {searchFeeling, feelings});
};

exports.getRandomFeeling = async (req, res, next) => {
  
  let queryAll = await Feeling.count();
  const rand = Math.floor(Math.random() * queryAll);

  let randFeeling = await Feeling.findOne().skip(rand)

  const feeling = await Feeling.findById(randFeeling._id)
  .populate("userId")  
  .populate({
    path: "commentsId",
    populate: {
      path: "userId",
      model: "User"
    }
  })

  res.render('feelings/detail', feeling)

};