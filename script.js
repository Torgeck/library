let myLibrary = [];
const dialog = document.querySelector("dialog");
const form = document.querySelector("form");
const shelf = document.querySelector(".shelf");
const btnAddBook = document.querySelector(".add-book");
const btnSubmit = document.querySelector(".submit");
const btnCancel = document.querySelector(".cancel");

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read === true;
    this.id = title + author;
  }

  info() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read" : "not read"
    }`;
  }

  description() {
    return `${this.author}, ${this.pages} pages, status:${
      this.read ? "read" : "not read"
    }`;
  }

  toggleRead() {
    this.read = !this.read;
  }

  key() {
    return this.title + this.author;
  }
}

function addBookToLibrary(newBook) {
  // Check if it is new
  if (!myLibrary.find((aBook) => aBook.key() === newBook.key())) {
    myLibrary.push(newBook);
    console.log(`Added ${newBook.info()} to library`);
  } else {
    console.log("book already exist");
  }
}

function fillWithDummyBooks() {
  let templateBook;

  for (let index = 0; index < 5; index++) {
    templateBook = new Book(
      "Title" + index,
      "Author" + index,
      2 % index === 0,
      index * 100
    );
    addBookToLibrary(templateBook);
  }
}

// Creating and adding cards to DOM
function createCard(aBook) {
  // Function that creates and add a card to DOM with a book
  let card = document.createElement("div");
  let title = document.createElement("h1");
  let info = document.createElement("p");
  let remove = document.createElement("button");
  let changeStatus = document.createElement("button");

  card.classList.add("card");
  title.classList.add("title");
  info.classList.add("info");
  remove.classList.add("remove");
  changeStatus.classList.add("status");

  card.appendChild(title);
  card.appendChild(info);
  card.appendChild(remove);
  card.appendChild(changeStatus);

  // Associate card with book
  card.book = aBook;
  remove.onclick = function () {
    removeBook(this.parentElement.book);
    this.parentElement.remove();
  };

  changeStatus.onclick = function () {
    this.parentElement.book.toggleRead();
    refreshCard(this.parentElement);
  };

  remove.textContent = "Remove";
  changeStatus.textContent = "Change read status";
  title.textContent = aBook.title;
  info.textContent = aBook.description();

  shelf.appendChild(card);
}

function refreshCard(card) {
  card.querySelector(".info").textContent = card.book.description();
}

function refreshShelfDisplay() {
  // function that deletes all books in the shelf and creates new cards
  removeAllChildNodes(shelf);
  myLibrary.forEach((book) => createCard(book));
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function removeBook(aBook) {
  myLibrary = myLibrary.filter((book) => book !== aBook);
}

btnAddBook.addEventListener("click", () => dialog.showModal());

btnSubmit.addEventListener("click", (e) => {
  let complete = true;
  e.preventDefault();
  const formData = new FormData(form);
  const values = [...formData.values()];

  for (let index = 0; index < values.length && complete; index++) {
    if (values[index] === "") {
      complete = false;
    }
  }

  if (complete) {
    let book = new Book(...values);
    addBookToLibrary(book);
    refreshShelfDisplay();
  }
  dialog.close();
});

// Prevent not submiting when form is not fill out
btnCancel.addEventListener("click", (e) => {
  e.preventDefault();
  dialog.close();
});
