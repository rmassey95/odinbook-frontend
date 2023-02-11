import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const { useSelector } = require("react-redux");

const PostForm = ({ fetchPath }) => {
  const [content, setContent] = useState();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const authenticated = useSelector((state) => {
    return state.auth.authenticated;
  });

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (postId) {
      await fetch(`${fetchPath}/odinbook/post/update/${postId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
    } else {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("content", content);

      await fetch(`${fetchPath}/odinbook/post/${user._id}/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
    }
    setContent();
    setImage();
    navigate("/odinbook");
  };

  const getPost = async () => {
    if (authenticated && postId) {
      const postRes = await fetch(`${fetchPath}/odinbook/post/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const post = await postRes.json();

      setContent(post.content);
      setLoading(false);
    } else if (authenticated === false) {
      navigate("/odinbook");
    } else if (authenticated) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, [authenticated]);

  if (loading) {
    return <div className="loading"></div>;
  } else {
    return (
      <div className="container">
        <h2>Create Post</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              Post Text
            </label>
            <textarea
              onChange={handleContentChange}
              rows={10}
              className="form-control"
              id="content"
              placeholder="Post Text"
              value={content}
            />
          </div>
          {!postId && (
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Add Image
              </label>
              <input
                onChange={handleImageChange}
                type="file"
                className="form-control"
                id="image"
                name="image"
              />
            </div>
          )}
          <button
            type="submit"
            className="btn btn-outline-primary"
            style={{ width: "100%" }}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
};

export default PostForm;
