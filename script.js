// call a funtion after the Dom has loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("The DOM has loaded");
  fetchDataFromServer();
  // pagination button event listeners
  document.getElementById("next-btn").addEventListener("click", () => {
    if (nextUrl) fetchBooks(nextUrl);// fetch next page
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (prevUrl) fetchBooks(prevUrl);// fetch previous page
  });
  document.getElementById("dark-mode-btn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
});
// Loader functions
function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}
function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}
// Update pagination buttons state
function updatePagination(next, previous) {
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  nextBtn.disabled = !next;
  prevBtn.disabled = !previous;
}
let nextUrl = null;
let prevUrl = null;

// fetch books when a user searches for a book
function fetchDataFromServer() {
  const searchInput = document.getElementById("search");
  let searchTimeout; // for debouncing
  // Search event listener
    searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout); //removes any previously set timeout
  //applying the debounce
  searchTimeout = setTimeout(() => {
  const searchQuery = e.target.value.trim(); // clean up input
  // construct search URL
let searchUrl;
if (searchQuery) {
  searchUrl = `https://gutendex.com/books/?search=${searchQuery}`;

} else {
  searchUrl = "https://gutendex.com/books/";

}
// fetch books based on search
  fetchBooks(searchUrl);
  }, 300); // Debounce time of 300ms
});

  // fetch all the books in the  server.
  fetchBooks("https://gutendex.com/books/") // initial fetch

}

function fetchBooks(url) {
  showLoader();
  fetch(url)
    .then(res => res.json())
    .then(data => {
      hideLoader();
      booksData = data.results;

      filterBooksByLanguage(document.getElementById("filter-select").value);
      // Save pagination links
      nextUrl = data.next;
      prevUrl = data.previous;
      updatePagination(nextUrl, prevUrl);
    })
    .catch(err => {
      hideLoader();
      console.error("Error fetching books:", err)});
}

// display fetched data in the left pane
// display fetched data in the grid
function displayFetchedData(booksArray) {
  const displayDataDiv = document.getElementById("display-data");
  displayDataDiv.innerHTML = "";

  booksArray.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    // Cover
    const coverImage = document.createElement("img");
    coverImage.src = book.formats["image/jpeg"] || "placeholder.jpg";
    coverImage.alt = book.title;

    // Title
    const title = document.createElement("h3");
    title.textContent = book.title;

    // Author
    const author = document.createElement("p");
    author.textContent = book.authors.length
      ? book.authors.map(a => a.name).join(", ")
      : "Unknown Author";

    // View Button
    const viewBtn = document.createElement("button");
    viewBtn.textContent = "View Book";
    viewBtn.classList.add("view-btn");
    viewBtn.addEventListener("click", () => {
      openDetailsModal(book);
    });

    // Build card
    bookCard.appendChild(coverImage);
    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(viewBtn);

    displayDataDiv.appendChild(bookCard);
  });
}

function openDetailsModal(book) {
  const modal = document.getElementById("book-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = modal.querySelector(".close-btn");

  // Fill modal content
  modalBody.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>Author:</strong> ${book.authors.map(a => a.name).join(", ") || "Unknown"}</p>
    <img src="${book.formats["image/jpeg"] || "placeholder.jpg"}" alt="${book.title}" style="max-width:200px; margin:1rem 0;">
    <p><strong>Language:</strong> ${book.languages.join(", ")}</p>
    <p><strong>Subjects:</strong> ${(book.subjects || []).slice(0,5).join(", ") || "N/A"}</p>
    <a href="${book.formats["text/html"] || "#"}" target="_blank" class="read-link">Read Online</a>
  `;

  // Show modal
  modal.classList.remove("hidden");

  // Close events
  closeBtn.onclick = () => modal.classList.add("hidden");
  window.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

  // Hook read mode button
  modal.querySelector(".read-mode-btn").addEventListener("click", () => openReadMode(book));
}

//book filtering by language
let booksData = [];      // raw results from API (current page)
let filteredBooks = [];  // results after filter/sort

function filterBooksByLanguage(language) {
  // Assume booksData is your last fetched list of books
  let filtered = [...booksData];  

  if (language !== "all") {
    //loops through the books and filters them by language
    filtered = filtered.filter(book => 
      book.languages && book.languages.includes(language)
    );
  }
  filteredBooks = applySorting(filtered); // apply current sorting
  displayFetchedData(filteredBooks); // call your display/render function
}
//handle filter change event
const filterSelect = document.getElementById("filter-select");
filterSelect.addEventListener("change", () => {
  filterBooksByLanguage(filterSelect.value);
});
// sorting function
function applySorting(books) {
  const sortValue = document.getElementById("sort-select").value;
  let sorted = [...books];
// sorting logic
  if (sortValue === "title-asc") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "title-desc") {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortValue === "author-asc") {
    sorted.sort((a, b) => {
      const authorA = a.authors.length ? a.authors[0].name : "";
      const authorB = b.authors.length ? b.authors[0].name : "";
      return authorA.localeCompare(authorB);
    });
  }
  return sorted;
}
const sortSelect = document.getElementById("sort-select");
sortSelect.addEventListener("change", () => {
  // Reapply filter with new sorting
  filterBooksByLanguage(document.getElementById("filter-select").value);
});
// Read Mode Implementation
function openReadMode(book) {
  const readMode = document.getElementById("read-mode");
  const content = document.querySelector(".read-mode-content");

  // Reset before loading
  content.innerHTML = "<p>Loading book...</p>";
  readMode.classList.remove("hidden");

  // Prefer plain text → fallback to HTML
  let bookUrl =
    book.formats["text/plain; charset=utf-8"] ||
    book.formats["text/plain; charset=us-ascii"] ||
    book.formats["text/plain"] ||
    book.formats["text/html"];

  if (!bookUrl) {
    content.innerHTML = "<p> Sorry, this book is not available in Read Mode.</p>";
    return;
  }

  fetch(bookUrl)
    .then(res => res.text())
    .then(data => {
      if (bookUrl.includes("text/plain")) {
        // Clean reader view
        content.innerHTML = `
          <h1>${book.title}</h1>
          <h2>${book.authors.map(a => a.name).join(", ") || "Unknown Author"}</h2>
          <pre class="book-text">${data}</pre>
        `;
      } else {
        // Sandbox HTML version
        content.innerHTML = `
          <h1>${book.title}</h1>
          <h2>${book.authors.map(a => a.name).join(", ") || "Unknown Author"}</h2>
          <iframe src="${bookUrl}" class="book-frame"></iframe>
        `;
      }
    })
    .catch(err => {
      content.innerHTML = "<p>⚠ Error loading book in Read Mode.</p>";
      console.error("Read Mode error:", err);
    });
}