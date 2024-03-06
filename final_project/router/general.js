const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const userData = req.body;
  if (!userData.username || !userData.password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(userData.username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push(userData);
  return res.status(200).json({ message: "User registered successfully" });
});

// list of available books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const bookArray = Object.values(books);
  const book = bookArray.find(book => book.isbn === isbn);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


// book by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookArray = Object.values(books);
  const authorBooks = bookArray.filter(book => book.author === author);
  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

// books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookArray = Object.values(books);
  const titleBooks = bookArray.filter(book => book.title.includes(title));
  if (titleBooks.length > 0) {
    return res.status(200).json(titleBooks);
  } else {
    return res.status(404).json({ message: "Books with this title not found" });
  }
});

// book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const bookArray = Object.values(books);

  const book = bookArray.find(book => book.isbn === isbn);
  if (book) {
    return res.status(200).json({ title: book.title, reviews: book.reviews });

  } else {
    return res.status(404).json({ message: "Book not found" });
  }


});

module.exports.general = public_users;
