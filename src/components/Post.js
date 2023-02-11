import { useParams } from "react-router-dom";
import likeImg from "../like.png";
import likedImg from "../liked.png";
import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";
const { React, useState, useEffect } = require("react");
const { useSelector } = require("react-redux");

const Post = ({ fetchPath }) => {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [post, setPost] = useState(null);
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const authenticated = useSelector((state) => {
    return state.auth.authenticated;
  });
  const navigate = useNavigate();

  const getComments = async () => {
    if (authenticated) {
      const commentsRes = await fetch(
        `${fetchPath}/odinbook/comments/all/${postId}`,
        { method: "GET" }
      );

      if (post === null) {
        const postRes = await fetch(`${fetchPath}/odinbook/post/${postId}`, {
          method: "GET",
          credentials: "include",
        });
        const post = await postRes.json();
        setPost(post);
      }

      const comments = await commentsRes.json();

      setComments(comments);
      setLoading(false);
    } else if (authenticated === false) {
      navigate("/odinbook");
    }
  };

  const addLike = async (event, commentId) => {
    event.preventDefault();

    await fetch(
      `${fetchPath}/odinbook/comment/${user._id}/add-like/${commentId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    getComments();
  };

  const deleteComment = async (event, commentId) => {
    event.preventDefault();

    await fetch(`${fetchPath}/odinbook/comment/delete/${commentId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    getComments();
  };

  useEffect(() => {
    getComments();
  }, [authenticated]);

  if (loading) {
    return <div></div>;
  } else {
    return (
      <div className="container">
        <div className="card mt-3">
          {post.img && (
            <img
              crossOrigin="anonymous"
              src={`${fetchPath}/images/${post.img}`}
              className="card-img-top"
              alt="post"
            ></img>
          )}
          <div className="card-body">
            <p className="card-text">{post.content}</p>
            <p className="card-text likes">
              {post.likes.includes(user._id) ? (
                <img alt="likes" src={likedImg} />
              ) : (
                <img alt="likes" src={likeImg} />
              )}

              {post.likes.length}
            </p>
            <div className="post-footer">
              <p className="card-text text-muted">{post.author.displayName}</p>
              <p className="card-text text-muted">
                {dateFormat(post.datePosted, "fullDate")}
              </p>
            </div>
          </div>
        </div>
        <h3 className="mt-4">Comments:</h3>
        {comments.length === 0 ? (
          <p>no comments</p>
        ) : (
          comments.map((comment) => {
            return (
              <div className="card mb-3 mt-3" key={comment._id}>
                <div className="card-body">
                  <p className="card-text">{comment.commentText}</p>
                  <p className="card-text likes">
                    {comment.likes.includes(user._id) ? (
                      <button disabled={true} className="removeButtonStyle">
                        <img alt="likes" src={likedImg} />
                      </button>
                    ) : (
                      <button
                        onClick={(event) => {
                          addLike(event, comment._id);
                        }}
                        className="removeButtonStyle"
                      >
                        <img alt="likes" src={likeImg} />
                      </button>
                    )}
                    {comment.likes.length}
                  </p>
                  <div className="post-footer">
                    <p className="card-text text-muted">
                      {comment.author.displayName}
                    </p>
                    <p className="card-text text-muted">
                      {dateFormat(comment.datePosted, "fullDate")}
                    </p>
                  </div>
                  {user._id === comment.author._id && (
                    <div>
                      <a
                        type="button"
                        href={`/odinbook/${postId}/comment/edit/${comment._id}`}
                        className="mt-2 btn btn-outline-secondary"
                      >
                        Edit
                      </a>
                      <button
                        onClick={(event) => {
                          deleteComment(event, comment._id);
                        }}
                        className="mt-2 ms-2 btn btn-outline-danger"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        {!user.guest && (
          <a
            type="button"
            href={`/odinbook/create-comment/${postId}`}
            className=" mb-3 btn btn-outline-primary"
            alt="Create comment"
          >
            Add comment
          </a>
        )}
      </div>
    );
  }
};

export default Post;
