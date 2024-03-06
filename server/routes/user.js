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
} from "../controller/user.js";

router.get("/current", IsAuth, CurrentUser);
router.post("/login", Login);
router.post("/signup", EmailOtpVerify, Signup);
router.post("/logout", IsAuth, Logout);

router.post("/email_otp", SendmailOtpWithEmail);

router.post("/signup_valid", SignupValidation(), (req, res) => {
  return res.status(200).json({ message: "h" });
});

router.get("/callback", SocialLoginCallback);

// router.put('/user', IsAuth)

// router.delete('/user:id', IsAuth)

router.post("/follow", FollowControl);

router.get("/csrftoken", GetCsrfToken);

export default router;
