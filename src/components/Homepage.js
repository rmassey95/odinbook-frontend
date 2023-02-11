// import { loadingTrue, loadingFalse } from "../app/authSlice";
import dateFormat from "dateformat";
import likeImg from "../like.png";
import likedImg from "../liked.png";
import { addUser, authenticate } from "../app/authSlice";
const { useSelector, useDispatch } = require("react-redux");
const { React, useState, useEffect } = require("react");

const Homepage = ({ fetchPath }) => {
  const [posts, setPosts] = useState({});
  const [friends, setFriends] = useState({});
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const dispatch = useDispatch();

  // const dispatch = useDispatch();

  const authenticated = useSelector((state) => {
    return state.auth.authenticated;
  });
  // const loading = useSelector((state) => {
  //   return state.auth.loading;
  // });

  const getPosts = async () => {
    setLoading(true);

    if (authenticated && !user.guest) {
      const friendsRes = await fetch(
        `${fetchPath}/odinbook/user/friends/${user._id}`,
        {
          method: "GET",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const userPostsRes = await fetch(
        `${fetchPath}/odinbook/profile/${user._id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const friends = await friendsRes.json();
      const userPosts = await userPostsRes.json();

      setPosts(userPosts);
      setFriends(friends);
      setLoading(false);
    } else if (user.guest) {
      const friendsRes = await fetch(`${fetchPath}/odinbook/users`, {
        method: "GET",
      });
      const userPostsRes = await fetch(
        `${fetchPath}/odinbook/profile/all-posts`,
        { method: "GET" }
      );

      const friends = await friendsRes.json();
      const userPosts = await userPostsRes.json();

      setPosts(userPosts);
      setFriends(friends);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const removePost = async (event, postId) => {
    event.preventDefault();

    await fetch(`${fetchPath}/odinbook/post/delete/${postId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await fetch(`${fetchPath}/odinbook/comments/${postId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    getPosts();
  };

  const handleGuestClick = () => {
    localStorage.setItem("guest", true);

    dispatch(
      addUser({
        guest: true,
        displayName: "Guest",
        friends: [],
        pendingFriends: [],
        sendFriendReqs: [],
      })
    );
    dispatch(authenticate());
  };

  useEffect(() => {
    getPosts();
  }, [authenticated]);

  if (!loading && authenticated === true && friends.length > 0) {
    return (
      <div
        className="mt-3 mb-3 d-flex justify-content-center"
        style={{ height: "100%" }}
      >
        <div
          className="d-flex flex-column p-2"
          style={{
            border: "1px solid grey",
            borderRadius: "10px",
            height: "fit-content",
          }}
        >
          <h5 className="card-title mt-2 text-center">Friends</h5>
          {friends.map((friend) => {
            return (
              <div
                key={friend._id}
                className="card d-flex flex-row align-items-center mt-2 mb-2"
                style={{ width: "18rem" }}
              >
                <img
                  src={friend.profileImg}
                  className="card-img-top"
                  style={{
                    borderRadius: "50%",
                    height: "70px",
                    width: "70px",
                    padding: "5px",
                  }}
                  alt="..."
                />
                <div className="card-body" style={{ height: "fit-content" }}>
                  <p className="card-text">{friend.displayName}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="ms-3" style={{ width: "60%" }}>
          <div className="d-flex align-items-center">
            {!user.guest && (
              <img
                src={user.profileImg}
                className="card-img-top"
                style={{
                  borderRadius: "50%",
                  height: "70px",
                  width: "70px",
                  padding: "5px",
                }}
                alt="..."
              />
            )}
            <p className="card-text ps-3">Welcome, {user.displayName}</p>
          </div>
          {!user.guest && (
            <a
              type="button"
              href="/odinbook/update-profile-img/"
              className="btn btn-outline-secondary"
            >
              Change Profile Image
            </a>
          )}
          {user.guest ? (
            <h3 className="mt-1">Here are all Posts:</h3>
          ) : (
            <h3 className="mt-1">Here are your Posts:</h3>
          )}
          {posts.map((post, indx) => {
            return (
              <div className={indx > 0 ? "card mt-3" : "card"} key={post._id}>
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
                    <p className="card-text text-muted">
                      {post.author.displayName}
                    </p>
                    <p className="card-text text-muted">
                      {dateFormat(post.datePosted, "fullDate")}
                    </p>
                  </div>
                  {!user.guest && (
                    <a
                      href={`/odinbook/update/${post._id}`}
                      className="mt-2 btn btn-outline-secondary"
                    >
                      Edit
                    </a>
                  )}
                  {!user.guest && (
                    <button
                      onClick={(event) => {
                        removePost(event, post._id);
                      }}
                      className="mt-2 ms-2 btn btn-outline-danger"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {!user.guest && (
            <a
              type="button"
              className=" mb-3 mt-3 btn btn-outline-primary"
              style={{ width: "100%" }}
              href="/odinbook/create-post"
            >
              Create Post
            </a>
          )}
        </div>
      </div>
    );
  } else if (authenticated === false && !loading) {
    return (
      <div className="d-flex flex-column align-items-center">
        <h1>Welcome to Odinbook</h1>
        <h3>You must first login to view content</h3>
        <h5>
          Or{" "}
          <button
            onClick={handleGuestClick}
            className="removeButtonStyle"
            style={{ color: "rgb(0, 128, 255" }}
          >
            click here
          </button>{" "}
          to view as guest
        </h5>
      </div>
    );
  } else {
    return <div className="loading"></div>;
  }
};

export default Homepage;
