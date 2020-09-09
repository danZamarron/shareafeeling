const Donation = require("../models/Donation")
const mercadopago = require("../configs/mercadopago")

exports.getViewDonation = async(req,res,next) => {

  const preference5 = {
    items: [
      {
        title: `Donacion de $5`,
        unit_price: 5,
        quantity: 1
      }
    ]
  }
  const preference10 = {
    items: [
      {
        title: `Donacion de $10`,
        unit_price: 5,
        quantity: 1
      }
    ]
  }  
  const preference25 = {
    items: [
      {
        title: `Donacion de $25`,
        unit_price: 5,
        quantity: 1
      }
    ]
  }
  const {body: { id: preferenceCinco }} = await mercadopago.preferences.create(preference5)
  const {body: { id: preferenceDiez }} = await mercadopago.preferences.create(preference10)
  const {body: { id: preferenceVeinticinco }} = await mercadopago.preferences.create(preference25)

  let preferencias =
  {
    cinco: preferenceCinco,
    diez: preferenceDiez,
    veinticinco: preferenceVeinticinco
  };

  res.render("donations/index", {preferencias});
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