import React from "react";
import BookCard from "./BookCard";
import PropTypes from "prop-types";

const BookList = ({ books }) => {
  return (
    <div className="row">
      {books.map(book => (
        <BookCard book={book} key={book.id} />
      ))}
    </div>
  );
};

BookList.propTypes = {
  books: PropTypes.array
};

export default BookList;
