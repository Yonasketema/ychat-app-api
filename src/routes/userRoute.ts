import { Router } from "express";

import { login, protect, signup } from "../controllers/authController";
import { getAllUser, getUser } from "../controllers/userController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/", protect, getAllUser);
router.get("/:username", protect, getUser);

export default router;
