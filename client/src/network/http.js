import axios from "axios";

import { Cookies } from "./cookie.js";

const c = new Cookies();

export class HttpClient {
  constructor(baseURL, getCsrfToken) {
    this.baseURL = baseURL;
    this.getCsrfToken = getCsrfToken;
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    });
  }

  async fetching(url, options) {
    const { body, method, headers } = options;

    let req = {
      url,
      method,
      data: body,
      headers: {
        ...headers,
        "crsf-token": this.getCsrfToken(),
      },
    };

    try {
      const res = await this.client(req);
      return res.data;
    } catch (err) {
      console.log(err)
      let error = new Error(err.response.data.message);
      throw error;
    }
  }

  // async fetching(url, options) {
  //   let data;
  //   const res = await fetch(`${this.baseURL}${url}`, {
  //     ...options,
  //     headers: {
  //       "Content-type": "application/json",
  //       Authorization: `Bearer ${c.get_cookie("b_id")}`,
  //       "bcs-com": `${c.get_cookie("bcs-com")}`,
  //       "csrf-token": this.getCsrfToken(),
  //       ...options.headers,
  //     },
  //     credentials: "include",
  //   });

  //   try {
  //     data = await res.json();
  //   } catch (err) {
  //     console.error("ㅈ됨");
  //   }

  //   if (res.status >= 200 && res.status <= 299) return data;
  //   else {
  //   }
  // }
}
