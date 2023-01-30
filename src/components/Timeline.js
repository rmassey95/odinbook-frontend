import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";
import likeImg from "../like.png";
import likedImg from "../liked.png";
const { React, useState, useEffect } = require("react");
const { useSelector } = require("react-redux");

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const navigate = useNavigate();
  const authenticated = useSelector((state) => {
    return state.auth.authenticated;
  });

  const getPosts = async () => {
    console.log(user);
    if (Object.keys(user).length > 0 && !user.guest) {
      const postsRes = await fetch(
        `http://localhost:5000/odinbook/profile/${user._id}/timeline`,
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

      let postsQuery = await postsRes.json();
      postsQuery.sort(function (a, b) {
        return new Date(b.datePosted) - new Date(a.datePosted);
      });

      setPosts(postsQuery);
      setLoading(false);
    } else if (authenticated === false) {
      navigate("/odinbook");
    } else if (user.guest) {
      const postsRes = await fetch(
        `http://localhost:5000/odinbook/profile/all-posts`
      );

      let postsQuery = await postsRes.json();
      postsQuery.sort(function (a, b) {
        return new Date(b.datePosted) - new Date(a.datePosted);
      });

      setPosts(postsQuery);
      setLoading(false);
    }
  };

  const addLike = async (event, postId) => {
    event.preventDefault();

    await fetch(
      `http://localhost:5000/odinbook/post/${user._id}/add-like/${postId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      }
    );

    getPosts();
  };

  useEffect(() => {
    getPosts();
  }, [authenticated]);

  if (!loading && authenticated === true) {
    return (
      <div className="container mt-4 mb-4">
        {posts.map((post, indx) => {
          return (
            <div className={indx > 0 ? "card mt-3" : "card"} key={post._id}>
              {post.img && (
                <img
                  src={`http://localhost:5000/images/${post.img}`}
                  className="card-img-top"
                  alt="post"
                ></img>
              )}
              <div className="card-body">
                <p className="card-text">{post.content}</p>
                <p className="card-text likes">
                  {post.likes.includes(user._id) ? (
                    <button disabled={true} className="removeButtonStyle">
                      <img alt="likes" src={likedImg} />
                    </button>
                  ) : (
                    <button
                      onClick={(event) => {
                        addLike(event, post._id);
                      }}
                      className="removeButtonStyle"
                    >
                      <img alt="likes" src={likeImg} />
                    </button>
                  )}
                  {post.likes.length}
                </p>
                <div className="post-footer">
                  <p className="card-text text-muted">
                    {post.author.displayName}
                  </p>
                  <p className="card-text text-muted">
                    {dateFormat(post.datePosted, "fullDate")}
                  </p>
                </div>
                <a
                  type="button"
                  href={`/odinbook/post/${post._id}`}
                  className="mt-1 btn btn-outline-secondary"
                  alt="Comments"
                >
                  comments
                </a>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div className="loading"></div>;
  }
};

export default Timeline;
