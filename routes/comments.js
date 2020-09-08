const { Router } = require('express');
const router = new Router();

const {isAuth, catchErrors} = require("../middlewares");

const {
  getAddComment,
  postAddComment,
  getEditComment,
  postEditComment,
  getDeleteComment,
} = require("../controllers/comments");


router.get('/comments/add/:feelingId', isAuth, catchErrors(getAddComment));
router.post('/comments/add/:feelingId', isAuth, catchErrors(postAddComment));

router.get('/comments/edit/:commentId', isAuth, catchErrors(getEditComment));
router.post('/comments/edit/:commentId', isAuth, catchErrors(postEditComment));

router.get('/comments/delete/:commentId', isAuth, catchErrors(getDeleteComment))


module.exports = router