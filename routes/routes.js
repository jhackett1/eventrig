var express = require('express');
var router = express.Router();
var simpleid = require('simpleid');
var json2csv = require('json2csv');
var fs = require('fs');

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

// GET list of orders and attendees
router.get('/orders', function(req, res, next){
  stripe.charges.list(
  { limit: 100 },
  function(err, charges) {
    let data = charges.data.map(function(charge){
      return {
        order: charge.metadata.orderNumber,
        amount: charge.amount,
        email: charge.metadata.email,
        quantity: charge.metadata.quantity
      }
    })
    res.render('orders', {charges: data});
    // Create a CSV
    var fields = ['order', 'amount', 'email', 'quantity'];
    var csv = json2csv({ data: data, fields: fields});
    fs.writeFile('./public/orders.csv', csv, function(err) {
      if (err) console.log(err);
      console.log('file saved');
    });
  });
});

// POST payment processing
router.post('/checkout', function(req, res, next){
  // Create uniqueorder number
  let orderNumber = simpleid();
  var token = req.body.stripeToken;
  // Charge the user's card
  stripe.charges.create({
    amount: req.body.quantity * 1500,
    currency: "gbp",
    description: "Valentines' Extravaganza ticket(s)",
    source: token,
    metadata: {
      quantity: req.body.quantity,
      email: req.body.email,
      orderNumber: orderNumber
    }
  }, function(err, charge) {
    // If error, stop
    if(err) return res.render('failed', {message: err.message});
    // Send confirmation email to buyer
    const html = `
    <h2>You have purchased ${req.body.quantity} ticket(s) to Tootie Foodies' Valentines' Extravaganza, in aid of the Trussell Trust.</h2>
    <p><strong>Order number: ${orderNumber}</strong></p>
    <p>Your card has been charged £${req.body.quantity * 15}.</p>
    <p>The event starts at 6pm on the 14th Feb 2018 at the Civil Service Club, SW1A 2HJ.</p>
    <p>We've recorded your details, but please bring this email with you to the event to guarantee speedy entry.</p>
    <p>If you have any questions, just reply to this email.</p>
    <p>Thanks,</p>
    <p>The Tootie Foodies Fund Team</p>
    `;
    const text = `
    You have purchased ${req.body.quantity} ticket(s) to Tootie Foodies' Valentines' Extravaganza, in aid of the Trussell Trust.
    Order number: ${orderNumber}
    Your card has been charged £${req.body.quantity * 15}.
    The event starts at 6pm on the 14th Feb 2018 at the Civil Service Club, SW1A 2HJ.
    We've recorded your details, but please bring this email with you to the event to guarantee speedy entry.
    If you have any questions, just reply to this email.
    Thanks, The Tootie Foodies Fund Team
    `;
    const msg = {
      to: req.body.email,
      from: 'tootiefoodies@gmail.com',
      subject: "Your tickets to Valentines' Extravaganza",
      text: text,
      html: html
    };
    sgMail.send(msg);
    res.render('success', {charge: charge});
  });
});


module.exports = router;
