import express from "express";
import { client } from "../index.js";
const router = express.Router();

//get all movies
router.get("/", async function (request, response) {
  const movie = await client
    .db("b42wd2")
    .collection("movies")
    .find({})
    .toArray(); // cursor -> pagination === .toArray()

  response.send(movie);
});

//get movies by id
router.get("/:id", async function (request, response) {
  const { id } = request.params;
  const movie = await client
    .db("b42wd2")
    .collection("movies")
    .findOne({ id: id });
  movie
    ? response.send(movie)
    : response.status(404).send({ message: "movie not found" });
});

//add new movies
//express.json - middleware

router.post("/", express.json(), async function (request, response) {
  const data = request.body;
  const result = await client
    .db("b42wd2")
    .collection("movies")
    .insertMany(data);

  response.send(result);
});

//delete movies
router.delete("/:id", express.json(), async function (request, response) {
  const { id } = request.params;

  const result = await client
    .db("b42wd2")
    .collection("movies")
    .deleteOne({ id: id });
  result.deletedCount >= 1
    ? response.send({ message: "Movie deleted successfully" })
    : response.status(404).send({ message: "movie not found" });
});

//update movies
router.put("/movies/:id", express.json(), async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await client
    .db("b42wd2")
    .collection("movies")
    .updateOne({ id: id }, { $set: data });
  response.send(result);
});

export default router;
