const Donation = require("../models/Donation")
const mercadopago = require("../configs/mercadopago")

exports.getViewDonation = (req,res,next) => {
  res.render("donations/index");
};

exports.getViewProcessDonation = async (req, res, next) => {

  let {valueDonation} = req.query;
  valueDonation = parseInt(valueDonation);

  if(isNaN(valueDonation))
  {
    res.redirect("/donations")
    return;
  }

  const preference = {
    items: [
      {
        title: `Donacion de ${valueDonation}`,
        unit_price: valueDonation,
        quantity: 1
      }
    ]
  }
  const {body: { id: preferenceObj }} = await mercadopago.preferences.create(preference)

  res.render("donations/processDonation", {preferenceObj, valueDonation})
};

exports.postViewDonation = async (req, res, next) => {

  let{ payment_id } = req.body
  let {value: donationValue} = req.params;
  let userId = null
  if(req.user)
    userId = req.user._id

  await Donation.create({
    donationValue,
    userId,
    payment_id
  })
  res.render("donations/thankyou", {donationValue})
};