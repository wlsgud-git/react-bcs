import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

// middleware
import {
  EmailOtpVerify,
  IsAuth,
  SendmailOtpWithEmail,
  SignupValidation,
  GetCsrfToken,
} from "../middleware/auth.js";
// controller
import {
  CurrentUser,
  Login,
  Signup,
  Logout,
  FollowControl,
  SocialLoginCallback,
  UserDetail,
  UserModify,
} from "../controller/user.js";

import { upload } from "../middleware/variable.js";

// current user
router.get("/current", IsAuth, CurrentUser);
router.get("/csrftoken", GetCsrfToken);
router.get("/user_detail/:email", UserDetail);
router.put("/user/:email", upload.single("profile_image"), UserModify);
// router.delete('/user:id', IsAuth)

// user login
router.get("/callback", SocialLoginCallback);
router.post("/login", Login);
router.post("/signup", EmailOtpVerify, Signup);
router.post("/logout", IsAuth, Logout);
router.post("/signup_valid", SignupValidation(), (req, res) => {
  return res.status(200).json({ message: "h" });
});

// user otp verify
router.post("/email_otp", SendmailOtpWithEmail);

router.post("/follow", FollowControl);

export default router;
