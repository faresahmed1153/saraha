import React from "react";
import UpdatePicture from "./UpdatePicture";
import axios from "axios";
import Joi from "joi";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "", profilePic: "" });
  const [backup, setBackup] = useState({ name: "", email: "", profilePic: "" });
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getProfile() {
    const { data } = await axios.get("https://saraha.up.railway.app/Myprofile", {
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.message === "Done") {
      setProfile(data.user);
      setBackup(data.user);
    } else if (data.message === "catch error") {
      setError("session expired please login again");
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setProfile({ name: "", email: "", profilePic: "" });
      navigate("/login");
    }
  }

  function getUser({ target }) {
    setProfile({ ...profile, [target.name]: target.value });
  }
  function validateUpdate(user) {
    const schema = Joi.object({
      name: Joi.string(),

      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    });

    return schema.validate(user, { abortEarly: false });
  }
  async function sendData(e) {
    e.preventDefault();
    setIsLoading(true);

    if (backup.name == profile.name && backup.email == profile.email) {
      setIsLoading(false);
      setErrorList([]);
      return;
    }

    let currentUser = { name: profile.name, email: profile.email };

    const result = validateUpdate(currentUser);

    if (result.error) {
      setIsLoading(false);
      setErrorList(result.error.details);
    } else {
      setIsLoading(true);
      setErrorList([]);
      if (backup.name == profile.name) {
        delete currentUser.name;
      }
      if (backup.email == profile.email) {
        delete currentUser.email;
      }

      const { data } = await axios.patch("https://saraha.up.railway.app/updateProfile", currentUser, {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log(data);
      if (data.message === "Done") {
        setIsLoading(false);
        getProfile();
      } else if (data.message === "catch error") {
        setError("session expired please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.log(data.message);
        setErrorList([data]);
        setIsLoading(false);
      }
    }
  }
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <>
      <div className="container">
        <div className="row justify-content-center align-items-center flex-column vh-100  ">
          <div className="col-md-5 mt-5 ">
            <div className="d-flex justify-content-center align-items-center flex-column">
              {error ? (
                <>
                  <div className="alert alert-danger">{error}</div>
                </>
              ) : (
                ""
              )}

              <img className="rounded mb-2" src={`https://saraha.up.railway.app/${profile.profilePic}`} alt="profilepicture" />
            </div>
            
            <form onSubmit={sendData}>
              <div className=" mb-3">
                <input onChange={getUser} placeholder="Enter your name" value={profile.name} name="name" type="text" className="form-control" />
              </div>

              <div className="my-3">
                <input onChange={getUser} placeholder="Enter your email" value={profile.email} type="email" name="email" className="form-control" />
              </div>
              <button type="submit" className="btn btn-redish w-100">
                {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Update"}
              </button>
              <UpdatePicture getProfile={getProfile} />
              <Link to="/changePassword" className="mt-3 btn btn-dark text-white w-100">
                Change my password
              </Link>
            </form>
            {errorList.map((item, index) => {
              return (
                <div key={index} className="mt-3 alert alert-danger">
                  {item.message}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
