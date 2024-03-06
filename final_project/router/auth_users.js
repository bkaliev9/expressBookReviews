const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("username in POST: " + username);

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).send("User successfully logged in");

  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { rating, comment } = req.body; // Extract from req.body instead of req.query
  const username = req.session.authorization.username;
  
  console.log("username in PUT: " + req.session.username);

  // Check if the book with the given ISBN exists
  const bookArray = Object.values(books);
  const book = bookArray.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already reviewed this book
  const existingReview = Object.values(book.reviews || {}).find(
    review => review.user === username
  );

  if (existingReview) {
    // If the user has already reviewed the book, modify the existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // If the user has not reviewed the book, add a new review
    const newReview = { user: username, rating: rating, comment: comment };
    book.reviews = book.reviews || {};
    const reviewId = Object.keys(book.reviews).length + 1;
    book.reviews[reviewId] = newReview;
    console.log("New review added:", newReview);
    return res.status(200).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization.username;

  // Check if the book with the given ISBN exists
  const bookArray = Object.values(books);
  const book = bookArray.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has reviewed this book
  const existingReviewId = Object.keys(book.reviews || {}).find(
    reviewId => book.reviews[reviewId].user === username
  );

  if (!existingReviewId) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the review
  delete book.reviews[existingReviewId];
  console.log("Review deleted");

  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
