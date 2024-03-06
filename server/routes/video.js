import express from "express";

// middleware
import { upload } from "../middleware/variable.js";
import { IsAuth } from "../middleware/auth.js";
import { createVideo, S3Video } from "../middleware/video.js";
// import { S3Video } from "../middleware/video.js";
// controller
import { GetVideoList, SearchCoverSong } from "../controller/video.js";
import { Bcrypt } from "../middleware/secure.js";
import { DateControl } from "../middleware/time.js";
import { CreateVideo } from "../data/video.js";

const router = express.Router();

router.get("/video", GetVideoList);

router.post("/video", upload.single("video"), async (req, res) => {
  try {
    let b = new Bcrypt();
    let s = new S3Video();
    let d = new DateControl();

    const { title, coversong, release, user_id } = req.body;
    let coversong_info = JSON.parse(coversong);

    let key = await b.createHashText(`first`);
    let video_url = await s.S3VideoUpload({
      key: key.hash_text,
      file: req.file,
    });

    let info = {
      id: key.hash_text,
      writer_id: user_id,
      coversong_id: coversong_info.id,
      title,
      video_url,
      release,
    };

    await CreateVideo(info);
    console.log("finish");

    return res.status(200).json({ message: "업로드 완료" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "에러나옴" });
  }
});

router.put("/video/:id");

router.delete("/video/:id");

router.post("/coversong", IsAuth, SearchCoverSong);

export default router;
