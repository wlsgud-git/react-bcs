import react from "react";

import "../css/sidemenu.css";
import { Link } from "react-router-dom";

export function SideMenu() {
  return (
    <div className="sidemenu_container">
      <li className="sidemenu_home_box">
        <Link to="/">
          <i className="fa-solid fa-house"></i>
          <span className="sidemenu_text">홈</span>
        </Link>
      </li>

      <li className="sidemenu_category_box">
        <Link>
          <i className="fa-solid fa-list"></i>
          <span className="sidemenu_text">카테고리</span>
        </Link>
      </li>

      <li className="sidemenu_following_box">
        <Link>
          <i className="fa-solid fa-user-plus"></i>
          <span className="sidemenu_text">팔로잉</span>
        </Link>
      </li>
    </div>
  );
}
