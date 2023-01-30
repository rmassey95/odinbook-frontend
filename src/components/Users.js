import { addUser } from "../app/authSlice";
import { useNavigate } from "react-router-dom";
const { React, useState, useEffect } = require("react");
const { useSelector, useDispatch } = require("react-redux");

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const authenticated = useSelector((state) => {
    return state.auth.authenticated;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUsers = async () => {
    if (authenticated) {
      const usersRes = await fetch("http://localhost:5000/odinbook/users", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      });

      const users = await usersRes.json();

      setUsers(users);
      setLoading(false);
    } else if (authenticated === false) {
      navigate("/odinbook");
    }
  };

  const updateUserInfo = async () => {
    const userInfoRes = await fetch(
      "http://localhost:5000/odinbook/login/success",
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

    const userInfo = await userInfoRes.json();
    dispatch(addUser(userInfo.user));
  };

  const sendFriendRequest = async (event, friendId) => {
    event.preventDefault();
    setLoading(true);

    const res = await fetch(
      `http://localhost:5000/odinbook/user/${user._id}/send/${friendId}`,
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

    if (res.status === 200) {
      await getUsers();
      await updateUserInfo();
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (event, friendId) => {
    event.preventDefault();
    setLoading(true);

    const res = await fetch(
      `http://localhost:5000/odinbook/user/${user._id}/accept/${friendId}`,
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

    if (res.status === 200) {
      await getUsers();
      await updateUserInfo();
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [authenticated]);

  if (!loading && users.length > 0) {
    return (
      <div className="users-container m-5">
        {users.map((person) => {
          return (
            <div key={person._id} className="users-container-item">
              <div
                className="card users-container-item d-flex flex-row align-items-center mt-2 mb-2"
                style={{ width: "18rem" }}
              >
                <img
                  src={person.profileImg}
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
                  <p className="card-text" style={{ margin: 0 }}>
                    {person.displayName}
                  </p>
                  {person._id === user._id ||
                  user.friends.includes(person._id) ? (
                    <div></div>
                  ) : user.pendingFriends.includes(person._id) ? (
                    <button
                      onClick={(event) => {
                        acceptFriendRequest(event, person._id);
                      }}
                      type="button"
                      className="btn btn-outline-secondary"
                    >
                      Accept
                    </button>
                  ) : user.sendFriendReqs.includes(person._id) ? (
                    <p className="card-text" style={{ margin: 0 }}>
                      Freind Request sent
                    </p>
                  ) : (
                    !user.guest && (
                      <button
                        onClick={(event) => {
                          sendFriendRequest(event, person._id);
                        }}
                        type="button"
                        className="btn btn-outline-secondary"
                      >
                        Add friend
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default Users;
