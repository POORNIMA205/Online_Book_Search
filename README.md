# 📚 Bookora

### Discover. Explore. Read. Save.

Bookora is a modern **online book discovery and shopping web application** designed to make finding and exploring books simple, engaging, and visually appealing.

The application allows users to search for books, explore different categories, view detailed information, save books for later, add books to a shopping bag, and access available reading or preview content through an integrated Reading Room.

Bookora is built to provide the experience of a **digital bookstore rather than just a basic book-search application**.

---

## ✨ Features

### 🔍 Book Search

Search for books using keywords such as:

* Book title
* Author
* Subject
* Genre

Search results are presented as visually rich book cards containing relevant book information.

---

### 🗂️ Browse & Discover

Explore books through categories and subjects.

Users can discover books without having to know the exact title they are looking for.

---

### 📖 Book Details

Each book has a dedicated details experience containing available information such as:

* Book cover
* Title
* Author
* Publication year
* Edition count
* Description
* Subjects
* Genres
* Characters / people information when available
* Reading or preview availability

---

## 🏛️ Reading Room

Bookora includes an integrated **Reading Room** where users can explore available reading or preview content.

The experience is designed to remain within Bookora rather than unnecessarily sending users to another website.

### Reading flow

```text
Search Book
     ↓
Select Book
     ↓
Book Details
     ↓
Reading Room
     ↓
Read / Preview
```

When full text is not legally available, Bookora displays the available information about the book instead of reproducing copyrighted content.

---

## ❤️ Save for Later

Users can save interesting books for later.

This allows users to create a personal collection of books they may want to:

* Read
* Explore again
* Purchase later

---

## 🛒 Shopping Bag

Bookora provides a shopping-bag experience for books users are interested in purchasing.

Users can:

```text
Select Book
    ↓
Add to Bag
    ↓
View Bag
    ↓
Review Selected Books
    ↓
Continue Purchase
```

---

# 🎨 User Interface & Experience

Bookora focuses on creating a **clean, modern, bookstore-inspired interface**.

### Design principles

* Modern layout
* Clear navigation
* Attractive book cards
* Large book covers
* Strong typography
* Consistent spacing
* Simple interactions
* Responsive design
* Easy-to-understand controls
* Professional visual hierarchy

The application is designed to feel like a real digital product rather than a simple API demonstration.

---

# 🧩 Application Flow

```text
                         ┌───────────────┐
                         │    BOOKORA    │
                         └───────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
         Search Books        Categories        Saved Books
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │  Book Cards   │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │ Book Details  │
                         └───────┬───────┘
                                 │
                     ┌───────────┴───────────┐
                     │                       │
                     ▼                       ▼
                Reading Room            Shopping Bag
                     │                       │
                     ▼                       ▼
              Read / Preview              Purchase
```

---

# 🛠️ Technologies Used

## Frontend

* **React.js**
* **Vite**
* **JavaScript**
* **HTML5**
* **CSS3**

## Book Data

* **Open Library API**

The API provides available bibliographic information such as book titles, authors, covers, editions, subjects, and other book metadata.

## Application Packaging

* **Docker**
* **Nginx**

Docker is used as an optional way to package and run the application.

---

# 📁 Project Structure

```text
book-finder/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── index.html
├── package.json
├── package-lock.json
│
├── Dockerfile
├── .dockerignore
└── README.md
```

---

# 💻 Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

For Docker execution:

* Docker Desktop

---

# ▶️ Run the Project Locally

Open **Git Bash** and navigate to the project:

```bash
cd ~/Downloads/Online_book2/Online_book_order/book-finder
```

Install the required packages:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display a local address, normally:

```text
http://localhost:5173
```

Open the address in your browser.

---

# 🐳 Run with Docker

Docker is an optional method of running Bookora.

### Build the application

From the project directory:

```bash
cd ~/Downloads/Online_book2/Online_book_order/book-finder
```

Build the Docker image:

```bash
docker build -t bookora .
```

Run the application:

```bash
docker run -d --name bookora-container -p 5004:80 bookora
```

Check the container:

```bash
docker ps
```

