import React from "react";
import axios from "axios";
import Joi from "joi";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
export default function Message() {
  const [profile, setProfile] = useState({ name: "", profilePic: "" });
  const [error, setError] = useState([]);
  const [invalidId, setInvalidId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const params = useParams();

  async function getProfile() {
    const { data } = await axios.get(`https://saraha.up.railway.app/profile/${params.id}`);
    if (data.message === "Done") {
      setProfile(data.user);
    } else if (data.message == "in-valid user account") {
      setInvalidId(true);
    } else {
      setProfile({ name: "", profilePic: "" });
      setInvalidId(true);
    }
  }

  function getMessage({ target }) {
    setMessageBody({ [target.name]: target.value });
  }
  function validateMessage(message) {
    const schema = Joi.object({
      messageBody: Joi.string().min(5).max(500).required(),
    });
    return schema.validate(message, { abortEarly: false });
  }
  async function sendData(e) {
    e.preventDefault();
    setIsLoading(true);
    const result = validateMessage(messageBody);

    if (result.error) {
      setIsLoading(false);
      setError(result.error.details);
    } else {
      setIsLoading(true);
      setError([]);
      const { data } = await axios.post(`https://saraha.up.railway.app/message/${params.id}`, messageBody);
      if (data.message === "Done") {
        setIsLoading(false);
        setIsDone(true);
      } else {
        setError(data.message);
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
          <div className="col-md-5 mb-2 ">
            {invalidId ? (
              <h1 className="text-white text-center">Invalid id</h1>
            ) : (
              <>
                {isDone ? (
                  <h1 className="text-white text-center">Your message was sent successfully to {profile.name} </h1>
                ) : (
                  <>
                    <div className="mt-4 d-flex justify-content-center align-items-center flex-column text-center">
                      <img className="rounded " src={`https://saraha.up.railway.app/${profile.profilePic}`} alt="profilepicture" />
                      <h1 className="text-white">{profile.name}</h1>
                    </div>

                    <form onSubmit={sendData}>
                      <textarea name="messageBody" onChange={getMessage} placeholder="leave a constructive message" className="form-control rounded shadow-none my-1" id="" cols="30" rows="4"></textarea>
                      <button type="submit" className="btn btn-redish w-100 mt-2">
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Send"}
                      </button>
                    </form>
                    {error.map((item, index) => {
                      return (
                        <div key={index} className="mt-1 alert alert-danger">
                          {item.message}
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
