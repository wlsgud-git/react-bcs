import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Loading } from "../components/loading.js";

import "../css/signup.css";

// img
import Logo from "../image/BCS-01.png";
import KakaoIco from "../image/kakaoico.png";
import NaverIco from "../image/naverico.png";

export function Signup({ signup, signupValid, sendEmailOtp }) {
  const [signupInfo, SetsignupInfo] = useState({
    valid: false,
    email: "",
    password: "",
    password_check: "",
    iserror: false,
    errorMessage: "",
    isloading: false,
  });

  const [otpinfo, Setotpinfo] = useState({
    otpnum: "",
    iserror: false,
    errorMessage: "",
  });

  const Onsubmit = async (e) => {
    e.preventDefault();

    // 기본적 입력값에 대한 검사
    SetsignupInfo((c) => ({ ...c, isloading: true }));

    await signupValid(
      signupInfo.email,
      signupInfo.password,
      signupInfo.password_check
    )
      .then((data) =>
        SetsignupInfo((c) => ({
          ...c,
          valid: true,
          iserror: false,
          errorMessage: "",
          isloading: false,
        }))
      )
      .catch((err) => {
        console.log(err.message);
        // SetsignupInfo((c) => ({
        //   ...c,
        //   iserror: true,
        //   errorMessage: err.message,
        //   isloading: false,
        // }));
      });
  };

  const Otpsubmit = async (e) => {};

  return (
    <>
      <div className="signup_page">
        <div className="signup_box">
          {/* bcs로고 */}
          <div className="bcs_logo">
            <Link to="/">
              <img src={Logo} />
            </Link>
          </div>
          {/* 회원가입 디스플레이 */}
          <div className="signup_display">
            {/* bcs소개 */}
            <div className="bcs_introduce">
              bcs에서 좋아하는 음악의 커버영상을 즐기세요
            </div>
            {/* 소셜로그인 */}
            <div className="social_login_box">
              <button className="social_login_btn" id="naver">
                <img src={NaverIco} className="naver_ico" />
                네이버로 로그인
              </button>
              <button className="social_login_btn" id="kakao">
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

            <span
              className="error_status"
              style={{
                display:
                  signupInfo.iserror || otpinfo.iserror ? "block" : "none",
              }}
            >
              {signupInfo.errorMessage !== ""
                ? signupInfo.errorMessage
                : otpinfo.errorMessage}
            </span>

            {/* 회원가입 정보입력 */}
            <div
              className="signup_info_box"
              style={{ display: !signupInfo.valid ? "flex" : "none" }}
            >
              <form className="signup_form" onSubmit={Onsubmit}>
                <div className="signup_infomation_box">
                  <input
                    type="email"
                    placeholder="이메일"
                    name="email"
                    required
                    value={signupInfo.email}
                    onChange={(e) =>
                      SetsignupInfo((c) => ({ ...c, email: e.target.value }))
                    }
                  />
                  <input
                    type="password"
                    placeholder="비밀번호"
                    name="password"
                    required
                    value={signupInfo.password}
                    onChange={(e) =>
                      SetsignupInfo((c) => ({ ...c, password: e.target.value }))
                    }
                  />

                  <input
                    type="password"
                    placeholder="비밀번호 확인"
                    name="password_check"
                    required
                    value={signupInfo.password_check}
                    onChange={(e) =>
                      SetsignupInfo((c) => ({
                        ...c,
                        password_check: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="signup_submit_btn">
                  <button
                    className="signup_btn"
                    type="submit"
                    disabled={signupInfo.isloading}
                  >
                    {signupInfo.isloading ? "..." : "회원가입"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* 이메일 otp 디스플레이 */}
          <div
            className="email_otp_section"
            style={{ display: !signupInfo.valid ? "none" : "flex" }}
          >
            <div className="otp_text">
              <span className="otp_sended_text">
                {signupInfo.email}로 인증번호 6자리가 전송되었습니다
              </span>
            </div>

            <div className="otp_box">
              <div className="otp_input_box">
                <input
                  type="text"
                  spellCheck="off"
                  placeholder="인증번호 6자리"
                  className="otp_input"
                  value={otpinfo.otpnum}
                  onChange={(e) =>
                    Setotpinfo((c) => ({ ...c, otpnum: e.target.value }))
                  }
                />
                <span className="otp_valid_time">03:00</span>

                <span className="otp_resend">재전송</span>
              </div>

              <button className="otp_btn" onClick={Otpsubmit}>
                확인
              </button>
            </div>
          </div>
        </div>

        <div className="signup_sub">
          <span>계정이 있다면?</span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </>
  );
}
