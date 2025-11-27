const Book = require('../models/Book');

// GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

// POST /api/books
exports.createBook = async (req, res) => {
  try {
    const { title, author, subject, quantity } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
    if (!author || !author.trim()) return res.status(400).json({ message: 'Author is required' });
    if (!subject || !subject.trim()) return res.status(400).json({ message: 'Subject is required' });
    if (quantity === undefined || quantity === null || isNaN(quantity)) return res.status(400).json({ message: 'Quantity is required' });

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      subject: subject.trim(),
      quantity: Math.max(0, Number(quantity)),
      createdBy: req.user && req.user.id ? req.user.id : undefined,
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create book' });
  }
};

// PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, subject, quantity } = req.body;
    const update = {};
    if (title !== undefined) update.title = String(title).trim();
    if (author !== undefined) update.author = String(author).trim();
    if (subject !== undefined) update.subject = String(subject).trim();
    if (quantity !== undefined) update.quantity = Math.max(0, Number(quantity));

    const book = await Book.findByIdAndUpdate(id, update, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update book' });
  }
};

// DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
};
