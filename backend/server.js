const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/tasks', async (req, res) => {
  const { priority } = req.query;
  const validPriorities = ['Low', 'Medium', 'High'];

  if (priority !== undefined && !validPriorities.includes(priority)) {
    return res.status(400).json({
      message: 'Priority must be Low, Medium, or High.',
    });
  }

  try {
    const filter = priority ? { priority } : {};
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});

app.put('/api/tasks/:id/complete', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid task ID.' });
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.completed) {
      return res.status(409).json({ message: 'Task is already completed.' });
    }

    task.completed = true;
    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to complete task.' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, priority } = req.body || {};

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Title cannot be empty.' });
  }

  if (!['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({
      message: 'Priority must be Low, Medium, or High.',
    });
  }

  try {
    const task = await Task.create({
      title: title.trim(),
      priority,
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create task.' });
  }
});

// Connect to MongoDB using the connection string from your .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });