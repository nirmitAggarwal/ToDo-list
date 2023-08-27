const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path'); // Add this line

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas cluster
mongoose.connect('mongodb+srv://MANAV:MANAV@cluster0.eo6q4kl.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema and model for tasks
const taskSchema = new mongoose.Schema({
  description: String,
});
const Task = mongoose.model('Task', taskSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); // Serve static files (styles.css)

// Set up EJS templating
app.set('view engine', 'ejs');

// Routes

// Display tasks on the index page
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('index', { tasks });
  } catch (error) {
    console.error(error);
    res.render('index', { tasks: [] });
  }
});

// Save a new task
app.post('/', async (req, res) => {
  const description = req.body.description;

  const newTask = new Task({ description });

  try {
    await newTask.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Edit a task
app.post('/edit/:id', async (req, res) => {
  const taskId = req.params.id;
  const newDescription = req.body.description;

  try {
    const task = await Task.findByIdAndUpdate(taskId, { description: newDescription });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Delete a task
app.post('/delete/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    await Task.findByIdAndRemove(taskId);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
