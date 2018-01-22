var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/charge', function(req, res, next) {
  console.log(req.body)
  res.render('charge');
});

module.exports = router;
