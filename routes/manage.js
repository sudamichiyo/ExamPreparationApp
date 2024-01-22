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
});

// http://localhost:3000/manage/edit/:idにアクセスされた時
// 登録した問題を編集する時
router.get('/edit/:id', async(req, res, next) => {
    const id = +req.params.id;
    const question = await prisma.Question.findUnique({
        where: {id: id}
    })
    const choosesResult = await prisma.Choose.findMany({
        where: {question_id: id}
    })
    var data = {
        title: 'Edit',
        question: question,
        chooses: choosesResult
    };
    res.render('edit', data);
});

router.post('/edit/:id', async (req, res, next) => {
    // console.log(req.body.choose_text);
    // console.log(req.body.choose);
    // 問題文の更新
    const id = +req.params.id;
    const question = await prisma.Question.update({
        where: {id: id},
        data:{
            question: req.body.question
        }
    });

    const choosesResult = await prisma.Choose.findMany({
        where: {question_id: id}
    })

    // 選択肢の更新
    for (const [index, text] of Object.entries(req.body.choose_text)) {
        console.log(`${index}: ${text}`)
        console.log(+index === +req.body.choose);
        console.log(+req.body.choose);

        const choose = await prisma.Choose.update({
            where: {id: choosesResult[index].id},
            data:{
               question_id: question.id,
               choose: text,
               correct: +index === +req.body.choose 
            }
        });
        console.log(choose);
      }
    res.redirect('/manage'); 
});

// 登録した問題を削除する時
router.post('/delete/:id', async (req, res) => {
    const id = +req.params.id;
    // 問題に紐付いた選択肢を先に削除
    const choosesResult = await prisma.Choose.deleteMany({
        where: {question_id: id}
    })
    // 選択肢を削除してから問題文を削除
    const question = await prisma.Question.delete({
        where: {id: id}
    });
    res.redirect('/manage'); 
});

module.exports = router;
