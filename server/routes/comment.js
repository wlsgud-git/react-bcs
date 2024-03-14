import express from "express";

// middleware
// controller
import {
  getComments,
  createComment,
  modifyComment,
  deleteComment,
} from "../controller/comment.js";

const router = express.Router();

// get
router.get("/comments", getComments);
// post
router.post("/comment", createComment);
// put
router.put("/comment/:id", modifyComment);
// delete
router.delete("/comment/:id", deleteComment);

export default router;
