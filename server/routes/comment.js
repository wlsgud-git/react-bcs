import express from "express";

// middleware
// controller
import {
  GetComments,
  CreateComment,
  ModifyComment,
  DeleteComment,
} from "../controller/comment.js";

const router = express.Router();

router.get("/comments", GetComments);
router.post("/comment", CreateComment);

router.put("/comment/:id", ModifyComment);

router.delete("/comment/:id", DeleteComment);

export default router;
