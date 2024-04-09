import { Router } from "express";
import { createMessage, getMessages } from "../controllers/chatController";
import { protect } from "../controllers/authController";

const router = Router();

router.route("/").post(protect, createMessage);

router.route("/:userId").get(protect, getMessages);

export default router;
