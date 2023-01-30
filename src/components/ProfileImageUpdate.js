import { useNavigate } from "react-router-dom";
const { React, useState } = require("react");
const { useSelector } = require("react-redux");

const ProfileImageUpdate = () => {
  const [profileImg, setProfileImg] = useState();
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const navigate = useNavigate();

  const handleImgUrlChange = (event) => {
    setProfileImg(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch(`http://localhost:5000/odinbook/user/update-img/${user._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ profileImg }),
    });

    navigate("/odinbook");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="imgUrl" className="form-label">
            Enter Image URL:{" "}
          </label>
          <input
            onChange={handleImgUrlChange}
            type="text"
            className="form-control"
            id="imgUrl"
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
};

export default ProfileImageUpdate;
