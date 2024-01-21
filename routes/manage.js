var express = require('express');
var router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

/* GET Manage page. */
router.get('/', (req, res, next) => {
    prisma.Question.findMany().then(questions=> {
        var data = {
            title: 'Manage',
            content: questions
        }
        console.log(questions);
        res.render('manage', data);
    });
});

// http://localhost:3000/manage/registerにアクセスされた時
router.get('/register', (req, res, next) => {
    var data = {
        title: 'Register',
    };
    res.render('register', data);
});

// http://localhost:3000/manage/registerでPOST送信された時
// つまりはRegisterページで登録ボタンが押された時
router.post('/register', async (req, res, next) => {
    // console.log(req.body.choose_text);
    // console.log(req.body.choose);
    // 問題文の登録
    const question = await prisma.Question.create({
        data:{
            question: req.body.question
        }
    });

    // 選択肢の登録
    for (const [index, text] of Object.entries(req.body.choose_text)) {
        console.log(`${index}: ${text}`)
        console.log(+index === +req.body.choose);
        console.log(+req.body.choose);

        const choose = await prisma.Choose.create({
            data:{
               question_id: question.id,
               choose: text,
               correct: +index === +req.body.choose 
            }
        });
        console.log(choose);
      }
    res.redirect('/manage');
   
    
    
})

module.exports = router;
