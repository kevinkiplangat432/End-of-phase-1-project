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
//book filtering by language
let booksData = [];      // raw results from API (current page)
let filteredBooks = [];  // results after filter/sort




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
  modalBody.innerHTML = ""; // clear old content

  // Title
  const titleEl = document.createElement("h2");
  titleEl.textContent = book.title;

  // Author
  const authorEl = document.createElement("p");
  authorEl.innerHTML = `<strong>Author:</strong> ${
    book.authors.length ? book.authors.map(a => a.name).join(", ") : "Unknown"
  }`;

  // Cover Image
  const coverImg = document.createElement("img");
  coverImg.src = book.formats["image/jpeg"] || "placeholder.jpg";
  coverImg.alt = book.title;
  coverImg.style.maxWidth = "200px";
  coverImg.style.margin = "1rem 0";

  // Language
  const langEl = document.createElement("p");
  langEl.innerHTML = `<strong>Language:</strong> ${book.languages.join(", ")}`;

  // Subjects
  const subjectsEl = document.createElement("p");
  const subjectsText = (book.subjects || []).slice(0, 5).join(", ") || "N/A";
  subjectsEl.innerHTML = `<strong>Subjects:</strong> ${subjectsText}`;

  // Read Online Link
  const readLink = document.createElement("a");
  readLink.href = book.formats["text/html"] || "#";
  readLink.target = "_blank";
  readLink.classList.add("read-link");
  readLink.textContent = "Read Online";

  // Close button (your ✖)
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "X";
  closeBtn.classList.add("close-btn");
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

    const library = document.createElement ("button")
    library.textContent = "Add to library"
    library.classList.add ("library-btn")
    library.addEventListener("click", ()=> {
      addToLibrary(book.id)
    })

  // Append everything
  modalBody.appendChild(titleEl);
  modalBody.appendChild(authorEl);
  modalBody.appendChild(coverImg);
  modalBody.appendChild(langEl);
  modalBody.appendChild(subjectsEl);
  modalBody.appendChild(readLink);
  modalBody.appendChild(closeBtn);
  modalBody.appendChild(library)

  // Show modal
  modal.classList.remove("hidden");

  // Close modal when clicking outside
  window.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  };
}





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






function addToLibrary(bookId) {
  // Get current library from localStorage
  let library = JSON.parse(localStorage.getItem("library")) || [];

  // Find the book in your current data
  const book = booksData.find(b => b.id === bookId);

  // Check if already exists
  if (!library.some(b => b.id === bookId)) {
    library.push(book);
    localStorage.setItem("library", JSON.stringify(library));
    alert(`${book.title} has been added to your Library!`);
  } else {
    alert(`${book.title} is already in your Library.`);
  }
}
