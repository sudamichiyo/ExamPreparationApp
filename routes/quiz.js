var express = require('express');
var router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

/* GET Quiz page. */
// http://localhost:3000/quizにアクセスされた時
// 問題の表示
router.get('/', async(req, res, next)=> {
  const questions = await prisma.Question.findMany()
// ランダムな問題を取得
  const quiz = questions[ Math.floor( Math.random() * questions.length )];
// 取得したランダムな問題に対する選択肢を全て取得
  const chooses = await prisma.Choose.findMany({
    where: {question_id: quiz.id}
  })
// 取得した問題と選択肢を渡してレンダリングする
  var data = {
    title: 'Quiz',
    question: quiz,
    chooses: chooses
  }
  res.render('quiz', data);
  console.log( quiz );
  console.log(chooses);
});

router.get('/correct', async(req, res, next) => {
    var question_id = +req.query.question_id;
    var choose = +req.query.choose;
    // console.log( question_id);
    const chooses = await prisma.Choose.findMany({
        where: {question_id: question_id}
    })
    const correctIndex = chooses.findIndex((choose) => choose.correct)
    // console.log(correctIndex);

    await prisma.Question.update({
        where: {id: question_id},
        data:{
            isWrong: correctIndex !== choose
        }
    });

    res.render('correct',{ title: 'Correct', isCorrect: correctIndex === choose, correctNumber: correctIndex});
});

module.exports = router;
