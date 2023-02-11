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

const RouteSwitch = () => {
  const fetchPath = "https://odinbook-backend-c33h.onrender.com";

  return (
    <BrowserRouter>
      <Navbar fetchPath={fetchPath} />
      <Routes>
        <Route path="/odinbook" element={<Homepage fetchPath={fetchPath} />} />
        <Route
          path="/odinbook/users"
          element={<Users fetchPath={fetchPath} />}
        />
        <Route
          path="/odinbook/timeline"
          element={<Timeline fetchPath={fetchPath} />}
        />
        <Route
          path="/odinbook/create-post"
          element={<PostForm fetchPath={fetchPath} />}
        />
        <Route
          path="/odinbook/create-comment/:postId"
          element={<CommentForm fetchPath={fetchPath} />}
        />
        <Route
          path="/odinbook/:postId/comment/edit/:commentId"
          element={<CommentForm fetchPath={fetchPath} />}
        />
        <Route
          path="/odinbook/update-profile-img/"
          element={<ProfileImageUpdate fetchPath={fetchPath} />}
        />
        <Route
          path="/odinbook/post/:postId"
          element={<Post fetchPath={fetchPath} />}
        />
        <Route
          path="/odinbook/update/:postId"
          element={<PostForm fetchPath={fetchPath} />}
        />
        <Route path="*" element={<Navigate to="/odinbook" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default RouteSwitch;
