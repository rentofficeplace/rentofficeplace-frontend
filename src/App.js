import React, { useState, useEffect } from 'react';

function App() {
  // LINK TO YOUR LIVE AWS BACKEND SERVER
  const BACKEND_URL = "https://Rentofficeplace-backend-env.eba-2yqegvud.ap-southeast-2.elasticbeanstalk.com";
  
  const [serverStatus, setServerStatus] = useState("Connecting to AWS API...");

  useEffect(() => {
    fetch(BACKEND_URL + '/')
      .then(res => res.text())
      .then(data => setServerStatus(data))
      .catch(err => setServerStatus("Offline or loading connection..."));
  }, []);

  return (
    <div>
      {/* HEADER SECTION */}
      <nav className="navbar navbar-expand-lg bg-premium-dark navbar-dark py-3 border-bottom border-warning">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#home">
            <span className="fs-3 fw-bold text-white">Rent<span className="text-gold">Office</span>Place</span>
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item"><a className="nav-link text-white mx-2" href="#commercial">Commercial</a></li>
              <li className="nav-item"><a className="nav-link text-white mx-2" href="#residential">Residential</a></li>
              <li className="nav-item"><a className="nav-link text-white mx-2" href="#hostels">Hostel & PG</a></li>
              <li className="nav-item ms-3"><button className="btn btn-outline-light me-2">Login</button></li>
              <li className="nav-item"><button className="btn btn-gold px-4">Register</button></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero-section text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Global Commercial & Residential Property Marketplace</h1>
          <p className="lead text-light mb-4">Find Your Perfect Space Anywhere in the World</p>
          
          {/* SEARCH CARD */}
          <div className="card shadow p-4 mx-auto text-dark rounded-4" style={{ maxWidth: '900px' }}>
            <div className="row g-2">
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Country (e.g. India)" />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="City (e.g. Noida)" />
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option>Commercial</option>
                  <option>Residential</option>
                </select>
              </div>
              <div className="col-md-3">
                <button className="btn btn-gold w-100">Search Spaces</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SYSTEM INTEGRATION HEALTH STATUS FOOTER */}
      <div className="container py-4 text-center">
        <div className="alert alert-dark d-inline-block shadow-sm">
          <span className="fw-bold text-secondary">Cloud Core Connection Pipeline Status :</span> <span className="text-success fw-bold">{serverStatus}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
