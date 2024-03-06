import "../css/coversong.css";

import { useEffect } from "react";
import { Navbar } from "../components/navbar.js";
import { SideMenu } from "../components/sidemenu.js";

import { useParams } from "react-router-dom";

export function Coversong() {
  let { id } = useParams();

  useEffect(() => {
    // 커버송과 관련있는 커버비디오 리스트 만들기
  }, []);

  return (
    <div>
      <Navbar />
      <SideMenu />

      <div className="pages">
        <div className="cp_coversong_section">
          <div className="cp_coversong_thumbnail_section">
            <span className="cp_coversong_thumbnail_box"></span>
          </div>
          <div className="cp_coversong_info_section">
            <span className="cp_coversong_title">썸</span>
            <span className="cp_coversong_artists">소유 정기고</span>
          </div>
        </div>

        <div className="cp_coversong_relative_video"></div>
      </div>
    </div>
  );
}
