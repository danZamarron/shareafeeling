const { Router } = require('express');
const router = new Router();
const {catchErrors} = require("../middlewares");

const {
  getViewDonation,
  postViewDonation
} = require("../controllers/donations")

router.get('/donations', catchErrors(getViewDonation));
router.post('/donationmade/:value', catchErrors(postViewDonation));

module.exports = router