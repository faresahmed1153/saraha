import Navbar from "./Components/Navbar";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Notfound from "./Components/NotFound";
import Profile from "./Components/Profile";
import Message from "./Components/Message";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import Reset from "./Components/Reset";
import RessetPassword from "./Components/RessetPassword";
import ChangePassword from "./Components/ChangePassword";
import UpdatePicture from "./Components/UpdatePicture";

function App() {
  const [user, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    }
  }, []);

  function getUserData() {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    setUserData(decodedToken);
  }
  function logout() {
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/login");
  }
  useEffect(() => {}, [user]);
  function ProtectedRoute({ children }) {
    if (!localStorage.getItem("token")) {
      return <Navigate to="/login" />;
    } else {
      return children;
    }
  }
  return (
    <>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="saraha"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="login" element={<Login getUserData={getUserData} />} />
        <Route path="messageMe" element={<Message />}>
          <Route path=":id" element={<Message />} />
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="reset" element={<Reset />} />
        <Route path="reset-password" element={<RessetPassword />}>
          <Route path=":token" element={<RessetPassword />} />
        </Route>

        <Route
          path="changePassword"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
