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

  // 유저가 auth status 부분
  useEffect(() => {
    authService
      .current()
      .then((data) => {
        SetUser(data.user);
        SetMyfollowing(data.user.following);
      })
      .catch((err) => {});
  }, [authService]);

  // csrftoken부분
  useEffect(() => {
    authService
      .csrftoken()
      .then((data) => Setcsrftoken(data.csrftoken))
      .catch((err) => console.log(err));
  }, [authService]);

  useEffect(() => {}, [authService]);

  // 유저 정보 변경
  const modifyUser = useCallback(
    async (email, data) => authService.modifyUser(email, data),
    [authService]
  );

  const deleteUser = useCallback(
    async (email) => authService.deleteUser(email),
    [authService]
  );

  // 유저 로그인 부분
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

  // 유저 auth 부분
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
      // 유저
      user,
      Myfollowing,
      modifyUser,
      deleteUser,
      // 로그인
      login,
      signup,
      logout,

      // 검증
      signupValid,
      otpRenew,

      // 모달
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
