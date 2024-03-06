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
  const [IssignupValid, SetIssignupValid] = useState(false);
  const [Isloading, SetIsloading] = useState(false);
  const [Iserror, SetIserror] = useState({ state: false, message: "" });
  const [Otperror, SetOtperror] = useState({ state: false, message: "" });

  const [otpnum, Setotpnum] = useState("");

  const [email, Setemail] = useState("");
  const [password, Setpassword] = useState("");
  const [password_check, Setpassword_check] = useState("");

  const Onsubmit = async (e) => {
    e.preventDefault();

    SetIsloading(true);
    const valid = await signupValid(email, password, password_check).catch(() =>
      console.log("no")
    );

    setTimeout(() => {
      SetIsloading(false);
    }, 2000);

    if (valid.status == 400) {
      SetIserror((error) => ({
        ...error,
        state: true,
        message: valid.error,
      }));
    } else {
      await sendEmailOtp(email).catch((err) => {});
      SetIssignupValid(true);
    }
  };

  const Otpsubmit = async (e) => {
    SetIsloading(true);
    let aa = await signup(email, password, otpnum).catch((err) => {
      console.log(err);
    });

    setTimeout(() => {
      SetIsloading(false);
    }, 2000);

    if (aa.status == 200) {
      alert("회원가입이 완료되었습니다");
      window.location = "/";
    } else {
      SetOtperror((error) => ({
        ...error,
        state: true,
        message: "인증번호가 올바르지 않습니다",
      }));
    }
  };

  return (
    <>
      {Isloading ? (
        <Loading />
      ) : (
        <div className="signup_page">
          <div className="signup_box">
            {/* bcs로고 */}
            <div className="bcs_logo">
              <Link to="/">
                <img src={Logo} />
              </Link>
            </div>
            {/* 회원가입 디스플레이 */}
            <div
              className="signup_display"
              style={{ display: !IssignupValid ? "flex" : "none" }}
            >
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
                style={{ display: Iserror.state ? "block" : "none" }}
              >
                {Iserror.message}
              </span>

              {/* 회원가입 정보입력 */}
              <div className="signup_info_box">
                <form className="signup_form" onSubmit={Onsubmit}>
                  <div className="signup_infomation_box">
                    <input
                      type="email"
                      placeholder="이메일"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => Setemail(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="비밀번호"
                      name="password"
                      required
                      value={password}
                      onChange={(e) => Setpassword(e.target.value)}
                    />

                    <input
                      type="password"
                      placeholder="비밀번호 확인"
                      name="password_check"
                      required
                      value={password_check}
                      onChange={(e) => Setpassword_check(e.target.value)}
                    />
                  </div>
                  <div className="signup_submit_btn">
                    <button className="signup_btn" type="submit">
                      회원가입
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* 이메일 otp 디스플레이 */}
            <div
              className="email_otp_section"
              style={{ display: IssignupValid ? "flex" : "none" }}
            >
              <div className="otp_text">
                <span className="otp_sended_text">
                  {email}로 인증번호 6자리가 전송되었습니다
                </span>
              </div>

              <div
                className="otp_error"
                style={{ display: Otperror.state ? "block" : "none" }}
              >
                {Otperror.message}
              </div>

              <div className="otp_box">
                <div className="otp_input_box">
                  <input
                    type="text"
                    spellCheck="off"
                    placeholder="인증번호 6자리"
                    className="otp_input"
                    value={otpnum}
                    onChange={(e) => Setotpnum(e.target.value)}
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
      )}
    </>
  );
}
