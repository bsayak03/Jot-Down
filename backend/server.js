const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const User = require("./models/user&noteModel.js");
/*app.use(
  cors({
    origin: { FRONTEND_URL },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);*/
app.use(cors());
app.use(express.json());

//app.use(cors());

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
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
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ notes: user.notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error" });
  }
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
