// call a funtion after the Dom has loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("The DOM has loaded");
  fetchDataFromServer();
});


// fetch books when a user searches for a book
function fetchDataFromServer() {
  const searchInput = document.getElementById("search");

  // Search event listener
  searchInput.addEventListener("input", (e) => {
    const searchQuery = e.target.value.trim(); // removes the white spaces in  the users input.
    fetch(`https://gutendex.com/books/?search=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => displayFetchedData(data.results));
  });

  // fetch all the books in the  server.
  fetch("https://gutendex.com/books/")
    .then((res) => res.json())
    .then((data) => displayFetchedData(data.results));
}

// Render books safely
function displayFetchedData(books) {
  const cardDisplay= document.getElementById("display-data");
  cardDisplay.innerHTML = ""; // clear old results

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

