const { Router } = require('express');
const router = new Router();
const {isAuth, catchErrors} = require("../middlewares");
const upload = require("../configs/cloudinary");

const {
  getListFeelings,
  getAddFeeling,
  postAddFeeling,
  getEditFeeling,
  postEditFeeling,
  getDeleteFeeling,
  getDetailFeeling
} = require("../controllers/feelings");


router.get('/feelings/list', getListFeelings)

router.get('/feelings/add', isAuth, getAddFeeling);
router.post('/feelings/add', isAuth, upload.single("feelingPicture"), catchErrors(postAddFeeling));

router.get('/feelings/edit/:feelingId', isAuth, getEditFeeling);
router.post('/feelings/edit/:feelingId', isAuth, upload.single("feelingPicture"), catchErrors(postEditFeeling));

router.get('/feelings/delete/:feelingId', isAuth, catchErrors(getDeleteFeeling))

router.get("/feelings/:feelingId", getDetailFeeling)


module.exports = router