import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/getAllUser", getUsers);

router.get("/getUserById/:id", getUserById);

router.post("/createUser", createUser);

router.put("/updateUser/:id", updateUser);

router.delete("/deleteUser/:id", deleteUser);

export default router;
