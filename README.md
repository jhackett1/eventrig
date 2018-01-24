Eventrig
========

Eventrig was built during one long night of the soul.

It is a quick Express application which uses the Stripe API to take payments.

It also offers basic order management functionality and CSV export via the password-protected /orders route.

This was made in a hurry for one particular event, but it is a fairly standard implementation of the Stripe API.

Installation
------------

If for some reason you want to install this, you need to make sure that environment variables for your Stripe API keys, Sendgrid API key and both an admin username and password are both set.

Then, it's a matter of ```npm install``` and ```npm start```.

It will be on localhost:3000 by default.
