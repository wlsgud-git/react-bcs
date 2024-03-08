import "./css/App.css";
import { Suspense, useEffect, useReducer } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// component
import { Modal } from "./components/modal.js";

// route
import { Home } from "./pages/home.js";
import { About } from "./pages/about.js";
import { Results } from "./pages/results.js";
import { Profile } from "./pages/profile.js";
import { Login } from "./pages/login.js";
import { Signup } from "./pages/signup.js";
import { Coversong } from "./pages/coversong.js";

import { useAuth } from "./context/authcontext.js";

export function App({ videoService, commentService }) {
  const {
    user,
    login,
    signup,
    Myfollowing,
    signupValid,
    sendEmailOtp,
    IsmodalOpen,
    aboutModal,
    modalControl,
  } = useAuth();

  return (
    <Router>
      <Suspense fallback={<div>..loading</div>}>
        <Modal
          IsmodalOpen={IsmodalOpen}
          aboutModal={aboutModal}
          modalControl={modalControl}
          videoService={videoService}
          user={user}
        />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                videoService={videoService}
                Myfollowing={Myfollowing}
                commentService={commentService}
              />
            }
          ></Route>
          <Route
            path="/login"
            element={!user ? <Login login={login} /> : <Navigate to="/" />}
          ></Route>
          <Route
            path="/signup"
            element={
              !user ? (
                <Signup
                  signup={signup}
                  signupValid={signupValid}
                  sendEmailOtp={sendEmailOtp}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          ></Route>

          <Route path="/coversong/:id" element={<Coversong />}></Route>
          <Route path="/about/:id" element={<About />}></Route>
          <Route
            path="/profile/:email"
            element={<Profile modalControl={modalControl} />}
          ></Route>
          <Route path="/results" element={<Results />}></Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
