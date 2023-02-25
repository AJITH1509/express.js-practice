import express from "express";
import {
  getMovies,
  getMovieById,
  addMovie,
  deleteMovies,
  updateMovie,
} from "../service/movies.service.js";
const router = express.Router();

//get all movies
router.get("/", async function (request, response) {
  const movie = await getMovies(); // cursor -> pagination === .toArray()
  response.send(movie);
});

//get movies by id
router.get("/:id", async function (request, response) {
  const { id } = request.params;
  const movie = await getMovieById(id);
  movie
    ? response.send(movie)
    : response.status(404).send({ message: "movie not found" });
});

//add new movies
//express.json - middleware

router.post("/", express.json(), async function (request, response) {
  const data = request.body;
  const result = await addMovie(data);

  response.send(result);
});

//delete movies
router.delete("/:id", express.json(), async function (request, response) {
  const { id } = request.params;

  const result = await deleteMovies(id);
  result.deletedCount >= 1
    ? response.send({ message: "Movie deleted successfully" })
    : response.status(404).send({ message: "movie not found" });
});

//update movies
router.put("/:id", express.json(), async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await updateMovie(id, data);
  response.send(result);
});

export default router;
