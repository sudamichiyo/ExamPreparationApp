var express = require('express');
var router = express.Router();

/* GET Manage page. */
router.get('/', (req, res, next) => {
    var data = {
        title: 'Manage',
    };
    res.render('manage', data);
});

// http://localhost:3000/manage/registerにアクセスされた時
router.get('/register', (req, res, next) => {
    var data = {
        title: 'Register',
    };
    res.render('register', data);
});

module.exports = router;
