import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  const arabic = /[\u0600-\u06FF]/;
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [data, setData] = useState([]);
  const [id, setID] = useState(0);
  async function getData() {
    const { data } = await axios.get("https://saraha-api.fly.dev/messages", {
      headers: { authorization: `Bearer ${token}` },
    });
    console.log(data.messages);
    if (data.message == "Done") {
      setID(data.reciverId);
      setData(data.messages.reverse());
    } else if (data.message === "catch error") {
      setError("session expired please login again");
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setData([]);
    }
  }
  async function deleteMessage(messageId) {
    const { data } = await axios.delete(`https://saraha-api.fly.dev/message/${messageId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    console.log(data);
    if (data.message.acknowledged) {
      getData();
    } else if (data.message === "catch error") {
      setError("session expired please login again");
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setError(data.error);
    }
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="container mt-3 ">
        <div className="row justify-content-center align-items-center flex-column  ">
          <div className="text-center mt-5">
            <h4 className="text-white">Share this link to receive messages</h4>
            <h5 className="word-wrap">{`https://saraha.vercel.app/messageMe/${id}`}</h5>
          </div>
          <div className="col-md-6  mt-5 ">
            {data.map((item, index) => {
              return (
                <div key={index} className="mt-1 alert alert-danger word-wrap position-relative">
                  {arabic.test(item.messageBody) ? <div className="text-end message">{item.messageBody} </div> : <div className="message">{item.messageBody}</div>}

                  <div className="dropdown-center dots  mb-5">
                    <i className="fa fa-ellipsis-v mb-3" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></i>
                    <ul className="dropdown-menu dropdown-menu-dark text-start" aria-labelledby="dropdownMenu2">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            deleteMessage(item._id);
                          }}
                          type="button"
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-2">
                    <span className="time">{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
