//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion } from "mongodb";
import { ObjectId } from "mongodb";
import _ from "lodash";
import dotenv from "dotenv/config";
import pg from "pg";

const app = express();
const port = 3000;

let items = [];

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: process.env.DB_PASSWORD,
  port: 5432,
});
db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({title: item});
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// async function connectToMongoDB() {
//   const client = new MongoClient(url, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     },
//   });

//   try {
//     await client.connect();
//     console.log("Connected to MongoDB");

//     const db = await client.db("todolistDB");

//     app.get("/", async (req, res) => {
//       TodaylistOfTask = await db
//         .collection("Today")
//         .find({})
//         .toArray(function (err, result) {
//           if (err) throw err;
//           console.log(result);
//           db.close();
//         });
//       if (TodaylistOfTask.length == 0) {
//         await db
//           .collection("Today")
//           .insertMany([
//             { task: "Welcome to your todo list!" },
//             { task: "Press enter key or submit button to add a new item." },
//             { task: "<-- Hit this to delete an item." },
//           ]);
//         TodaylistOfTask = await db
//           .collection("Today")
//           .find({})
//           .toArray(function (err, result) {
//             if (err) throw err;
//             console.log(result);
//             db.close();
//           });
//         res.render("index.ejs", { type: "Today", list: TodaylistOfTask });
//       } else {
//         res.render("index.ejs", {
//           type: "Today",
//           list: TodaylistOfTask,
//         });
//       }
//     });

//     app.get("/about", (req, res) => {
//       res.render("about.ejs");
//     });

//     app.post("/about", (req, res) => {
//       res.redirect("/about");
//     });

//     app.get("/:customListName", async (req, res) => {
//       const customListName = req.params.customListName;
//       const customListNameCapitalized = _.capitalize(customListName);
//       var customList = await db
//         .collection(customListNameCapitalized)
//         .find({})
//         .toArray(function (err, result) {
//           if (err) throw err;
//           console.log(result);
//           db.close();
//         });
//       if (customList.length == 0) {
//         await db
//           .collection(customListNameCapitalized)
//           .insertMany([
//             { task: "Welcome to your todo list!" },
//             { task: "Press enter key or submit button to add a new item." },
//             { task: "<-- Hit this to delete an item." },
//           ]);
//         customList = await db
//           .collection(customListNameCapitalized)
//           .find({})
//           .toArray(function (err, result) {
//             if (err) throw err;
//             console.log(result);
//             db.close();
//           });
//         res.render("index.ejs", {
//           type: customListNameCapitalized,
//           list: customList,
//         });
//       } else {
//         res.render("index.ejs", {
//           type: customListNameCapitalized,
//           list: customList,
//         });
//       }
//     });

//     app.post("/", async (req, res) => {
//       const newTask = req.body["input"];
//       const listN = await req.body.something;
//       console.log(listN);
//       const listName = _.capitalize(listN);
//       if (listName === "Today") {
//         const result = await db
//           .collection("Today")
//           .insertOne({ task: newTask });
//         res.redirect("/");
//       } else {
//         const result = await db
//           .collection(listName)
//           .insertOne({ task: newTask });
//         res.redirect("/" + listName);
//       }
//     });

//     app.post("/delete", async (req, res) => {
//       const checkedItemId = req.body.checkbox;
//       const listName = req.body.hidden;
//       const capListName = _.capitalize(listName);
//       const checkedItemObjectID = new ObjectId(checkedItemId);
//       if (listName !== "Today") {
//         const result = await db
//           .collection(capListName)
//           .deleteOne({ _id: checkedItemObjectID });
//         setTimeout(() => {
//           res.redirect("/" + listName);
//         }, 500);
//       } else {
//         const result = await db
//           .collection("Today")
//           .deleteOne({ _id: checkedItemObjectID });
//         setTimeout(() => {
//           res.redirect("/");
//         }, 500);
//       }
//     });

//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error("Error:", err);
//   } finally {
//     // await client.close(function (err, result) {
//     //   if (err) throw err;
//     //   console.log(result);
//     // });
//   }
// }

// connectToMongoDB().catch(console.error);
