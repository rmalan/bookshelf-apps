document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  for (const book of books) {
    const bookElement = makeBook(book);
    if (!book.isCompleted)
      incompleteBookshelfList.append(bookElement);
    else
      completeBookshelfList.append(bookElement);
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement('p');
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const unreadButton = document.createElement('button');
    unreadButton.classList.add('green');
    unreadButton.innerText = 'Belum selesai di Baca';

    unreadButton.addEventListener('click', function () {
      markAsUnread(bookObject.id);
    });

    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = 'Hapus buku';

    removeButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    buttonContainer.append(unreadButton, removeButton);

    container.append(buttonContainer);
  } else {
    const readButton = document.createElement('button');
    readButton.classList.add('green');
    readButton.innerText = 'Selesai dibaca';

    readButton.addEventListener('click', function () {
      markAsRead(bookObject.id);
    });

    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = 'Hapus buku';

    removeButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    buttonContainer.append(readButton, removeButton);

    container.append(buttonContainer);
  }

  return container;
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function markAsRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}


function markAsUnread(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

// document.addEventListener(SAVED_EVENT, function () {
//   alert('Data Oke');
// });
