export class AuthService {
  constructor(http) {
    this.http = http;
  }

  async current() {
    return this.http.fetching("/current", { method: "get" });
  }

  // 유저 정보 or 변경
  async detailUser(email) {
    return this.http.fetching(`/user_detail/${email}`, {
      method: "get",
    });
  }

  async modifyUser(email, data) {
    return this.http.fetching(`/user/${email}`, {
      method: "put",
      body: data,
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
  }

  async deleteUser(email) {
    return this.http.fetching(`/user/${email}`, { method: "delete" });
  }

  // 유저 로그인 부분
  async login(email, password) {
    return this.http.fetching("/login", {
      method: "post",
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(email, password, otpnum) {
    return await this.http.fetching("/signup", {
      method: "post",
      body: JSON.stringify({ email, password, otpnum }),
    });
  }

  async logout() {
    return this.http.fetching("/logout", {
      method: "post",
    });
  }

  // 유저 auth 부분
  async csrftoken() {
    let token = await this.http.fetching("/csrftoken", {
      method: "get",
    });
    return token;
  }

  async otpRenew(email) {
    return this.http.fetching("/otp_renew", {
      method: "post",
      body: JSON.stringify({ email }),
    });
  }

  async signupValid(email, password, password_check) {
    // try {
    this.checkEmail(email);
    this.passwordValid(password);
    this.passwordCheckValid(password, password_check);

    return this.http.fetching("/signup_valid", {
      method: "post",
      body: JSON.stringify({ email, password, password_check }),
    });

    // if (check.status == 400) {
    //   throw new Error("이미 가입된 이메일입니다");
    // }
    // } catch (err) {
    //   throw new Error(err);
    // }
  }

  checkEmail(value) {
    let email = value;
    let ErrorMessage = "이메일 형식이 올바르지 않습니다";
    let emailregex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (emailregex.test(email) == false) throw new Error(ErrorMessage);
    return true;
  }

  passwordValid(value) {
    let password = value;
    let minLength = 8;
    let maxLength = 20;
    let ErrorMessage =
      "비밀번호는 길이 8~20, 특수문자, 영문, 숫자를 포함하여 구성하여야 함";

    var passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

    if (password < minLength || password > maxLength) {
      throw new Error(ErrorMessage);
    }

    if (!passwordRegex.test(password)) {
      throw new Error(ErrorMessage);
    }
    return true;
  }

  passwordCheckValid(val1, val2) {
    if (val1 != val2)
      throw new Error("비밀번호 값과 비밀번호 확인 값이 다릅니다");
    return;
  }
}
