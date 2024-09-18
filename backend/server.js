const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();
const PORT = process.env.PORT || 5000;
const MONGODB_URl = process.env.MONGODB_URl;

const User = require("./models/user&noteModel.js");

app.use(express.json());
app.use(
  cors({
    origin: "https://jot-down-tswx.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(MONGODB_URl)
  .then(() => {
    console.log(`Connected to DB`);
  })
  .catch((err) => {
    console.log(err.message);
  });

// Create a note => using POST
app.post("/note/:userId", async (req, res) => {
  const { userId } = req.params;
  const { title, description, tags } = req.body;

  try {
    // Find the user by userId
    let user = await User.findOne({ userId });

    if (!user) {
      // If user doesn't exist, create a new one with the note and a default note
      user = new User({
        userId,
        notes: [
          { title, description, tags }, // The note from the request body
          {
            title: "Sample Note",
            description:
              "Welcome to Jot Down, this is a sample note. Feel free to delete it",
            tags: "default",
          }, // Default note
        ],
      });
    } else {
      // If user exists, add the note to the notes array
      user.notes.push({ title, description, tags });
    }

    // Save the user (either newly created or updated)
    await user.save();

    res.json({ user });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//fetching all the notes of a particular user
app.get("/notes/:userId", async (req, res) => {
  const userId = req.params.userId;
  //or
  //const {userId}=req.params;

  const user = await User.findOne({ userId });

  res.json({ notes: user.notes });
});

//fetching a particular note of a particular user by its noteId
app.get("/note/:userId/:noteId", async (req, res) => {
  const { userId, noteId } = req.params;

  const user = await User.findOne({ userId });
  const note = user.notes.id(noteId);
  res.json({ note });
});

//update a particular note of a particular user by its noteId
app.put("/note/:userId/:noteId", async (req, res) => {
  const { userId, noteId } = req.params;
  const { title, description, tags } = req.body;

  const user = await User.findOne({ userId });
  const note = user.notes.id(noteId);

  note.title = title || note.title;
  note.description = description || note.description;
  note.tags = tags || note.tags;

  await user.save();

  res.json({ note });
});

//deletes all the notes of a particular userId
app.delete("/notes/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ userId });

  user.notes = [];
  await user.save();

  res.json({ message: "All Notes sucessfully deleted" });
});

//deleting a particular note of a particular user by its noteId
app.delete("/notes/:userId/:noteId", async (req, res) => {
  const { userId, noteId } = req.params;
  const user = await User.findOne({ userId });

  const noteIndex = user.notes.findIndex(
    (note) => note._id.toString() === noteId
  );
  user.notes.splice(noteIndex, 1);
  await user.save();
  res.json({ message: "Note successfully deleted" });
});

app.listen(PORT, () => {
  console.log(`Server Listening on PORT ${PORT}`);
});
