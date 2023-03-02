import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUser, getUserByName } from "../service/user.service.js";

// function for hashing password
async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 1;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

router.post("/signup", express.json(), async function (request, response) {
  try {
    const { username, password } = request.body;
    const userFromDb = await getUserByName(username);
    // check username exists
    if (userFromDb) {
      response.status(401).send({ message: "username already exists" });
    }
    //set password length for security purposes
    else if (password.length < 8) {
      response
        .status(400)
        .send({ message: "Password must be at least 8 characters" });
    }
    //all condition passed allowed add user with hash value
    else {
      const hashedPassword = await generateHashedPassword(password);
      const result = await addUser({
        username: username,
        password: hashedPassword,
      });

      response.send(result);
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", express.json(), async function (request, response) {
  try {
    const { username, password } = request.body;
    const userFromDb = await getUserByName(username);
    // check username exists
    if (!userFromDb) {
      response.status(401).send({ message: "invalid credentials" });
    } else {
      const storedPassword = userFromDb.password;
      const isPasswordCheck = await bcrypt.compare(password, storedPassword);
      if (isPasswordCheck) {
        const token = jwt.sign({ id: userFromDb._id }, process.env.Secret_Key);
        response.send({ message: "login successfull", token: token });
      } else {
        response.status(401).send({ message: "invalid credentials" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
