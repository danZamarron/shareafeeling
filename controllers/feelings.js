const User = require("../models/User")
const Feeling = require("../models/Feeling")

exports.getListFeelings = async (req, res, next) => {
  const feelings = await Feeling.find().populate("userId")
  console.log(feelings)
  res.render("feelings/list", {feelings} )
}


exports.getAddFeeling =(req, res, next) => {
  res.render("feelings/add");
};

exports.postAddFeeling = async (req, res, next) => {
  
  const { title, feeling } = req.body;

  if (!title || !feeling || !req.file ) {    
    res.render("feelings/add", {errorMessage: 'Todos los Campos son necesarios'});
    return;
  }

  let path = req.file.path;

  let feelingObj = await Feeling.create({
    userId: req.user._id,
    title: title,
    feeling: feeling,
    feelingImagePath: path
  });

  await User.findByIdAndUpdate(req.user._id, { $push: { userFeelings: feelingObj } } );

  res.redirect(`/feelings/list`);
};


exports.getEditFeeling = async (req, res, next) => {
  let feelingId = req.params.feelingId;
  const feeling = await Feeling.findById(feelingId)
  res.render("feelings/edit", feeling);
};

exports.postEditFeeling = async (req, res, next) => {
  let feelingId = req.params.feelingId;
  let feelingOriginal = await Feeling.findById(feelingId)

  const { title, feeling } = req.body;

  if (!title || !feeling ) {    
    res.render("feelings/edit/feelingId", {errorMessage: 'Titulo y Feeling son necesarios'});
    return;
  }

  let path = ""
  if(!req.file)
    path = feelingOriginal.feelingImagePath;
  else
    path = req.file.path

  await Feeling.findByIdAndUpdate(feelingId, {
    title: title,
    feeling: feeling,
    feelingImagePath: path
  })


  res.redirect("/feelings/list");
};

exports.getDeleteFeeling = async(req, res) => {
  let {feelingId} = req.params;

  await Feeling.findByIdAndRemove(feelingId)

  res.redirect('/feelings/list')
}

exports.getDetailFeeling = async(req, res) => {
  let {feelingId} = req.params;

  const feeling = await Feeling.findById(feelingId)

  res.render('feelings/detail', feeling)
}