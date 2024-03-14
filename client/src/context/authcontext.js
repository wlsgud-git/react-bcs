import {
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

export let AuthContext = createContext();
export let csrfRef = createRef();

export function AuthProvider({ authService, children }) {
  const [user, SetUser] = useState(undefined);
  const [Myfollowing, SetMyfollowing] = useState(undefined);
  const [csrftoken, Setcsrftoken] = useState(undefined);

  const [IsmodalOpen, SetIsmodalOpen] = useState(false);
  const [aboutModal, SetaboutModal] = useState("");

  useImperativeHandle(csrfRef, () => csrftoken);

  useEffect(() => {
    authService
      .current()
      .then((data) => {
        SetUser(data.user);
        SetMyfollowing(data.user.following);
      })
      .catch((err) => {});
  }, [authService]);

  useEffect(() => {
    authService
      .csrftoken()
      .then((data) => Setcsrftoken(data.csrftoken))
      .catch((err) => console.log(err));
  }, [authService]);

  useEffect(() => {}, [authService]);

  const login = useCallback(
    async (email, password) => authService.login(email, password),
    [authService]
  );

  const signup = useCallback(
    async (email, password, otpnum) =>
      authService.signup(email, password, otpnum),
    [authService]
  );

  const logout = useCallback(
    async () =>
      authService
        .logout()
        .then((data) => (window.location = process.env.REACT_APP_SERVEPORT))
        .catch((err) => console.log(err)),
    [authService]
  );

  const signupValid = useCallback(
    async (email, password, password_check) =>
      authService.signupValid(email, password, password_check),
    [authService]
  );

  const otpRenew = useCallback(
    async (email) => authService.otpRenew(email),
    [authService]
  );

  // 모달
  const modalControl = (state, about) => {
    SetIsmodalOpen(state == "show" ? true : false);

    switch (about) {
      case "videomake":
        SetaboutModal("videomake");
        break;
      case "follow":
        SetaboutModal("follow");
        break;
      default:
        SetaboutModal("profile_edit");
        break;
    }
  };

  let value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      Myfollowing,

      signupValid,
      otpRenew,

      IsmodalOpen,
      aboutModal,
      modalControl,
    }),
    [user, login, signup, logout, IsmodalOpen, aboutModal]
  );
  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export const FetchcsrfToken = () => csrfRef.current;
