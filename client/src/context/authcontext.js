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
        if (data.status == 200) {
          SetUser(data.data.user);
          SetMyfollowing(data.data.user.following);
        }
      })
      .catch();
  }, [authService]);

  useEffect(() => {
    authService
      .csrftoken()
      .then((data) => Setcsrftoken(data.data.csrftoken))
      .catch((err) => console.log(err));
  }, [authService]);

  useEffect(() => {}, [authService]);

  const login = useCallback(
    async (email, password) =>
      authService.login(email, password).then((data) => {
        return data;
      }),
    [authService]
  );

  const signup = useCallback(
    async (email, password, otpnum) =>
      authService.signup(email, password, otpnum).then(),
    [authService]
  );

  const logout = useCallback(
    async () => authService.logout().then((data) => (window.location = "/")),
    [authService]
  );

  const signupValid = useCallback(
    async (email, password, password_check) =>
      authService.signupValid(email, password, password_check).then((data) => {
        return data;
      }),
    [authService]
  );

  const sendEmailOtp = useCallback(
    async (email) =>
      authService.sendEmailOtp(email).then((data) => {
        return data;
      }),
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
      sendEmailOtp,

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
