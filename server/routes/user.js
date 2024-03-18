import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

// middleware
import {
  emailOtpVerify,
  IsAuth,
  sendOtpWithEmail,
  signupValidation,
  getCsrftoken,
} from "../middleware/auth.js";
// controller
import {
  currentUser,
  login,
  signup,
  logout,
  socialLoginCallback,
  userModify,
  userDetail,
} from "../controller/user.js";

import { upload } from "../utils/variable.js";

// current user
router.get("/current", IsAuth, currentUser);
router.get("/csrftoken", getCsrftoken);
router.get("/user_detail/:email", userDetail);
router.put("/user/:email", IsAuth, upload.single("profile_image"), userModify);
// router.delete('/user:id', IsAuth)

// user login
router.get("/callback", socialLoginCallback);
router.post("/login", login);
router.post("/signup", emailOtpVerify, signup);
router.post("/logout", logout);
router.post("/signup_valid", signupValidation(), sendOtpWithEmail);

// user otp verify
// router.post("/email_otp", sendOtpWithEmail);
router.post("/otp_renew", sendOtpWithEmail);

export default router;
