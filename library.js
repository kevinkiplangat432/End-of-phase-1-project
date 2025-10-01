//  hello "me" in the previous js files you had the tendency of mixing up code like sphagetti so pls in this file try to keep evrything neat meaning all variables should be kept at the top of the file as of the dom content loaded evnt listeners.


// library.js
const displayData = document.getElementById("display-data");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter-select");
const sortSelect = document.getElementById("sort-select");
const darkModeBtn = document.getElementById("dark-mode-btn");

const modal = document.getElementById("book-modal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.getElementById("close-modal");

const readMode = document.getElementById("read-mode");
const readModeContent = document.querySelector(".read-mode-content");
const closeReadModeBtn = document.getElementById("close-read-mode");


let library = JSON.parse(localStorage.getItem("library")) || [];
let filteredBooks = [...library];


function renderBooks(books) {
  displayData.innerHTML = "";

  if (books.length === 0) {
    displayData.innerHTML = "<p>Your library is empty.</p>";
    return;
  }

  books.forEach(book => {
    const card = document.createElement("div");
    card.classList.add("book-card");

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p>Author: ${book.authors?.map(a => a.name).join(", ") || "Unknown"}</p>
      <p>Language: ${book.languages?.join(", ") || "N/A"}</p>
      <button onclick="openModal(${book.id})">Details</button>
      <button onclick="openReadMode(${book.id})">Read</button>
      <button onclick="removeFromLibrary(${book.id})">Remove</button>
    `;

    displayData.appendChild(card);
  });
}


function openModal(bookId) {
  const book = library.find(b => b.id === bookId);
  if (!book) return;

  modalBody.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>Author:</strong> ${book.authors?.map(a => a.name).join(", ") || "Unknown"}</p>
    <p><strong>Language:</strong> ${book.languages?.join(", ") || "N/A"}</p>
    <p><strong>Download:</strong> 
      <a href="${book.formats?.["text/html"] || "#"}" target="_blank">HTML</a> |
      <a href="${book.formats?.["application/epub+zip"] || "#"}" target="_blank">EPUB</a> |
      <a href="${book.formats?.["application/pdf"] || "#"}" target="_blank">PDF</a>
    </p>
    <button id="close-modal">✖</button>
  `;

  modal.classList.remove("hidden");

  document.getElementById("close-modal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}


function openReadMode(bookId) {
  const book = library.find(b => b.id === bookId);
  if (!book) return;

  readModeContent.innerHTML = `
    <h2>${book.title}</h2>
    <p>Author: ${book.authors?.map(a => a.name).join(", ") || "Unknown"}</p>
    <iframe src="${book.formats?.["text/html"] || ""}" width="100%" height="600px"></iframe>
  `;

  readMode.classList.remove("hidden");
}

closeReadModeBtn.addEventListener("click", () => {
  readMode.classList.add("hidden");
});


function removeFromLibrary(bookId) {
  library = library.filter(b => b.id !== bookId);
  localStorage.setItem("library", JSON.stringify(library));
  applyFilters(); // refresh view
}


function applyFilters() {
  const searchQuery = searchInput.value.toLowerCase();
  const language = filterSelect.value;
  const sortOption = sortSelect.value;

  filteredBooks = library.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery) ||
      (book.authors && book.authors.some(a => a.name.toLowerCase().includes(searchQuery)));
    const matchesLanguage = language === "all" || book.languages?.includes(language);
    return matchesSearch && matchesLanguage;
  });

  if (sortOption === "title-asc") {
    filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "title-desc") {
    filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortOption === "author-asc") {
    filteredBooks.sort((a, b) => {
      const authorA = a.authors?.[0]?.name || "";
      const authorB = b.authors?.[0]?.name || "";
      return authorA.localeCompare(authorB);
    });
  }

  renderBooks(filteredBooks);
}
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

searchInput.addEventListener("input", applyFilters);
filterSelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

applyFilters();
