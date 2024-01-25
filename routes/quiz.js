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
  var data = {
    title: 'Quiz',
    question: quiz,
    chooses: chooses
  }
  res.render('quiz', data);
  console.log( quiz );
  console.log(chooses);
});

module.exports = router;
