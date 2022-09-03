import React from "react";
import { useState } from "react";
import axios from "axios";
import { ProgressBar } from "react-bootstrap";
export default function UpdatePicture({ getProfile }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  function fileSelectedHandler(e) {
    setImage(e.target.files[0]);
  }
  async function fileUploadHandler() {
    if (image.type == "image/jpeg" || image.type == "image/png" || image.type == "image/jpg") {
      setError("");
      const fd = new FormData();
      fd.append("image", image, image.name);

      const { data } = await axios.patch(
        "https://saraha.up.railway.app/updateProfilePic",
        fd,

        {
          headers: { authorization: `Bearer ${token}` },
          onUploadProgress: (ProgressEvent) => {
            setProgress(Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100));

            if ((ProgressEvent.loaded / ProgressEvent.total) * 100 == 100) {
              setTimeout(() => setProgress(0), 1000);
            }
          },
        }
      );
      getProfile();
    } else {
      setError("only jpeg, png or jpg are allowed");
    }
  }
  return (
    <>
    
      <div className="d-flex justify-content-center align-items-center">
        <input type="file" className="form-control my-3" name="" id="" onChange={fileSelectedHandler} />
        <button className="btn btn-danger my-3 mx-2" onClick={fileUploadHandler}>
          upload
        </button>
      </div>
      {progress ? <ProgressBar now={progress} animated striped variant="info" className="mb-3" label={`${progress}%`} /> : null}
      {error ? <div className="alert alert-danger mt-2">{error}</div> : null}
    </>
  );
}
