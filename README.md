# READIFY
Readify is a web application that lets you search, explore, and read free books from the Gutendex API
. It is lightweight, fast, and provides a distraction-free reading experience.A place where literature lovers can access 76000+ books.

## live demo
visit here for a live demo 

## Problem Definition
Accessing free books online can often be challenging because most platforms either require complex downloads, redirect readers to external websites with distracting layouts, or lack modern features like filtering and dark mode. Readers need a simple, user-friendly solution that allows them to search, explore, and read books directly in the browser without unnecessary friction. Readify addresses this problem by providing a clean interface powered by the Gutendex API, offering search, filtering, sorting, and a distraction-free Read Mode all in one place.

## features
Search books by title, author, or keyword.

Filter results by language.

Sort books by title or author name.

Paginate through search results easily.

Toggle between light mode and dark mode.

Read Mode for a fullscreen, distraction-free reader.

Book details including summary, genres, and shelves.

## tech Stack
Readify is built using a lightweight front-end stack to ensure speed, simplicity, and accessibility. The interface is structured with HTML5 for semantic markup, styled with CSS3 to provide a responsive layout, dark mode, and polished UI components, and powered by Vanilla JavaScript (ES6) for dynamic rendering, API requests, filtering, sorting, and pagination. All book data comes from the Gutendex API, a free and open-source wrapper around Project Gutenberg, which provides metadata, book formats, and cover images without requiring authentication or paid access.

## getting started.
Follow these steps to run Readify locally or deploy it online:

### Prerequisites

A web browser (Chrome, Firefox, Edge, etc.)

Git
 installed on your system

(Optional) Node.js
 if you want to use a local dev server

### Installation

Clone the repository

git clone https://github.com/your-username/readify.git
cd readify


Open the project

Simply double-click index.html to open it in your browser

Or run a lightweight server (recommended for best results)

Run a local server (optional)
If you have Node.js installed, you can start a quick server:

npx serve .


Then open http://localhost:3000
 in your browser

### Deployment
GitHub Pages

Push your project to a GitHub repository

Go to Settings → Pages

Select branch: main and folder: / (root)

Save and wait a few minutes for deployment

Your site will be live at:

https://<your-username>.github.io/readify/

### Netlify (alternative)

Log into Netlify

Click New site from Git

Connect your GitHub repo

Deploy → Netlify provides a live link instantly

## Usage.
Once the project is running (either locally or online), follow these steps to use Readify:

### Search for a Book

##### Enter a title, author name, or keyword in the search bar.

Results will update after a short pause (debounced search).

##### Filter by Language

Use the language dropdown to narrow results.

Example: Select English to only see English books.

##### Sort Results

Use the sort dropdown to reorder books by title (A–Z, Z–A) or by author name.

##### Navigate with Pagination

Use Next and Previous buttons to move between result pages.

Buttons are disabled if there are no more results.

##### View Book Details

Click on a book card (left pane) to see its details in the right pane.

Details include title, author, cover, summary, genres, and shelves.

##### Enter Read Mode

In the book details pane, click **Read Mode**.

A fullscreen modal opens showing the book’s text (plain text if available, or HTML in an embedded frame).

Use the close button (×) to exit Read Mode.

##### Toggle Dark Mode

Click the Dark Mode toggle button to switch between light and dark themes.


## project structure
The project is designed to be lightweight and easy to navigate. Below is the folder and file layout:

readify/
│── index.html        # Main entry point – contains the app layout and containers
│── style.css         # Styling for the entire app (layout, cards, dark mode, modals)
│── script.js         # Core JavaScript logic (API calls, filtering, sorting, pagination, Read Mode)
│── assets/           # Optional folder for images, icons, or screenshots
│── README.md         # Documentation for the project

### File Descriptions

index.html → Contains the structure of the website, including the search bar, filter/sort controls, pagination buttons, and containers for the book list and details pane.

style.css → Manages the look and feel of the app, including responsive layout, dark mode styles, hover effects, and Read Mode modal design.

script.js → Handles all interactivity:

Fetches data from the Gutendex API

Displays book cards in the left pane

Shows detailed info in the right pane

Manages filtering, sorting, and pagination

Opens the Read Mode modal and loads book content

assets/ → Stores any project images such as logos, background images, or README screenshots.

README.md → Project documentation (the file you’re reading now).

## API reference 
Readify uses the Gutendex API
, an open-source wrapper around Project Gutenberg that provides free book metadata, formats, and cover images.

### Base URL
https://gutendex.com/books/

### Example Query

Search for books by keyword (e.g., "Moby Dick"):

https://gutendex.com/books/?search=moby+dick


Filter by language (e.g., English only):

https://gutendex.com/books/?languages=en


Paginate results (e.g., page 2):

https://gutendex.com/books/?page=2

## future improvement.
Readify is functional, but there are many ways it can be improved to provide a richer reading experience and more flexibility for users. Planned enhancements include:

### Advanced Read Mode

Add text size controls (increase / decrease font size)

Toggle line spacing and font style for better readability

Adjustable background themes (sepia, dark, light)

Save user preferences (so settings persist across sessions)

### Favorites / Wishlist

Allow users to bookmark books and store them in localStorage

Add a “Favorites” tab to easily access saved books

### Download Options

Provide buttons to download EPUB, MOBI, or Plain Text versions directly

Display file size where available

### Popularity Sorting

Add sorting by download_count (most popular books first)

### Improved Mobile Experience

Responsive layout optimized for smaller screens

Mobile-first Read Mode with swipe navigation

### Enhanced Search Filters

Filter by subject, bookshelf, or author birth year

Combine multiple filters for more precise results

## contributing
Contributions, issues, and feature requests are welcome! 

If you’d like to contribute to Readify, please follow these steps:

Fork the repository

Click the Fork button at the top right of this page to create your own copy.

Clone your fork

git clone https://github.com/<your-username>/readify.git
cd readify


Create a new branch

git checkout -b feature-name


Make your changes

Add your code, improve documentation, or fix bugs.

Commit your changes

git commit -m "Add: short description of changes"


Push to your branch

git push origin feature-name


Open a Pull Request

Go to the original repository and open a pull request from your forked branch.

Clearly describe what you changed and why.

## license
This project is licensed under the MIT License – you are free to use, modify, and distribute it, provided that proper credit is given. See the LICENSE
 file for details.

LICENSE (MIT)

Create a file named LICENSE in your project root and add this text:

MIT License

Copyright (c) 2025 Kevin Kiplangat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.