import axios from "axios";
import qs from "qs";

import { config } from "../config.js";
import { video_db } from "../data/video.js";
import { coversong_db } from "../data/coversong.js";
import { fjwt, fbcrypt } from "../utils/secure.js";
import { date } from "../utils/date.js";
import { s3File } from "../utils/aws.js";

async function getToken() {
  const result = await axios({
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    data: qs.stringify({
      grant_type: "client_credentials",
      client_id: config.spotify.client_id,
      client_secret: config.spotify.client_secret,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return result.data.access_token;
}

export async function searchCoversong(req, res) {
  try {
    const { query } = req.body;

    let token = await getToken();
    const result = await axios({
      url: `https://api.spotify.com/v1/search?query=${query}&type=track&market=KR&locale=ko-KR%2Cko%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7&offset=0&limit=${5}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const coversong_list = await result.data.tracks.items;
    let list = [];
    coversong_list.map((li) => {
      let id = li.id;
      let title = li.name;
      let artists = li.artists.map((artist) => artist.name);
      let thumbnail_url = li.album.images[2].url;
      list.push({ id, title, artists, thumbnail_url });
    });
    return res.status(200).json({ list });
  } catch (err) {
    console.log(err);
  }
}

export async function getVideolist(req, res) {
  try {
    let videos = await video_db.getVideos();
    return res.status(200).json({ videos });
  } catch (err) {
    return res.status(400).json({ err: "err!" });
  }
}

export async function createVideo(req, res) {
  try {
    const { title, coversong, release, user_id } = req.body;
    let file = req.file;
    let coversong_info = JSON.parse(coversong);

    // 비디오 고유 아이디
    let video_id = await fbcrypt.createHashText(
      `video-${file.originalname}-${date.CurrentDateString()}-${user_id}`
    );

    // 비디오 s3 업로드
    let video_url = await s3File.s3FileUpload({
      key: video_id,
      bucket: config.aws.bucket.video,
      file,
    });

    // 이미 커버송이 존재하면 커버송을 데이터 베이스에 넣을필요 X
    let coversong_result = await coversong_db.getCoversongById(
      coversong_info.id
    );
    if (!coversong_result.length)
      await coversong_db.createCoversong(coversong_info);

    // 비디오 데이터 베이스에 생성
    let video_info = {
      id: video_id,
      writer_id: user_id,
      coversong_id: coversong_info.id,
      title,
      video_url,
      release,
    };
    await video_db.createVideo(video_info);
    return res.status(200).json({ message: "업로드 완료" });
  } catch (err) {
    return res.status(400).json({ err: "에러나옴" });
  }
}
