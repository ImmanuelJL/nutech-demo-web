import React, { useState, useEffect } from "react";
import './App.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
library.add(faEnvelope, faLock)

function App() {
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    document.title = process.env.REACT_APP_NAME;
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    setErrorMessages({ name: "errorMessage", message: "" });

    const data = JSON.stringify({email: uname.value, password: pass.value});
    const customConfig = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    axios.post(process.env.REACT_APP_BACKEND_URL + '/api/login', data, customConfig)
      .then(res => {
        // console.log(res);
        // console.log(res.data.data.token);
        if (res.status === 200) {
          localStorage.setItem('authenticated', true);
          localStorage.setItem('xaccesstoken', res.data.data.token);
          navigate('/item');
        }
      })
      .catch(error => {
        console.error(error);
        setErrorMessages({ name: "errorMessage", message: error.response.data.message });
      });
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="container mt-5">
      <div className="row d-flex justify-content-center">
        <center>
          <h1>CRUD Item Data</h1>
        </center>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-md-6">
          <div className="card px-5 py-5">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="input-group mb-3">
                <input type="text" className="form-control" name="uname" required autoFocus placeholder="Email" />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input type="password" className="form-control" name="pass" required autoComplete="current-password" placeholder="Password" />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                </div>
              </div>
            </form>
            <div className="mb-1">
              {renderErrorMessage("errorMessage")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    renderForm
  );
}

export default App;
