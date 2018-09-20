const express = require('express');
const router  = express.Router();
const Opinion = require('../models/Opinion');
const Book = require('../models/Book');
const sendMail = require('../mail/sendMail');
const hbs = require('handlebars');
const fs = require('fs');

/* GET home page */
router.get('/', (req, res, next) => {

  Opinion.find().populate('book').then( opinions => {
    console.log(opinions);
    res.render('opinion/list',{opinions, title:'Opiniones'});
  })


  /*Opinion.find().then( opinions => {
    let proms = opinions
      .map(e => e.book)
      .map(id => Book.findById(id))
    Promise.all(proms).then(books =>{

      let ops = [];
      for(let i = 0; i<opinions.length; i++){
        ops.push({
          op:opinions[i],
          book:books[i]
        });
      }
      console.log(ops)
      res.render('opinion/list',{opinions:ops, title:'Opiniones'});

    })
  })*/
});


router.post('/new/:bookId', (req, res, next) => {
  let {texto} = req.body;
  let {redirect} = req.query;
  let bookId = req.params.bookId;
  Opinion.create({texto, book:bookId})
  .then( op => {
    // mandar un mail
    let templateStr = fs.readFileSync('./mail/templates/opinion.hbs').toString();
    let template = hbs.compile(templateStr);
    let html = template({opinion:texto})
    console.log(html);
    sendMail('ironhack.pepe@gmail.com',`Nueva opinión: ${bookId}`,html)
  })
  .then( () => {
    console.log("Opinion creada");
    res.redirect(redirect || '/');
  })
  .catch(e => next(e))
});

module.exports = router;
