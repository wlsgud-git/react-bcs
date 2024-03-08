import { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";

import "../css/home.css";
import { SideMenu } from "../components/sidemenu.js";
import { LsizeBcsVideo } from "../components/video.js";
import { Navbar } from "../components/navbar.js";

import { useAuth } from "../context/authcontext.js";

export function Home({ Myfollowing, videoService, commentService }) {
  const [videolist, Setvideolist] = useState([]);
  useEffect(() => {
    videoService
      .getVideo()
      .then((data) => {
        Setvideolist(data.data.videos);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />
      <SideMenu />

      <div className="pages">
        <ul className="song_video_lists">
          {videolist.map((value, idx) => (
            <li className="bcs_lsize_video_li" key={idx}>
              <LsizeBcsVideo
                data={JSON.stringify(value)}
                commentService={commentService}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
