import React, { useState } from "react";
import axios from "axios";
import Joi from "joi";

export default function Reset() {
  const [user, setUser] = useState({ email: "" });
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  function getUser({ target }) {
    setUser({ ...user, [target.name]: target.value });
  }
  function validateEmail(user) {
    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
    });
    return schema.validate(user, { abortEarly: false });
  }
  async function sendData(e) {
    e.preventDefault();
    setIsLoading(true);
    const result = validateEmail(user);

    if (result.error) {
      setIsLoading(false);
      setErrorList(result.error.details);
    } else {
      setIsLoading(true);
      setError("");
      setErrorList([]);
      const { data } = await axios.post("https://saraha.up.railway.app/reset", user);
      console.log(data);

      if (data.message === "Done") {
        setIsDone(true);
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
          {isDone ? (
            <h1 className="text-white text-center">An email has been sent to You </h1>
          ) : (
            <>
              <div className=" col-md-5   text-center">
                <form onSubmit={sendData}>
                  <div className="form-group">
                    <input onChange={getUser} placeholder="Enter email" type="email" name="email" className="form-control mb-2" />
                  </div>

                  <button type="submit" className="btn btn-redish w-100">
                    {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Reset"}
                  </button>
                  {errorList.map((item, index) => {
                    return (
                      <div key={index} className="mt-3 alert alert-danger">
                        {item.message}
                      </div>
                    );
                  })}
                  {error && <div className="alert alert-danger mt-2">{error}</div>}
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
