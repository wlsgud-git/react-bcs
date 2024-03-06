import {
  FollowModify,
  GetPassWordByEmail,
  GetUserByEmail,
} from "../data/user.js";
import { CookieSetToken, Oauth } from "../middleware/auth.js";
import { Bcrypt, Jwt } from "../middleware/secure.js";
import { DateControl } from "../middleware/time.js";
import { CreatUser } from "../data/user.js";

export async function SocialLoginCallback(req, res) {
  try {
    const b = new Bcrypt();
    const t = new DateControl();
    const auth = new Oauth();

    const code = req.query["code"];
    const state = req.query["state"];

    let c_tokens;
    let c_email;
    let company;

    if (state) {
      const { status, data } = await auth.getNaverToken(code, state);
      const { access_token, refresh_token, token_type, expires_in } = data;

      let user_info = await auth.getNaverUserInfo(access_token);
      let email = user_info.data.response.email;

      c_tokens = { access_token, refresh_token, company: "naver" };
      c_email = email;
      company = "naver";
    } else {
      let { status, data } = await auth.getKakaoToken(code);
      const {
        access_token,
        token_type,
        refresh_token,
        expires_in,
        scope,
        refresh_token_expires_in,
      } = data;

      let user_info = await auth.getKakaoUserInfo(access_token);
      let email = user_info.data.kakao_account.email;

      c_tokens = { access_token, refresh_token, company: "kakao" };
      c_email = email;
      company = "kakao";
    }

    // const user_info = await GetUserByEmail(c_email);

    CookieSetToken(res, { key: "b_id", token: c_tokens["access_token"] });
    CookieSetToken(res, { key: "b_rt_id", token: c_tokens["refresh_token"] });
    CookieSetToken(res, { key: "bcs-com", token: c_tokens["company"] } );

    // if (user_info.status == 400)
    //   return res.status(400).json({ error: user_info.error });
    // if (!user_info.data) {
    //   let hash_id = await b.createHashText(
    //     `signup-${t.CurrentDateString()}-${c_email}`
    //   );
    //   let id = hash_id.hash_text;
    //   let info = { id, email: c_email, password: "", company };

    //   await CreateUser(info);
    // }

    return res.redirect("http://localhost:3000");
  } catch (err) {
    return res.status(400).json({ err: err });
  }
}

export async function CurrentUser(req, res) {
  try {
    const data = await GetUserByEmail(req.email);
    const user = data.data[0];
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ err: "유저 정보가 없습니다" });
  }
}

export async function Login(req, res) {
  try {
    let b = new Bcrypt();
    let j = new Jwt();
    const { email, password } = req.body;

    const user_info = await GetPassWordByEmail(email);
    const user = await user_info.data[0];

    if (!user) return res.status(404).json({ err: "존재하지 않는 유저입니다" });

    if (user.company == "naver" || user.company == "kakao")
      return res.status(403).json({ err: "소셜로그인 이용 회원입니다" });

    let compare_password = await b.compareHashes(password, user.password);

    let access_token = await j.createAccesstoken(email);
    let refresh_token = await j.createRefreshtoken(email);
    let company = "bcs";

    CookieSetToken(res, { key: "b_id", token: access_token.access_token });
    CookieSetToken(res, {
      key: "b_rt_id",
      token: refresh_token.refresh_token,
    });
    CookieSetToken(res, { key: "bcs-com", token: company });
    return res.status(200).json({ message: "로그인 완료" });
  } catch (err) {
    return res.status(400).json({ err: err });
  }
}

export async function Signup(req, res) {
  try {
    let b = new Bcrypt();
    let t = new DateControl();

    let body = req.body;
    const email = body.email;
    const password = body.password;

    let hash_password = await b.createHashText(password);
    const company = "bcs";

    let id_hash = await b.createHashText(
      `user-${t.CurrentDateString()}-${email}`
    );
    let id = id_hash.hash_text;

    let info = { id, email, password: hash_password.hash_text, company };
    await CreatUser(info);

    return res.status(200).json({ message: "회원가입이 완료되었습니다" });
  } catch (err) {
    return;
  }
}

export async function Logout(req, res) {
  res.clearCookie("b_id");
  res.clearCookie("b_rt_id");
  res.clearCookie("bcs-com");

  return res.status(302).json({ location: "/" });
}

export async function FollowControl(req, res) {
  try {
    let { type, a, b } = req.body;

    let result = await FollowModify(type, a, b);

    res.status(200).json({
      message: `${
        type == "add" ? "팔로우 되었습니다" : "팔로우가 취소되었습니다"
      }`,
    });
  } catch (err) {
    return res.status(400).json({ err: err });
  }
}
