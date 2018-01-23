var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Set up Stripe SDK
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
var stripe = require("stripe")(keySecret);

// GET home
router.get('/', function(req, res, next) {
  res.render('index');
});

// POST payment processing
router.post('/checkout', function(req, res, next){

  var token = req.body.stripeToken;
  // Charge the user's card
  stripe.charges.create({
    amount: req.body.quantity * 1500,
    currency: "gbp",
    description: "Valentines' Extravaganza ticket(s)",
    source: token,
  }, function(err, charge) {
    // If error, stop
    if(err) return console.log(err);
    // Send confirmation email to buyer
    const msg = {
      to: 'hello@joshuahackett.com',
      from: 'test@example.com',
      subject: "Your tickets to Valentines' Extravaganza",
      text: 'Your order has been processed.',
      html: 'Your order has been processed'
    };
    sgMail.send(msg);
    // Redirect to order confirmation page
    // res.redirect('/checkout/success');
    console.log(charge)
  });
});

// GET results pages
router.get('/checkout/failed', function(req, res, next) {
  res.render('failed');
});
router.get('/checkout/success', function(req, res, next) {
  res.render('success');
});


module.exports = router;
