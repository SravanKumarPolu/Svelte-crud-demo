const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
const PORT = 5038;

const CONNECTION_STRING =
  "mongodb+srv://skrpolu:Yrmsrskr@cluster0.8t7bx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "todoappdb";
let database;

app.listen(PORT, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    if (error) {
      console.error("Error connecting to MongoDB:", error);
      return;
    }
    database = client.db(DATABASE_NAME);
    console.log("MongoDB Connection Successful");
  });
});

app.use(express.json());

app.get("/api/todoapp/Getnote", (req, res) => {
  database
    .collection("todoappcollection")
    .find({})
    .toArray((err, result) => {
      if (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "internal server error" });
        return;
      }
      res.json(result);
    });
});

app.post("/api/todoapp/AddNotes", multer().none(), (req, res) => {
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
            console.error("Error fetching notes:", error);
            res.status(500).json({ error: "internal server error" });
            return;
          }
          res.json({ message: "Successfully added" });
        });
    });
});

app.delete("/app/todoapp/DeleteNotes", (req, res) => {
  const noteId = res.query.id;
  database
    .collection("todoappcollection")
    .deleteOne({ id: noteId }, (error) => {
      if (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "internal server error" });
        return;
      }
      res.json({ message: "Deleted Successfully" });
    });
});
