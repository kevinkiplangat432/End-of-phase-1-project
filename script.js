// call a funtion after the Dom has loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("The DOM has loaded");
  fetchDataFromServer();
});
// Global state for pagination
let nextUrl = null;
let prevUrl = null;


// fetch books when a user searches for a book
function fetchDataFromServer() {
  const searchInput = document.getElementById("search");
  let searchTimeout;
  // Search event listener
    searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
  const searchQuery = e.target.value.trim();
  const searchUrl = searchQuery
    ? `https://gutendex.com/books/?search=${searchQuery}`
    : "https://gutendex.com/books/";
  fetchBooks(searchUrl);
  }, 300); // Debounce time of 300ms
});

  // fetch all the books in the  server.
  fetchBooks("https://gutendex.com/books/")
}

function fetchBooks(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayFetchedData(data.results);

      // Save pagination links
      nextUrl = data.next;
      prevUrl = data.previous;

      // Enable/disable buttons
      document.getElementById("next-btn").disabled = !nextUrl;
      document.getElementById("prev-btn").disabled = !prevUrl;
    })
    .catch((err) => console.error("Error fetching books:", err));
}

// Render books safely
function displayFetchedData(books) {
  const cardDisplay= document.getElementById("display-data");
  cardDisplay.innerHTML = ""; // clear old results
  if (!books.length) {
  cardDisplay.innerHTML = "<p id='error-search-message'> Sorry no books found.</p>";
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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("next-btn").addEventListener("click", () => {
    if (nextUrl) fetchBooks(nextUrl);
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (prevUrl) fetchBooks(prevUrl);
  });
});
//book filtering by language
let booksData = [];      // raw results from API (current page)
let filteredBooks = [];  // results after filter/sort

function filterBooksByLanguage(language) {
  // Assume booksData is your last fetched list of books
  let filtered = [...booksData];  

  if (language !== "all") {
    filtered = filtered.filter(book => 
      book.languages && book.languages.includes(language)
    );
  }

  displayBookDetails(filtered); // call your display/render function
}
const filterSelect = document.getElementById("filter-select");
filterSelect.addEventListener("change", () => {
  filterBooksByLanguage(filterSelect.value);
});

