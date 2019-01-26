import React from "react";
import PropTypes from "prop-types";
import EmptyImage from "../asserts/img/noimage.png";

const BookCard = ({ book }) => {
  const bookTitle = book.best_book.title;
  let displayTitle = bookTitle
    .split(" ")
    .slice(0, 4)
    .join(" ");
  if (bookTitle.length > displayTitle.length) {
    displayTitle += "...";
  }

  return (
    <div className="col-sm-6 col-md-4 book-card">
      <div className="book-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light">
        <div className="position-relative border-gray border-right bg-white rounded-left">
          <img
            className="card-img-top pt-2"
            src={book.best_book.image_url || EmptyImage}
            alt="Book cover"
          />
        </div>

        <div className="px-3">
          <span className="display-book-detail text-dark d-block font-weight-bold">
            {displayTitle}
          </span>

          <span className="book-author text-secondary text-uppercase">
            {book.best_book.author.name}
          </span>
        </div>
      </div>
    </div>
  );
};

BookCard.propTypes = {
  prop: PropTypes.object
};

export default BookCard;
