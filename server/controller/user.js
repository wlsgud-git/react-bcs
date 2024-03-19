import { user_db } from "../data/user.js";
import { fbcrypt, fjwt } from "../utils/secure.js";
import { date } from "../utils/date.js";
import { oauth, auth_cookie } from "../utils/user.js";
import { s3File } from "../utils/aws.js";
import { config } from "../config.js";

// user control
export async function socialLoginCallback(req, res) {
  try {
    const code = req.query["code"];
    const state = req.query["state"];

    let c_tokens;
    let c_email;
    let company;

    // 각각 네이버와 카카오 회사에 저장된 유저 정보 불러오기
    if (state) {
      const { access_token, refresh_token, token_type, expires_in } =
        await oauth.naverToken(code, state);

      let user_info = await oauth.naverUserinfo(access_token);
      let email = user_info.response.email;

      c_tokens = { access_token, refresh_token, company: "naver" };
      c_email = email;
      company = "naver";
    } else {
      let {
        access_token,
        token_type,
        refresh_token,
        expires_in,
        scope,
        refresh_token_expires_in,
      } = await oauth.kakaoToken(code);

      let user_info = await oauth.kakaoUserinfo(access_token);
      let email = user_info.data.kakao_account.email;

      c_tokens = { access_token, refresh_token, company: "kakao" };
      c_email = email;
      company = "kakao";
    }

    // 데이터 베이스에서 유저 정보를 찾은뒤
    let data = await user_db.findUserByEmail(c_email);
    let user = await data[0];

    // 유저가 없다면 소셜로그인으로 회원가입 진행
    if (!user) {
      let id = await fbcrypt.createHashText(
        `user-${c_email}-${date.CurrentDateString()}`
      );

      let info = { id, email: c_email, password: "", company };
      await user_db.creatUser(info);
    }

    // 쿠키에 토큰과 회사 정보 저장
    auth_cookie.setCookie(res, {
      b_id: c_tokens["access_token"],
      b_rt_id: c_tokens["refresh_token"],
      company,
    });

    return res.redirect("http://localhost:3000");
  } catch (err) {
    return res.status(400).json({ err: err });
  }
}

export async function currentUser(req, res) {
  try {
    const data = await user_db.getUserByEmail(req.email);
    const user = data[0];
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ err: "유저 정보가 없습니다" });
  }
}

export async function userModify(req, res) {
  try {
    const key = req.params.id;
    const file = req.file;
    const data = req.body;

    if (file) {
      let profile_image_url = await s3File.s3FileUpload({
        key,
        file,
        bucket: config.aws.bucket.profile_image,
      });
      data["profile_image_url"] = profile_image_url;
    }

    await user_db.modifyUser(key, data);

    return res.status(200).json({ message: "정보가 변경되었습니다" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: "err" });
  }
}

export async function userDetail(req, res) {
  try {
    let email = req.params.email;
    let data = await user_db.getUserDetailInfo(email);
    let user_info = data[0];
    return res.status(200).json({ user_info });
  } catch (err) {
    return res.status(400).json({ err: err });
  }
}

// login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user_info = await user_db.getPasswordByEmail(email);
    const user = await user_info[0];

    if (!user)
      return res.status(404).json({ message: "존재하지 않는 유저입니다" });

    if (user.company == "naver" || user.company == "kakao")
      return res.status(403).json({ message: "소셜로그인 이용 회원입니다" });

    await fbcrypt.compareHashes(password, user.password);

    let access_token = await fjwt.createAccesstoken(email);
    let refresh_token = await fjwt.createRefreshtoken(email);
    let company = "bcs";

    auth_cookie.setCookie(res, {
      b_id: access_token,
      b_rt_id: refresh_token,
      "bcs-com": company,
    });

    return res.status(200).json({ message: "로그인 완료" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function signup(req, res) {
  try {
    let body = req.body;
    const email = body.email;
    const password = body.password;

    let hash_password = await fbcrypt.createHashText(password);
    const company = "bcs";

    let id = await fbcrypt.createHashText(
      `user-${email}-${date.CurrentDateString()}`
    );

    let info = { id, email, password: hash_password, company };
    await user_db.creatUser(info);

    return res.status(200).json({ message: "회원가입이 완료되었습니다" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function logout(req, res) {
  auth_cookie.deleteCookie(["b_id", "b_rt_id", "bcs-com"]);
  return res.status(200).json({ location: "/" });
}
