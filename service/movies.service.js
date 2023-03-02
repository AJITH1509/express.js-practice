import { ObjectId } from "mongodb";
import { client } from "../index.js";

export async function updateMovie(id, data) {
  return await client
    .db("b42wd2")
    .collection("movies")
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
}
export async function deleteMovies(id) {
  return await client
    .db("b42wd2")
    .collection("movies")
    .deleteOne({ _id: new ObjectId(id) });
}
export async function addMovie(data) {
  return await client.db("b42wd2").collection("movies").insertOne(data);
}
export async function getMovieById(id) {
  return await client
    .db("b42wd2")
    .collection("movies")
    .findOne({ _id: new ObjectId(id) });
}
export async function getMovies() {
  return await client.db("b42wd2").collection("movies").find({}).toArray();
}
