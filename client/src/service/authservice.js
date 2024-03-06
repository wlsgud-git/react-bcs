export class AuthService {
  constructor(http) {
    this.http = http;
  }

  async current() {
    return this.http.fetching("/current", { method: "get" });
  }

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

  async csrftoken() {
    let token = await this.http.fetching("/csrftoken", {
      method: "get",
    });
    return token;
  }

  async signupValid(email, password, password_check) {
    // let emailValid = this.checkEmail(email);
    // let passwordValid = this.passwordValid(password);
    // if (!emailValid.state) {
    //   return { status: 400, message: emailValid.message };
    // }
    // if (!passwordValid.state) {
    //   return { status: 400, message: passwordValid.message };
    // }

    // if (password_check !== password) {
    //   return {
    //     status: 400,
    //     message: "비밀번호 확인값이 비밀번호와 같지 않습니다",
    //   };
    // }

    const check = await this.http.fetching("/signup_valid", {
      method: "post",
      body: JSON.stringify({ email, password, password_check }),
    });

    if (check.status == 200) {
      return { status: 200, message: check.data.message };
    }
    return { status: 400, error: check.data.errors[0].msg };
  }

  async sendEmailOtp(email) {
    return this.http.fetching("/email_otp", {
      method: "post",
      body: JSON.stringify({ email }),
    });
  }

  // checkEmail(value) {
  //   let email = value;
  //   let ErrorMessage = "이메일 형식이 올바르지 않습니다";
  //   let emailregex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  //   if (emailregex.test(email) == false) {
  //     return { state: false, message: ErrorMessage };
  //   }
  //   return { state: true };
  // }

  passwordValid(value) {
    let password = value;
    let minLength = 8;
    let maxLength = 20;
    let ErrorMessage =
      "비밀번호는 길이 8~20, 특수문자, 영문, 숫자를 포함하여 구성하여야 함";

    var passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

    if (password < minLength || password > maxLength) {
      return { state: false, message: ErrorMessage };
    }

    if (!passwordRegex.test(password)) {
      return { state: false, message: ErrorMessage };
    }
    return { state: true };
  }
}
