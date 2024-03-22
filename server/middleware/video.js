import { body, validationResult } from "express-validator";

export const videoValidate = () => {
  return async (req, res, next) => {
    const validations = [
      body("title")
        .notEmpty()
        .withMessage("제목은 필수항목 입니다")
        .isLength({ min: 1, max: 20 })
        .withMessage("영상제목은 1~20 이내로 해야 합니다."),
      body("coversong")
        .notEmpty()
        .withMessage("커버송은 필수항목 입니다")
        .custom((value) => {
          let a = JSON.parse(value);
          return a.valid;
        })
        .withMessage("커버송은 필수항목 입니다"),
      body("release")
        .custom((value) => {
          if (value == null) return false;
          return true;
        })
        .withMessage("공개상태는 필수항목 입니다"),
    ];
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res
      .status(400)
      .json({ message: `${errors.errors[0].msg}-${errors.errors[0].path}` });
  };
};
