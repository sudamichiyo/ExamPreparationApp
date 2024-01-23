var express = require('express');
var router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

/* GET Quiz page. */
// http://localhost:3000/quizにアクセスされた時
// 問題の表示
router.get('/', async(req, res, next)=> {
  res.render('quiz', { title: 'Quiz' });
  const questions = await prisma.Question.findMany()

  console.log( questions[ Math.floor( Math.random() * questions.length ) ] );
});

module.exports = router;
