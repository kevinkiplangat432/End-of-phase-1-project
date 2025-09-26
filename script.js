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
function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}
function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}
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

// Render books safely
function displayFetchedData(books) {
  const cardDisplay= document.getElementById("display-data");
  cardDisplay.innerHTML = ""; // clear old results

  if (books.length === 0) {
  cardDisplay.innerHTML = "<p id='error-search-message'> Sorry no books found.</p>";
  return;
  }
  if (!books || !books.length) {
  cardDisplay.innerHTML = "<p class='empty-message'>Sorry no books found. Try another search.</p>";
  return;
}

  books.forEach((book) => {
    // creates the inner html for the data.
    const card = document.createElement("div");
    // for displaying data when i click on a card.
    card.classList.add("book-card");
    card.addEventListener("click", () => {
      displayBookDetails(book) 
    })

    const title = document.createElement("h2");
    title.textContent = book.title;

    const author = document.createElement("p");
    // iterate through authors array to get names
    author.textContent = book.authors.map((a) => a.name).join(", ") || "Unknown";

    const img = document.createElement("img");
    img.src = book.formats["image/jpeg"] || "";
    img.alt = book.title;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(author);
    cardDisplay.appendChild(card);
  });
}
// display book details in the right pane
function displayBookDetails(book) {
  const rightPane = document.getElementById("right-pane");
  rightPane.innerHTML = ""; // clear old details

  const title = document.createElement("h2");
  title.textContent = book.title;
  title.style.fontSize = "24px";
  title.style.fontWeight = "bold";
  rightPane.appendChild(title);
  const author = document.createElement("p");
  author.textContent = book.authors.map(a => a.name).join(", ") || "Unknown";
    rightPane.appendChild(author);
  const img = document.createElement("img");
  img.src = book.formats["image/jpeg"] || "";
  img.alt = book.title;
  img.classList.add("book-detail-image");
  rightPane.appendChild(img);
  const lang = document.createElement("p");
  lang.textContent = `Language: ${book.languages.join(", ")}`;
  rightPane.appendChild(lang);
  const link = document.createElement("a");
  link.href = book.formats["text/html"] || "#";
  link.target = "_blank";
  link.textContent = "Read Book";
  rightPane.appendChild(link);
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
