import React, { useState } from 'react';

// Premium Mock Data for Initial Setup & Visual Engineering
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Premium Corporate Office Space",
    type: "Commercial",
    city: "Noida",
    country: "India",
    price: "₹85,000 / month",
    size: "2,500 sq ft",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600"
  },
  {
    id: 2,
    title: "Luxury 3 BHK Residential Apartment",
    type: "Residential",
    city: "Gurugram",
    country: "India",
    price: "₹65,000 / month",
    size: "1,800 sq ft",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
  },
  {
    id: 3,
    title: "Modern Co-Working Hub Desk",
    type: "Commercial",
    city: "Sydney",
    country: "Australia",
    price: "$450 / month",
    size: "Hot Desk",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=600"
  }
];

function App() {
  const [countryFilter, setCountryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("Commercial");
  const [filteredProperties, setFilteredProperties] = useState(MOCK_PROPERTIES);

  const handleSearch = () => {
    const results = MOCK_PROPERTIES.filter(prop => {
      const matchCountry = prop.country.toLowerCase().includes(countryFilter.toLowerCase());
      const matchCity = prop.city.toLowerCase().includes(cityFilter.toLowerCase());
      const matchType = prop.type === typeFilter;
      return matchCountry && matchCity && matchType;
    });
    setFilteredProperties(results);
  };

  return (
    <div>
      {/* HEADER NAVIGATION */}
      <nav className="navbar navbar-expand-lg bg-premium-dark navbar-dark py-3 border-bottom border-warning">
        <div className="container">
          <span className="fs-3 fw-bold text-white">Rent<span style={{color: '#D4AF37'}}>Office</span>Place</span>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link text-white mx-2" href="#explore">Explore Spaces</a></li>
              <li className="nav-item ms-3"><button className="btn btn-outline-light me-2">Login</button></li>
              <li className="nav-item"><button className="btn btn-warning px-4 fw-bold">Register</button></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO HERO CONTAINER */}
      <header className="hero-section text-center text-white py-5" style={{
        background: "linear-gradient(rgba(10,25,47,0.85), rgba(10,25,47,0.95)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200') center/cover",
        padding: "100px 0"
      }}>
        <div className="container py-4">
          <h1 className="display-4 fw-bold">Global Property Marketplace</h1>
          <p className="lead text-light mb-4">Find Luxury Commercial & Premium Residential Spaces Instantly</p>
          
          {/* INTERACTIVE FILTERS */}
          <div className="card shadow p-4 mx-auto text-dark rounded-4" style={{ maxWidth: '900px' }}>
            <div className="row g-2">
              <div className="col-md-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Country (e.g. India)" 
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="City (e.g. Noida)" 
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                </select>
              </div>
              <div className="col-md-3">
                <button className="btn btn-dark w-100 fw-bold" onClick={handleSearch}>Search Spaces</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PROPERTIES DISPLAY GRID */}
      <main className="container py-5" id="explore">
        <h2 className="text-center fw-bold mb-4">Featured Verified Properties</h2>
        <div className="row g-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <div className="col-md-4" key={property.id}>
                <div className="card h-100 shadow-sm rounded-3 border-0">
                  <img src={property.image} className="card-img-top rounded-top-3" alt={property.title} style={{ height: '220px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <span className={`badge mb-2 ${property.type === 'Commercial' ? 'bg-danger' : 'bg-success'}`}>{property.type}</span>
                    <h5 className="card-title fw-bold">{property.title}</h5>
                    <p className="card-text text-muted mb-1">📍 {property.city}, {property.country}</p>
                    <p className="card-text text-secondary mb-3">📐 Size: {property.size}</p>
                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                      <span className="fs-5 fw-bold text-dark">{property.price}</span>
                      <button className="btn btn-sm btn-outline-dark fw-bold">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted fs-5">No properties matching your specific filters were found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;import React, { useState, useEffect } from 'react';

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
