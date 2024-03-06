import { useState } from "react";
import { Link } from "react-router-dom";

import "../css/login.css";

// img
import Logo from "../image/BCS-01.png";
import KakaoIco from "../image/kakaoico.png";
import NaverIco from "../image/naverico.png";

export function Login({ login }) {
  const [logining, Setlogining] = useState(false);
  const [email, Setemail] = useState("");
  const [password, Setpassword] = useState("");

  async function SubmitHandle(e) {
    e.preventDefault();

    // Setlogining(true);
    let log = await login(email, password).catch((err) => console.log("sibal"));

    if (log.status == 200) {
      window.location = "/";
    } else {
      console.log("로그인 정보가 올바르지 않음");
    }
  }

  async function SocialLogin(com) {
    if (com == "kakao") {
      window.location = `https://kauth.kakao.com/oauth/authorize?client_id=${"3569b5484b0ff4805fca3466c7c82986"}&redirect_uri=${"http://localhost:8000/callback"}&response_type=code`;
    } else {
      window.location = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=LhTeNmH6tTBMndE2xySu&state=STATE_STRING&redirect_uri=http://localhost:8000/callback`;
    }
  }

  return (
    <div className="login_page">
      <div className="login_box">
        {/* bcs로고 */}
        <div className="bcs_logo">
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>
        {/* bcs소개 */}
        <div className="bcs_introduce">
          bcs에서 좋아하는 음악의 커버영상을 즐기세요
        </div>
        {/* 소셜로그인 */}
        <div className="social_login_box">
          <button
            className="social_login_btn"
            id="naver"
            onClick={() => SocialLogin("naver")}
          >
            <img src={NaverIco} className="naver_ico" />
            네이버로 로그인
          </button>
          <button
            className="social_login_btn"
            id="kakao"
            onClick={() => SocialLogin("kakao")}
          >
            <img src={KakaoIco} className="kakao_ico" />
            카카오로 로그인
          </button>
        </div>
        {/* 나누는 선 */}
        <div className="divide">
          <div className="divide_line"></div>
          <div className="divide_or">또는</div>
          <div className="divide_line"></div>
        </div>

        <div className="err_box"> asd </div>

        {/* 로그인 정보입력 */}
        <div className="login_info_box">
          <form className="login_form" method="post" onSubmit={SubmitHandle}>
            <div className="login_infomation_box">
              <input
                type="email"
                placeholder="이메일"
                onChange={(e) => Setemail(e.target.value)}
              />
              <input
                type="password"
                placeholder="비밀번호"
                onChange={(e) => Setpassword(e.target.value)}
              />
            </div>
            <div className="login_submit_btn">
              <button className="login_btn" disabled={logining}>
                로그인
              </button>
            </div>
          </form>
        </div>
        {/* {비밀번호 찾기} */}
        <div className="find_pw">
          <Link className="find_pw_link">비밀번호 찾기</Link>
        </div>
      </div>

      <div className="login_sub">
        <span>계정이 없다면?</span>
        <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
}
