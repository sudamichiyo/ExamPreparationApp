var express = require('express');
var router = express.Router();

/* GET Category page. */
router.get('/', (req, res, next)=> {
  res.render('category', { title: 'Category' });
});

module.exports = router;
