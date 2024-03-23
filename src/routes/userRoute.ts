import { Router } from "express";

import { login, protect, signup } from "../controllers/authController";
import { getAllUser } from "../controllers/userController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
