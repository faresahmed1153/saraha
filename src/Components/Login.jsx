import React, { useState } from "react";
import axios from "axios";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function Login({ getUserData }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function getUser({ target }) {
    setUser({ ...user, [target.name]: target.value });
  }
  function validateLogin(user) {
    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
        .required(),
    });
    return schema.validate(user, { abortEarly: false });
  }
  async function sendData(e) {
    e.preventDefault();
    setIsLoading(true);
    const result = validateLogin(user);

    if (result.error) {
      setIsLoading(false);
      setErrorList(result.error.details);
    } else {
      setIsLoading(true);
      const { data } = await axios.post("https://saraha-api.fly.dev/signin", user);
      console.log(data);

      if (data.message === "Done") {
        localStorage.setItem("token", data.token);
        getUserData();
        navigate("/");
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
            <form onSubmit={sendData}>
              <div className="form-group">
                <input onChange={getUser} placeholder="Enter email" type="email" name="email" className="form-control" />
              </div>
              <div className="form-group my-2">
                <input onChange={getUser} placeholder="Enter your password" type="password" name="password" className=" form-control" />
              </div>

              <button type="submit" className="btn btn-redish w-100">
                {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Sign In"}
              </button>
              <div className="text-end">
                <Link to="/reset" className=" link-danger">
                  Forgot your password ?
                </Link>
              </div>
              {errorList.map((item, index) => {
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
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
