const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Load environment variables (you should use .env file in practice)
const PORT = 8080;
const MONGODB_URI = 'mongodb+srv://raptor:fu3MrWMoRSx1Dibl@cluster0.2scm9rz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const app = express();


app.use(bodyParser.json());
app.use(express.json());


const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB successfully');
        await createBooks(); // Creating new books
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Schema definition
const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    author: { 
        type: String, 
        required: true,
        trim: true 
    },
    year: { 
        type: Number, 
        required: true,
        min: 0,
        max: new Date().getFullYear()
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);


const sampleBookData = [
    {
        title: "Title1",
        author: "Author1",
        year: 1000,
        price: 10
    },
    {
        title: "Title2",
        author: "Author2",
        year: 1000,
        price: 10
    },
    {
        title: "Title3",
        author: "Author3",
        year: 1000,
        price: 10
    },
    {
        title: "Title4",
        author: "Author4",
        year: 1000,
        price: 10
    }
];

// Initialize books function
async function createBooks() {
    try {
        const existingBooks = await Book.find();
        
        if (existingBooks.length === 0) {
            const result = await Book.insertMany(sampleBookData);
            console.log(`Initialized database with ${result.length} sample books`);
        } else {
            console.log(`Database already contains ${existingBooks.length} books`);
        }
    } catch (error) {
        console.error('Error initializing books:', error);
    }
}

// API Routes
// POST /books: Add a new book
app.post('/books', async (req, res) => {
    try {
        const { title, author, year, price } = req.body;
        
        if (!title || !author || !year || !price) {
            return res.status(400).json({ 
                error: 'All fields (title, author, year, price) are required' 
            });
        }

        const newBook = new Book({ title, author, year, price });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(500).json({ 
            error: 'Error creating book', 
            details: err.message 
        });
    }
});

// GET /books: Get all books with optional filtering
app.get('/books', async (req, res) => {
    try {
        const { author, year } = req.query;
        let query = {};
        
        if (author) query.author = new RegExp(author, 'i');
        if (year) query.year = year;

        const books = await Book.find(query);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ 
            error: 'Error fetching books',
            details: err.message 
        });
    }
});

// GET /books/:id: Get a book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ 
            error: 'Error fetching book',
            details: err.message 
        });
    }
});

// PUT /books/:id: Update a book
app.put('/books/:id', async (req, res) => {
    try {
        const { title, author, year, price } = req.body;
        
        if (!title || !author || !year || !price) {
            return res.status(400).json({ 
                error: 'All fields (title, author, year, price) are required' 
            });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, year, price },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ 
            error: 'Error updating book',
            details: err.message 
        });
    }
});

// DELETE /books/:id: Delete a book
app.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ 
            message: 'Book deleted successfully',
            book: deletedBook 
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'Error deleting book',
            details: err.message 
        });
    }
});

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch(console.error);
