const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI);
app.use(cors());
app.use(express.json());
const Task = mongoose.model("Task", {
  task: String,
  statue: { type: Boolean, default: false },
});

app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Welcom on ToDoList server" });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});
app.post("/addtask", async (req, res) => {
  try {
    const { task, statue } = req.body;
    if (task) {
      const newTask = new Task({
        task,
        statue,
      });
      await newTask.save();
      const tasks = await Task.find();
      res.status(201).json({ message: "Task created.", data: tasks });
    } else {
      res.status(400).json({ message: "Missing task." });
    }
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});
app.get("/gettasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ data: tasks });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});
app.put("/updatetasks?", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.query.id });

    task.statue = !task.statue;

    await task.save();
    const tasks = await Task.find();
    res.status(200).json({ message: "Task updated", data: tasks });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

app.delete("/deletetask?", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.query.id);
    const tasks = await Task.find();
    res.status(200).json({ message: "Task deleted", data: tasks });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});
app.all("*", (req, res) => {
  try {
    res.status(404).json({ message: "Page introuvable" });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server has started");
});
