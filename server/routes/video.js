import express from "express";

// middleware
import { IsAuth } from "../middleware/auth.js";
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
router.post("/video", upload.single("video"), createVideo);

// put
// router.put("/video/:id");

// delete
// router.delete("/video/:id");

router.post("/coversong", IsAuth, searchCoversong);

export default router;