Then open:

```text
http://localhost:5004
```

---

# 🔄 Docker Container Management

### Stop the application

```bash
docker stop bookora-container
```

### Start it again

```bash
docker start bookora-container
```

### View containers

```bash
docker ps -a
```

### View application logs

```bash
docker logs bookora-container
```

### Remove the container

```bash
docker rm bookora-container
```

---

# 🧪 Testing Checklist

## Book Discovery

* [ ] Application loads correctly
* [ ] Search works
* [ ] Search results appear
* [ ] Book covers load
* [ ] Categories work

## Book Details

* [ ] Book details open correctly
* [ ] Title is displayed
* [ ] Author is displayed
* [ ] Cover is displayed
* [ ] Publication information appears
* [ ] Description appears
* [ ] Subjects / genres appear

## Reading Room

* [ ] Reading Room opens
* [ ] Book information is displayed
* [ ] Preview / reading content appears when available
* [ ] Unavailable content is handled properly
* [ ] User remains inside the Bookora experience

## Shopping

* [ ] Add to Bag works
* [ ] Shopping Bag opens
* [ ] Save for Later works
* [ ] Saved books can be viewed

## Responsive Design

* [ ] Desktop layout works
* [ ] Tablet layout works
* [ ] Mobile layout works

---

# 🔐 Content & Copyright

Bookora uses publicly available book metadata and legally available reading or preview content.

The application does not intentionally reproduce copyrighted full books without authorization.

When full text is unavailable, the application provides the available book information and relevant actions instead.

---

# 🌱 Future Improvements

Bookora can be extended with additional features such as:

### 👤 User Accounts

* Sign up
* Login
* Personal profile
* Personal library

### 📚 Personal Library

* Currently reading
* Finished books
* Saved books
* Reading history

### ⭐ Reviews & Ratings

* User ratings
* Book reviews
* Review filtering

### 🛒 E-Commerce

* Quantity management
* Checkout
* Payment integration
* Order history
* Order tracking

### 📖 Better Reading Experience

* Reading progress
* Bookmarks
* Notes
* Font controls
* Reading themes
* Dark reading mode

### 🤖 Intelligent Features

* Personalized recommendations
* Similar-book suggestions
* AI-powered book discovery
* AI book summaries
* Conversational book assistant

---

# 🎯 Project Objective

The objective of Bookora is to create a **complete and engaging digital bookstore experience** that combines book discovery, information, reading, saving, and shopping in one application.

The project demonstrates how modern web technologies can be used to transform publicly available book data into an interactive and user-friendly application.

---

# 💡 Why Bookora?

Traditional book-search applications often focus only on:

```text
Search → Display Results
```

Bookora expands this experience into:

```text
Discover
   ↓
Explore
   ↓
Learn About the Book
   ↓
Read / Preview
   ↓
Save
   ↓
Add to Bag
   ↓
Purchase
```

This makes Bookora more than a simple book-search interface — it is designed as a **complete digital bookstore experience**.

---

# 📌 Project Highlights

| Feature          | Description                         |
| ---------------- | ----------------------------------- |
| 🔎 Search        | Find books quickly                  |
| 🗂️ Categories   | Discover books by subject           |
| 📖 Details       | Explore detailed book information   |
| 🏛️ Reading Room | Read or preview available content   |
| ❤️ Wishlist      | Save books for later                |
| 🛒 Shopping Bag  | Manage books selected for purchase  |
| 🎨 UI/UX         | Modern bookstore-inspired design    |
| 📱 Responsive    | Designed for different screen sizes |
| 🌐 API           | Book information from Open Library  |
| 🐳 Docker        | Optional containerized execution    |

---

# 👩‍💻 Author

**Poornima H B**

Bookora is a personal web application project focused on creating a modern, user-friendly online bookstore and reading experience.

---

# 📊 Project Status

**Status: Active Development 🚧**

The core Bookora experience is implemented, with additional features planned for future versions.

---

## 📚 BOOKORA

> **A place where books are discovered, explored, saved, and enjoyed.**

**Search. Discover. Read. Save.**
