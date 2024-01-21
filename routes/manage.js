var express = require('express');
var router = express.Router();

/* GET Manage page. */
router.get('/', (req, res, next) => {
    var data = {
        title: 'Manage',
    };
    res.render('manage', data);
});

module.exports = router;
