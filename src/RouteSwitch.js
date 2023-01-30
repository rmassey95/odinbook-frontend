import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Users from "./components/Users";
import Timeline from "./components/Timeline";
import PostForm from "./components/PostForm";
import Post from "./components/Post";
import CommentForm from "./components/CommentForm";
import ProfileImageUpdate from "./components/ProfileImageUpdate";
const { React, useState, useEffect } = require("react");

const RouteSwitch = () => {
  // const [user, setUser] = useState(null);
  // const [authenticared, setAuthenticared] = useState(false);

  // const getLoginStatus = async () => {
  //   const loginRes = await fetch(
  //     "http://localhost:5000/odinbook/login/success",
  //     {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Credentials": true,
  //       },
  //     }
  //   );

  //   if (loginRes.status === 200) {
  //     const loginStatus = await loginRes.json();
  //     setUser(loginStatus.user);
  //     setAuthenticared(true);
  //   } else {
  //     setAuthenticared(false);
  //     setUser({});
  //   }
  // };

  // useEffect(() => {
  //   getLoginStatus();
  // }, []);

  // console.log(user);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/odinbook" element={<Homepage />} />
        <Route path="/odinbook/users" element={<Users />} />
        <Route path="/odinbook/timeline" element={<Timeline />} />
        <Route path="/odinbook/create-post" element={<PostForm />} />
        <Route
          path="/odinbook/create-comment/:postId"
          element={<CommentForm />}
        />
        <Route
          path="/odinbook/:postId/comment/edit/:commentId"
          element={<CommentForm />}
        />
        <Route
          path="/odinbook/update-profile-img/"
          element={<ProfileImageUpdate />}
        />
        <Route path="/odinbook/post/:postId" element={<Post />} />
        <Route path="/odinbook/update/:postId" element={<PostForm />} />
        <Route path="*" element={<Navigate to="/odinbook" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default RouteSwitch;
