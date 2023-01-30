import {
  addUser,
  authenticate,
  deAuthenticate,
  setError,
} from "../app/authSlice";
import { useNavigate } from "react-router-dom";
const { React, useState, useEffect } = require("react");
const { useSelector, useDispatch } = require("react-redux");

const Navbar = () => {
  const [loading, setLoading] = useState(true);
  const authenticated = useSelector((state) => {
    return state.auth.authenticated;
  });
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getLoginStatus = async () => {
    setLoading(true);

    const guest = localStorage.getItem("guest");

    if (!guest) {
      const loginRes = await fetch(
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

      if (loginRes.status === 200) {
        const loginStatus = await loginRes.json();
        dispatch(addUser(loginStatus.user));
        dispatch(authenticate());
        setLoading(false);
      } else {
        dispatch(deAuthenticate());
        dispatch(setError("Failed to authenticate user"));
        setLoading(false);
      }
    } else if (guest) {
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
      setLoading(false);
    }
  };

  useEffect(() => {
    getLoginStatus();
  }, [authenticate]);

  const handleSignInClick = () => {
    window.open("http://localhost:5000/odinbook/facebook", "_self");
  };

  const handleLogoutClick = () => {
    if (user.guest) {
      dispatch(addUser({}));
      localStorage.clear();
      dispatch(deAuthenticate());
      navigate("/odinbook");
    } else {
      window.open("http://localhost:5000/odinbook/logout", "_self");
      dispatch(deAuthenticate());
      navigate("/odinbook");
    }
  };

  if (loading) {
    return <div></div>;
  } else {
    return (
      <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/odinbook">
            Odinbook
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0" style={{ width: "100%" }}>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/odinbook">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/odinbook/timeline">
                  Timeline
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  aria-current="page"
                  href="/odinbook/users"
                >
                  Users
                </a>
              </li>
              <li className="nav-item ms-auto">
                {authenticated ? (
                  <button
                    className="nav-link"
                    style={{ border: "none", backgroundColor: "transparent" }}
                    onClick={handleLogoutClick}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="nav-link"
                    style={{ border: "none", backgroundColor: "transparent" }}
                    onClick={handleSignInClick}
                  >
                    Login
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
};

export default Navbar;
