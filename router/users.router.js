import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import { addUser } from "../service/user.service.js";

async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 1;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

router.post("/signup", express.json(), async function (request, response) {
  try {
    const { username, password } = request.body;
    const hashedPassword = await generateHashedPassword(password);
    const result = await addUser({
      username: username,
      password: hashedPassword,
    });

    response.send(result);
  } catch {
    console.log(err);
  }
});

export default router;
