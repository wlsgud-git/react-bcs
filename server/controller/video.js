import axios from "axios";
import qs from "qs";
import { config } from "../config.js";

import { GetVideos } from "../data/video.js";

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

export async function SearchCoverSong(req, res) {
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

export async function GetVideoList(req, res) {
  try {
    let list = await GetVideos();
    let videos = await list.data;
    return res.status(200).json({ videos });
  } catch (err) {
    return res.status(400).json({ err: "err!" });
  }
}
