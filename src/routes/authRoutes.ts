import express from "express";
import { authorizeRoles } from "../middleware/authMiddleware";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
