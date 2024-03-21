import express from "express";

// middleware
import { IsAuth } from "../middleware/auth.js";
import { videoValidate } from "../middleware/video.js";
// controller
import {
  getVideolist,
  searchCoversong,
  createVideo,
} from "../controller/video.js";

import { upload } from "../utils/variable.js";

const router = express.Router();

// get
router.get("/video", getVideolist);

// post
router.post(
  "/video",
  IsAuth,
  upload.single("video"),
  videoValidate(),
  createVideo
);

// put
// router.put("/video/:id");

// delete
// router.delete("/video/:id");

router.post("/coversong", IsAuth, searchCoversong);

export default router;
