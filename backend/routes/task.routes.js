const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const { title, description, dueDate, category } = req.body;
  if (!title) {
    return res.status(400).send('Title is required');
  }
  try {
    const newTask = new Task({ title, description, dueDate, category });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { title, description, completed, dueDate, category } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    if (completed !== undefined && task.completed === completed) {
      return res.status(400).send('Task completion status is already set');
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    task.dueDate = dueDate || task.dueDate;
    task.category = category || task.category;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
