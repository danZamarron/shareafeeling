const express = require('express');
const router  = express.Router();
const {isAuth, catchErrors} = require(`../middlewares/index`);

const {
  getIndex,
  getProfile,
  getSearchResults,
  getRandomFeeling,
} = require("../controllers/index")

router.get('/', getIndex);
router.get('/profile', isAuth, catchErrors(getProfile));
router.get('/search', catchErrors(getSearchResults));
router.get('/randomfeeling', catchErrors(getRandomFeeling));


module.exports = router;
