import { Cookies } from "./cookie.js";

const c = new Cookies();

export class HttpClient {
  constructor(baseURL, getCsrfToken) {
    this.baseURL = baseURL;
    this.getCsrfToken = getCsrfToken;
  }

  async fetching(url, options) {
    let status;
    let data;
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${c.get_cookie("b_id")}`,
        "bcs-com": `${c.get_cookie("bcs-com")}`,
        "csrf-token": this.getCsrfToken(),
        ...options.headers,
      },
      credentials: "include",
    });

    try {
      status = res.status;
      data = await res.json();
    } catch (err) {
      console.log("ㅈ됨");
    }
    return { status, data };
  }
}
