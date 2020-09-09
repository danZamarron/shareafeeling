const {hashSync, genSaltSync} = require('bcrypt');
const saltRounds = 12;
const User = require('../models/User');
const passport = require("../configs/passport")

//#region Login

exports.getLoginView = (req, res) => res.render('auth/login', { "message": req.flash("error") });

exports.postLoginView = passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
})

//#endregion

//#region Sign Up

exports.getSignUpView = (req, res) => {
  res.render('auth/signup');
};

exports.postsignUpView = async (req, res) => {    
  const { username, email, password } = req.body

  //console.log(req.body)

  if (username==="" || email === "" || password === "") {
    return res.render("auth/signup", { errorMessage: "Faltan campos requeridos" })
  }
  let picturePath = ""
  if (req.file)
  {
    picturePath = req.file.path
  }
  else{
    //res.render('auth/signup', { errorMessage: 'Missing an Image for Profile' });
    //return;
  }


  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', 
      { errorMessage: 'El password necesita tener al menos una mayuscula, un digito y una longitud minima de 6'});
    return;
  }

  const existingUser = await User.findOne({ email })
  
  if (existingUser) {
    return res.render("auth/signup", { errorMessage: "Error, try again." })    
  }

  const hashPwd = hashSync(password, genSaltSync(saltRounds))

  await User.create({
    username,
    email,
    password: hashPwd,
    profilePicture: picturePath
  })

  res.redirect("/auth/login")
}

//#endregion

//#region Log Out

exports.logOut = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

//#endregion

//#region Profile

exports.getProfile = (req, res) => {
  res.render('users/user-profile');
};

//#endregion

//#region Social Login

exports.googleProcess = passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
})
exports.googleRedirect = passport.authenticate("google", {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
})

exports.facebookProcess = passport.authenticate("facebook", {
  scope: ["email"]
})

exports.facebookRedirect = passport.authenticate("facebook", {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
})

//#endregion