import react from "react";
import { Link, useParams } from "react-router-dom";

import "../css/about.css";
import { Navbar } from "../components/navbar.js";
import { SideMenu } from "../components/sidemenu.js";
import { LsizeBcsVideo } from "../components/video.js";

export function About() {
  let { id } = useParams();
  return (
    <div>
      <Navbar />
      <SideMenu />

      <div className="pages">
        {/* 영상 부분 */}
        <div className="video_display_box"></div>
      </div>
    </div>
  );
}
