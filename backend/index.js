const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = 5038;

app.use(cors());
app.use(express.json());

const CONNECTION_STRING =
  "mongodb+srv://skrpolu:Yrmsrskr@cluster0.8t7bx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "todoappdb";
let database;

// MongoDB Connection
MongoClient.connect(CONNECTION_STRING, (error, client) => {
  if (error) {
    console.error("Error connecting to MongoDB:", error);
    return;
  }
  database = client.db(DATABASE_NAME);
  console.log("MongoDB Connection Successful");

  // Start the server after MongoDB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Get All Notes
app.get("/api/todoapp/GetNotes", (req, res) => {
  database
    .collection("todoappcollection")
    .find({})
    .toArray((error, result) => {
      if (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(result);
    });
});

// Add New Note
app.post("/api/todoapp/AddNotes", multer().none(), (req, res) => {
  const newNote = req.body.newNotes;
  if (!newNote) {
    return res.status(400).json({ error: "Note content cannot be empty" });
  }

  database
    .collection("todoappcollection")
    .countDocuments({}, (error, count) => {
      const newNoteObject = {
        id: (count + 1).toString(),
        description: newNote,
      };
      database
        .collection("todoappcollection")
        .insertOne(newNoteObject, (error) => {
          if (error) {
            console.error("Error adding note:", error);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          res.json({ message: "Successfully added" });
        });
    });
});

// Delete a Note
app.delete("/api/todoapp/DeleteNotes", (req, res) => {
  const noteId = req.query.id;
  if (!noteId) {
    return res.status(400).json({ error: "Note ID is required" });
  }

  database
    .collection("todoappcollection")
    .deleteOne({ id: noteId }, (error) => {
      if (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json({ message: "Deleted Successfully" });
    });
});
