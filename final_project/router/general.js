const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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

// // list of available books (TASK 1)
// public_users.get('/', function (req, res) {
//   return res.status(200).json(books);
// });

// list of available books with promise (TASK 10)
public_users.get('/', async function (req, res) {
  try {
    let bookPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 6000);
    });

    const booksData = await bookPromise;
    return res.status(200).json(booksData);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



// // book by ISBN (TASK 2)
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   const bookArray = Object.values(books);
//   const book = bookArray.find(book => book.isbn === isbn);
//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

// book by ISBN with promise (TASK 11)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    let bookPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookArray = Object.values(books);
        const book = bookArray.find(book => book.isbn === isbn);
        resolve(book);
      }, 3000); // Simulating an asynchronous operation
    });

    const book = await bookPromise;
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



// // book by author (TASK 3)
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author;
//   const bookArray = Object.values(books);
//   const authorBooks = bookArray.filter(book => book.author === author);
//   if (authorBooks.length > 0) {
//     return res.status(200).json(authorBooks);
//   } else {
//     return res.status(404).json({ message: "Books by this author not found" });
//   }
// });

// book by author with promise (TASK 12)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    let authorBooksPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookArray = Object.values(books);
        const authorBooks = bookArray.filter(book => book.author === author);
        resolve(authorBooks);
      }, 3000); 
    });

    const authorBooks = await authorBooksPromise;
    if (authorBooks.length > 0) {
      return res.status(200).json(authorBooks);
    } else {
      return res.status(404).json({ message: "Books by this author not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


// // books by title (TASK 4)
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title;
//   const bookArray = Object.values(books);
//   const titleBooks = bookArray.filter(book => book.title.includes(title));
//   if (titleBooks.length > 0) {
//     return res.status(200).json(titleBooks);
//   } else {
//     return res.status(404).json({ message: "Books with this title not found" });
//   }
// });

// books by title with promise (TASK 13)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    let titleBooksPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookArray = Object.values(books);
        const titleBooks = bookArray.filter(book => book.title.includes(title));
        resolve(titleBooks);
      }, 3000); // Simulating an asynchronous operation
    });

    const titleBooks = await titleBooksPromise;
    if (titleBooks.length > 0) {
      return res.status(200).json(titleBooks);
    } else {
      return res.status(404).json({ message: "Books with this title not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
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
