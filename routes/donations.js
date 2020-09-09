const { Router } = require('express');
const router = new Router();
const {catchErrors} = require("../middlewares");

const {
  getViewDonation,
  postViewDonation,
  getViewProcessDonation
} = require("../controllers/donations")

router.get('/donations', getViewDonation);
router.post('/donationmade/:value', catchErrors(postViewDonation));
router.get('/processdonation', catchErrors(getViewProcessDonation));

module.exports = router