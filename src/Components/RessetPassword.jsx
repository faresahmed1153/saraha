import React, { useState, useEffect } from "react";
import axios from "axios";
import Joi from "joi";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { isExpired, decodeToken } from "react-jwt";
export default function RessetPassword() {
  const [user, setUser] = useState({ password: "", cPassword: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expired, setExpired] = useState("");
  const params = useParams();
  useEffect(() => {
    isValid();
  }, []);
  function getPassword({ target }) {
    setUser({ ...user, [target.name]: target.value });
  }
  function isValid() {
    try {
      const token = params.token;

      if (!decodeToken(token)) {
        setExpired("invalid token");
      }
      if (isExpired(token)) {
        setExpired("The token has expired pls make a new request");
      }
    } catch (error) {
      setError(error);
    }
  }
  function validatePassword(user) {
    const schema = Joi.object({
      password: Joi.string()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/))
        .required(),
      cPassword: Joi.string().valid(Joi.ref("password")).required(),
    });
    return schema.validate(user, { abortEarly: false });
  }
  async function sendData(e) {
    console.log(params.token);
    e.preventDefault();
    setIsLoading(true);
    const result = validatePassword(user);

    if (result.error) {
      setIsLoading(false);
      setErrorList(result.error.details);
    } else {
      setIsLoading(true);
      setErrorList([]);
      setError("");
      const { data } = await axios.patch(`https://saraha.up.railway.app/reset-password/${params.token}`, user);
      console.log(data);

      if (data.message === "Done") {
        navigate("/login");
      } else {
        setError(data.message);
      }
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="container ">
        <div className="row justify-content-center align-items-center vh-100 ">
          <div className=" col-md-5   text-center">
            {expired ? (
              <div className="alert alert-danger mt-2">{expired}</div>
            ) : (
              <>
                <form onSubmit={sendData}>
                  <div className="form-group">
                    <input onChange={getPassword} placeholder="new password" type="password" name="password" className="form-control" />
                  </div>
                  <div className="form-group my-2">
                    <input onChange={getPassword} placeholder="confirm new password" type="password" name="cPassword" className=" form-control" />
                  </div>

                  <button type="submit" className="btn btn-redish w-100">
                    {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Reset"}
                  </button>

                  {errorList.map((item, index) => {
                    if (item.message.includes("cPassword")) {
                      return (
                        <div key={index} className="mt-3  alert alert-danger">
                          new password doesn't match confirm
                        </div>
                      );
                    }
                    if (item.message.includes("password")) {
                      return (
                        <div key={index} className="mt-3  alert alert-danger">
                          password length must be 8 characters and include
                          <ul className="text-start mt-2">
                            <li> at least 1 lowercase </li>
                            <li> at least 1 uppercase </li>
                            <li> at least 1 numeric character</li>
                            <li> at least one special character </li>
                          </ul>
                        </div>
                      );
                    } else {
                      return (
                        <div key={index} className="mt-3 alert alert-danger">
                          {item.message}
                        </div>
                      );
                    }
                  })}
                  {error && <div className="alert alert-danger mt-2">{error}</div>}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
