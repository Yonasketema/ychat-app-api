import { Router } from "express";
import { createMessage, getMessages } from "../controllers/chatController";

const router = Router();

router.route("/").post(createMessage);

router.route("/:id").get(getMessages);

export default router;
