import React, { Component } from "react";
import "./App.css";
import Axios from "axios";
import BookList from "./components/BookList";
import GOODREADSKEY from "./utils/constant";

// Environment variable "GoodReads sceret key"
// const goodreadsKey = btoa(process.env.REACT_APP_API_KEY);

// How many books want to show per page
const pagePerView = 6;

class App extends Component {
  state = {
    currentPage: null,
    totalPages: null,
    searchInput: "",
    error: "",
    computingData: false,
    booksList: [],
    displayBooks: []
  };

  onTextChange = e => {
    this.setState({
      searchInput: e.target.value
    });
    /* Uncomment it for live list while typying */
    // this.onSearchClick();
  };

  onSearchClick = () => {
    this.setState({
      computingData: true
    });
    const { searchInput } = this.state;
    console.log(JSON.stringify(atob("56lRVGo8oQ9LHgkieToQ")));

    /**
     * This API enables cross-origin requests to anywhere. (https://cors-anywhere.herokuapp.com/)
     */
    const requestUri =
      `https://cors-anywhere.herokuapp.com/` +
      `https://www.goodreads.com/search/index.xml?key=${GOODREADSKEY}&q=${searchInput}`;

    Axios.get(requestUri)
      .then(res => {
        this.parseXmlRes(res.data);
      })
      .catch(error => {
        this.setState({
          error: error.toString(),
          computingData: false
        });
      });
  };

  /**
   * XML response to string then covert into JSON object, Also
   * set the state books, If error comes also parseXmlRes track down and
   * set error to the state
   */
  parseXmlRes = response => {
    const parser = new DOMParser();
    const XMLResponse = parser.parseFromString(response, "application/xml");
    const parseError = XMLResponse.getElementsByTagName("parsererror");

    if (parseError.length) {
      this.setState({
        error: "There was an error fetching results.",
        computingData: false
      });
    } else {
      const XMLresults = new Array(...XMLResponse.getElementsByTagName("work"));
      const booksList = XMLresults.map(result => this.XmlToJson(result));
      this.setState({ booksList, computingData: false });
      //Set the inital page after data get refreshed
      this.setBooksOnCurrentPage(0);
    }
  };

  /**
   * Loops each child and convert into key, value pair. And call itself until finish
   * the deep sub-child.
   */
  XmlToJson = XML => {
    const nodes = new Array(...XML.children);
    const jsonObject = {};
    nodes.forEach(node => {
      if (node.children.length) {
        jsonObject[node.nodeName] = this.XmlToJson(node);
      } else {
        jsonObject[node.nodeName] = node.innerHTML;
      }
    });
    return jsonObject;
  };

  /**
   * Pagination number into Slice Books from All books
   */
  setBooksOnCurrentPage = currentPage => {
    const { booksList } = this.state;
    const offset = currentPage * pagePerView;
    const displayBooks = booksList.slice(offset, offset + pagePerView);
    this.setState({ currentPage: currentPage + 1, displayBooks });
  };

  //Page total
  calculateTotalPage = () => {
    const { booksList } = this.state;
    var x = booksList.length / pagePerView;
    let pages = Math.trunc(x);
    let float_part = Number((x - pages).toFixed(2));
    if (float_part) {
      pages += 1;
    }
    return pages;
  };

  /**
   * Pagination dynamic functional grouping
   */
  showPagination = () => {
    const { currentPage } = this.state;
    let pagesLength = [];

    for (var i = 0; i < this.calculateTotalPage(); i++) {
      pagesLength.push(i);
    }
    return (
      <nav aria-label="Countries Pagination">
        <ul className="pagination">
          {pagesLength.map((p, i) => (
            <li
              key={i}
              className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
            >
              {/*eslint-disable-next-line*/}
              <a
                className="page-link"
                href="#"
                onClick={() => this.setBooksOnCurrentPage(i)}
              >
                {i + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  render() {
    const {
      booksList,
      currentPage,
      displayBooks,
      computingData,
      error
    } = this.state;
    const totalBooks = booksList.length;

    const headerClass = [
      "text-dark py-2 pr-4 m-0",
      currentPage ? "border-gray border-right" : ""
    ]
      .join(" ")
      .trim();

    return (
      <React.Fragment>
        <div className="container mb-5">
          <div className="col-12 search-bar">
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search books"
                  aria-label="Search"
                  name="searchText"
                  onChange={this.onTextChange}
                  value={this.state.searchText}
                />
                <div className="input-group-btn">
                  <button
                    className="btn btn-default"
                    onClick={this.onSearchClick}
                  >
                    <i className="fa fa-search" />
                  </button>
                </div>
              </div>
          </div>
          <div className="row d-flex flex-row py-5">
            <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
              <div className="d-flex flex-row align-items-center">
                <h2 className={headerClass}>
                  <strong className="text-secondary">{totalBooks}</strong> Books
                </h2>

                {currentPage && (
                  <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                    Page <span className="font-weight-bold">{currentPage}</span>{" "}
                    /{" "}
                    <span className="font-weight-bold">
                      {this.calculateTotalPage()}
                    </span>
                  </span>
                )}
              </div>

              <div className="d-flex flex-row py-4 align-items-center">
                <this.showPagination />
              </div>
            </div>

            {computingData ? (
              <React.Fragment>
                <div className="spinner">
                  <i className="fa fa-circle-o-notch fa-spin" />
                </div>
              </React.Fragment>
            ) : (
              (error && <p className="text-danger">{error}</p>) || (
                <BookList books={displayBooks} />
              )
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
