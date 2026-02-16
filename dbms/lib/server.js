const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // for frontend files

// Helper functions to read/write JSON
const readBooks = () => {
    if (!fs.existsSync("books.json")) return [];
    return JSON.parse(fs.readFileSync("books.json", "utf-8"));
};

const saveBooks = (data) => {
    fs.writeFileSync("books.json", JSON.stringify(data, null, 2));
};

// Routes
app.get("/books", (req, res) => {
    const books = readBooks();
    res.json(books);
});

app.post("/books", (req, res) => {
    const books = readBooks();
    const { title, author } = req.body;
    const id = Date.now(); // simple unique id
    books.push({ id, title, author });
    saveBooks(books);
    res.json({ message: "Book added successfully", book: { id, title, author } });
});

app.delete("/books/:id", (req, res) => {
    const books = readBooks();
    const id = parseInt(req.params.id);
    const newBooks = books.filter(book => book.id !== id);
    saveBooks(newBooks);
    res.json({ message: "Book deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
