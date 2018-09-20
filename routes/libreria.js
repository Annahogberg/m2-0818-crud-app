const express = require('express');
const router  = express.Router();
const Book = require('../models/Book');
const Opinion = require('../models/Opinion');

// C(R)UD -> Muestra todos los libros
router.get('/', (req, res, next) => {
  Book.find().then(books => {
    console.log(books.length)
    res.render('book/list',{books, title:'Lista de libros'});
  }).catch(e =>  next(e))
});

// (C)RUD ->  Muestra el formulario de creación de un libro
router.get('/new', (req, res, next) => {
  res.render('book/create');
});

// (C)RUD ->  Crea un libro
router.post('/new', (req, res, next) => {

  let {title, author, description, rating} = req.body; 
  Book.create({title, author, description, rating})
  .then(book => {
    res.redirect('/libreria');
  }).catch(e =>  next(e))
});

// CRU(D) -> Elimina un libro
router.get('/delete/:bookId', (req, res, next) => {
  Book.findByIdAndRemove(req.params.bookId).then(() => {
    res.redirect('/libreria');
  }).catch(e =>  next(e))
});

// CR(U)D -> Update, muestra el formulario
router.get('/update/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId).then(book => {
    res.render('book/edit', {book});
  }).catch(e => next(e));
});

// CR(U)D -> Update, muestra el formulario
router.post('/update/:bookId', (req, res, next) => {
  
  let {title, author, description, rating} = req.body; 
  Book.findByIdAndUpdate(req.params.bookId, {title, author, description, rating})
  .then(() => res.redirect('/libreria'))
  .catch(e => next(e));
});


// C(R)UD -> Muestra un libro
router.get('/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId)
  .then(book => {
    Opinion.find({book:book._id}).then(opinions => {
      res.render('book/detail',{book, opinions, title:`Libro: ${book.title}`});
    })
  }).catch(e => next(e))
});

module.exports = router;
