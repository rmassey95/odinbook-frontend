import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const { React, useState, useEffect } = require("react");
const { useSelector } = require("react-redux");

const CommentForm = () => {
  const [commentText, setCommentText] = useState();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const authenticated = useSelector((state) => {
    return state.auth.authenticated;
  });
  const navigate = useNavigate();
  const { postId, commentId } = useParams();

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (commentId) {
      await fetch(
        `http://localhost:5000/odinbook/comment/update/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ commentText }),
        }
      );
    } else {
      await fetch(
        `http://localhost:5000/odinbook/comment/${user._id}/create/${postId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ commentText }),
        }
      );
    }
    setCommentText("");
    navigate(`/odinbook/post/${postId}`);
  };

  useEffect(() => {
    const getComment = async () => {
      if (Object.keys(user).length > 0 && commentId) {
        setLoading(true);
        const commentRes = await fetch(
          `http://localhost:5000/odinbook/comment/${commentId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }
        );

        const comment = await commentRes.json();

        setCommentText(comment.commentText);
        setLoading(false);
      } else if (authenticated === false) {
        navigate("/odinbook");
      } else {
        setLoading(false);
      }
    };
    getComment();
  }, [authenticated]);

  if (loading) {
    return <div className="loading"></div>;
  } else {
    return (
      <div className="container">
        <h2>Create Comment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="commentText" className="form-label">
              Comment
            </label>
            <textarea
              onChange={handleCommentChange}
              rows={10}
              className="form-control"
              id="commentText"
              placeholder="Comment"
              value={commentText}
            />
          </div>
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

export default CommentForm;
