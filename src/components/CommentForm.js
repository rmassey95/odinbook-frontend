import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const { React, useState, useEffect } = require("react");
const { useSelector } = require("react-redux");

const CommentForm = ({ fetchPath }) => {
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
      await fetch(`${fetchPath}/odinbook/comment/update/${commentId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentText }),
      });
    } else {
      await fetch(
        `${fetchPath}/odinbook/comment/${user._id}/create/${postId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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
          `${fetchPath}/odinbook/comment/${commentId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
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
