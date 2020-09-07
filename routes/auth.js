const { Router } = require('express');
const router = new Router();

const {isAuth, catchErrors} = require(`../middlewares/index`);
const upload = require("../configs/cloudinary");


const {
  getSignUpView,
  postsignUpView,
  getLoginView,
  postLoginView,
  logOut,
  googleProcess,
  googleRedirect,
  facebookProcess,
  facebookRedirect
} = require("../controllers/auth");


router.get('/auth/signup', getSignUpView);
router.post('/auth/signup', upload.single("profilePicture"), catchErrors(postsignUpView));

router.get('/auth/login', getLoginView);
router.post('/auth/login', postLoginView);


router.get('/auth/logout', logOut);

router.get("/auth/google", googleProcess)
router.get("/auth/google/callback", googleRedirect)

router.get("/auth/facebook", facebookProcess)
router.get("/auth/facebook/callback", facebookRedirect)


module.exports = router;