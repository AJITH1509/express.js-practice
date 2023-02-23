import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
// const express = require("express"); for type :"command"
import express from "express";
import { MongoClient } from "mongodb";
const app = express();

const PORT = process.env.PORT;

// const MONGO_URL = "mongodb://127.0.0.1";

const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.get("/movies", async function (request, response) {
  const movie = await client
    .db("b42wd2")
    .collection("movies")
    .find({})
    .toArray(); // cursor -> pagination === .toArray()

  response.send(movie);
});

app.get("/movies/:id", async function (request, response) {
  const { id } = request.params;
  const movie = await client
    .db("b42wd2")
    .collection("movies")
    .findOne({ id: id });
  movie
    ? response.send(movie)
    : response.status(404).send({ message: "movie not found" });
});

//express.json - middleware

app.post("/movies", express.json(), async function (request, response) {
  const data = request.body;
  const result = await client
    .db("b42wd2")
    .collection("movies")
    .insertMany(data);

  response.send(result);
});

app.delete("/movies/:id", express.json(), async function (request, response) {
  const { id } = request.params;

  const result = await client
    .db("b42wd2")
    .collection("movies")
    .deleteOne({ id: id });
  result.deletedCount >= 1
    ? response.send({ message: "Movie deleted successfully" })
    : response.status(404).send({ message: "movie not found" });
});

app.put("/movies/:id", express.json(), async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await client
    .db("b42wd2")
    .collection("movies")
    .updateOne({ id: id }, { $set: data });
  response.send(result);
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
