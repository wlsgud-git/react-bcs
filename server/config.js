import dotenv from "dotenv";
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (!value) throw new Error(`Key: ${key} undefined`);
  return value;
}

export const config = {
  csrf: {
    csrf_text: required("CSRF_TEXT"),
  },

  cors: {
    allow_url: required("ALLOW_URI"),
  },

  db: {
    bcs_password: required("BCS_PASSWORD"),
    port: parseInt(required("BCS_DB_PORT", 5432)),
    bcs_host: required("BCS_HOST"),
    bcs_user: required("BCS_USER"),
    bcs_database: required("BCS_DATABASE"),
  },

  nodemailer: {
    email: required("NODEMAILER_EMAIL"),
    password: required("NODEMAILER_PASSWORD"),
  },

  naver: {
    client_id: required("NAVER_CLIENT"),
    client_secret: required("NAVER_CLIENT_SECRET"),
  },

  kakao: {
    native_key: required("KAKAO_NATIVE"),
    rest_key: required("KAKAO_REST"),
    js_key: required("KAKAO_JS"),
    admin_key: required("KAKAO_ADMIN"),
    secret_key: required("KAKAO_CLIENT_SECRET"),
  },

  aws: {
    access_key: required("AWS_ACCESS"),
    secret_key: required("AWS_SECRET"),
    region: required("AWS_REGION"),

    bucket: {
      video: required("AWS_VIDEO_CONTAINER"),
      video_thumbnail: required("AWS_VIDEO_THUMBNAIL"),
      profile_image: required("AWS_PROFILE_IMAGE"),
    },
  },

  host: {
    port: parseInt(required("PORT", 8000)),
    callback_url: required("REDIRECT_URL"),
  },

  bcrypt: {
    salt: parseInt(required("SALT", 9)),
  },

  jwt: {
    a_secret_key: required("ACCESS_SECRET"),
    r_secret_key: required("REFRESH_SECRET"),

    otp_secret_key: required("OTP_SECRET"),
  },

  spotify: {
    client_id: required("SPOTIFY_CLIENT"),
    client_secret: required("SPOTIFY_SECRET"),
  },
};
