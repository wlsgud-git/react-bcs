import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import { App } from "./App.js";
import { reportWebVitals } from "./reportWebVitals.js";

import { HttpClient } from "./network/http.js";
import { AuthService } from "./service/authservice.js";
import { AuthProvider, FetchcsrfToken } from "./context/authcontext.js";
import { VideoService } from "./service/videoService.js";
import { CommentService } from "./service/commentServide.js";

let baseurl = process.env.REACT_APP_BASEURL;

const httpClient = new HttpClient(baseurl, () => FetchcsrfToken());
export const authService = new AuthService(httpClient);
const videoService = new VideoService(httpClient);
const commentService = new CommentService(httpClient);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider authService={authService}>
      <App videoService={videoService} commentService={commentService} />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
