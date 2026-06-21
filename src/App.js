import React, { useState, useEffect } from 'react';

const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Luxury 3 BHK Residential Apartment",
    intent: "Rent",
    type: "Residential",
    subCategory: "Apartment",
    locality: "DLF Phase 3, Gurugram",
    city: "Gurugram",
    country: "India",
    priceDisplay: "₹65,000 / month",
    facilities: "Modular Kitchen, Gym Access, Pool",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
  },
  {
    id: 2,
    title: "Industrial Logistics Warehouse Space",
    intent: "Rent",
    type: "Commercial",
    subCategory: "Warehouse",
    locality: "Sector 62, Noida",
    city: "Noida",
    country: "India",
    priceDisplay: "₹1,85,000 / month",
    facilities: "Loading Docks, High Ceilings",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600"
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [listingStep, setListingStep] = useState(1);

  // Search Engine Parameters
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [keywordSearch, setKeywordSearch] = useState(""); 
  const [propertyType, setPropertyType] = useState("Residential"); 
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Onboarding States
  const [userProfile, setUserProfile] = useState("Owner"); 
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // Modal Control States
  const [showAuthModal, setShowAuthModal] = useState(false); 
  const [showRecoveryModal, setShowRecoveryModal] = useState(false); 
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [dismissRecoveryForever, setDismissRecoveryForever] = useState(false);

  // Listing Form States
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Residential");
  const [newSubCategory, setNewSubCategory] = useState("Apartment");
  const [newCity, setNewCity] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newFacilities, setNewFacilities] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const results = properties.filter(prop => {
      const matchesIntent = prop.intent === activeIntent;
      const matchesType = prop.type === propertyType;
      const matchesCountry = prop.country.toLowerCase() === selectedCountry.toLowerCase();
      const cleanQuery = keywordSearch.toLowerCase().trim();
      return matchesIntent && matchesType && matchesCountry && 
        (cleanQuery === "" || prop.city.toLowerCase().includes(cleanQuery) || prop.subCategory.toLowerCase().includes(cleanQuery));
    });
    setFilteredProperties(results);
  }, [properties, activeIntent, selectedCountry, propertyType, keywordSearch]);

  useEffect(() => {
    let timer;
    if (currentPage === "list-property-flow" && listingStep === 1 && !otpSent && !showAuthModal && !dismissRecoveryForever) {
      timer = setTimeout(() => {
        setShowRecoveryModal(true);
      }, 20000);
    }
    return () => clearTimeout(timer);
  }, [currentPage, listingStep, otpSent, showAuthModal, dismissRecoveryForever]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 4 || files.length > 5) {
      setErrorMsg("❌ Security Rule: 4 to 5 high-resolution images required.");
      e.target.value = "";
      return;
    }
    setSelectedImages(files);
  };

  const triggerInitialSubmit = (e) => {
    e.preventDefault();
    setShowAuthModal(true); 
  };

  const handleAuthContinue = (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    setOtpSent(true);
  };

  const verifyAuthOTP = (e) => {
    e.preventDefault();
    if (otpCode === "1234") {
      setIsHumanVerified(true);
      setShowAuthModal(false);
      setListingStep(2); 
      setErrorMsg("");
    } else {
      alert("Invalid OTP code. Please enter '1234' to bypass.");
    }
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    alert(`📞 Callback Scheduled! We will reach out to you at ${recoveryPhone} shortly.`);
    setShowRecoveryModal(false);
  };

  const submitFinalListing = (e) => {
    e.preventDefault();
    const createdItem = {
      id: properties.length + 1,
      title: newTitle,
      intent: activeIntent,
      type: newType,
      subCategory: newSubCategory,
      locality: "Verified Premium Area",
      city: newCity,
      country: "India",
      priceDisplay: `₹${parseInt(newPrice).toLocaleString()} / month`,
      facilities: newFacilities,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
    };
    setProperties([...properties, createdItem]);
    alert("🎉 Listing successfully verified and published live!");
    setCurrentPage("landing");
    setListingStep(1);
    setOtpSent(false);
    setIsHumanVerified(false);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', position: 'relative' }}>
      
      {/* ========================================================
          UPGRADED HIGH-FIDELITY ENTERPRISE HEADER NAVIGATION
          ======================================================== */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-2" style={{ backgroundColor: '#a81c1c' }}>
        <div className="container-fluid px-4">
          {/* Brand Logo */}
          <span className="navbar-brand fs-3 fw-bold text-white me-4" onClick={() => setCurrentPage("landing")} style={{ cursor: 'pointer' }}>
            Rent<span style={{color: '#D4AF37'}}>Office</span>Place
          </span>

          {/* Center Search Actions (Inspired by image_5cdeed.png) */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto align-items-center">
              <li className="nav-item dropdown px-2">
                <a className="nav-link dropdown-toggle text-white fw-semibold" href="#buy" role="button" onClick={() => { setCurrentPage("landing"); setActiveIntent("Buy"); }}>Buy</a>
              </li>
              <li className="nav-item dropdown px-2">
                <a className="nav-link dropdown-toggle text-white fw-semibold" href="#rent" role="button" onClick={() => { setCurrentPage("landing"); setActiveIntent("Rent"); }}>Rent</a>
              </li>
              <li className="nav-item dropdown px-2">
                <a className="nav-link dropdown-toggle text-white fw-semibold" href="#sell" role="button" onClick={() => setCurrentPage("list-property-flow")}>Sell</a>
              </li>
              <li className="nav-item px-2">
                <a className="nav-link text-white-50 small" href="#help" onClick={(e) => e.preventDefault()}>Help</a>
              </li>
            </ul>

            {/* Right Side Control Links */}
            <div className="d-flex align-items-center">
              <button 
                type="button" 
                className="btn btn-link text-white text-decoration-none me-3 fw-semibold border border-white-50 rounded px-3 py-1" 
                style={{ fontSize: '0.9rem' }}
                onClick={() => setShowAuthModal(true)}
              >
                Sign In / My Activity ▾
              </button>
              
              <button 
                className="btn fw-bold px-3 py-1 rounded-3" 
                style={{ backgroundColor: '#d4af37', color: '#1a1a1a', border: 'none', fontSize: '0.95rem' }}
                onClick={() => setCurrentPage("list-property-flow")}
              >
                Post Property <span className="badge bg-dark text-warning ms-1 small">FREE</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* VIEW PANEL 1: PUBLIC DISCOVERY HOME */}
      {currentPage === "landing" && (
        <div>
          <header className="py-5 text-white text-center" style={{
            background: "linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.9)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200') center/cover",
            padding: "90px 0"
          }}>
            <div className="container">
              <h1 className="fw-bold mb-4">Global Real Estate Search Console</h1>
              <div className="card shadow-lg p-4 mx-auto border-0 rounded-4 bg-white text-dark" style={{ maxWidth: '900px' }}>
                <div className="row g-2">
                  <div className="col-md-4">
                    <select className="form-select fw-semibold" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                      <option value="Residential">Residential 🏠</option>
                      <option value="Commercial">Commercial 🏢</option>
                      <option value="Hostels">Hostels 👥</option>
                      <option value="PG">PG (Paying Guest) 🛏️</option>
                    </select>
                  </div>
                  <div className="col-md-5">
                    <input type="text" className="form-control" placeholder="Search city or specific type (e.g. Noida, Warehouse, Shop)..." value={keywordSearch} onChange={(e) => setKeywordSearch(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-primary w-100 fw-bold shadow-sm" style={{ backgroundColor: '#0056b3' }}>Search</button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="container py-5">
            <h3 className="fw-bold mb-4 text-dark text-start">Available Verified Placements ({filteredProperties.length})</h3>
            <div className="row g-4">
              {filteredProperties.map(property => (
                <div className="col-md-4" key={property.id}>
                  <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                    <img src={property.image} className="card-img-top" alt="Property Assets" style={{ height: '200px', objectFit: 'cover' }} />
                    <div className="card-body p-4">
                      <span className="badge bg-dark text-warning mb-2 px-3 py-1 rounded-pill">{property.type} ({property.subCategory})</span>
                      <h5 className="card-title fw-bold text-dark">{property.title}</h5>
                      <p className="card-text text-muted mb-2">📍 {property.locality}</p>
                      <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                        <span className="fs-5 fw-bold text-success">{property.priceDisplay}</span>
                        <button className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold">Contact Owner</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* VIEW PANEL 2: AD ENTRY MANAGEMENT LAYOUT */}
      {currentPage === "list-property-flow" && (
        <main className="container py-5">
          <div className="mx-auto" style={{ maxWidth: '550px' }}>
            <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h4 className="fw-bold text-dark mb-0">Post Property Ads</h4>
                <span className="badge bg-light text-muted border p-2">Step {listingStep} of 2</span>
              </div>

              {errorMsg && <div className="alert alert-danger p-2 small fw-semibold mb-3">{errorMsg}</div>}

              {listingStep === 1 && (
                <div>
                  <h4 className="fw-bold text-dark mb-1">Let's get you started</h4>
                  <p className="text-muted small mb-4">Post your property Ad to sell or rent online for free!</p>
                  
                  <form onSubmit={triggerInitialSubmit}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary d-block">You are:</label>
                      <div className="btn-group w-100" role="group">
                        {["Owner", "Agent", "Builder"].map(profile => (
                          <button key={profile} type="button" className={`btn py-2 ${userProfile === profile ? 'btn-dark fw-bold' : 'btn-outline-secondary'}`} onClick={() => setUserProfile(profile)}>{profile}</button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary d-block">You are here to:</label>
                      <div className="btn-group w-100" role="group">
                        {["Rent/Lease", "Sell"].map(intentOption => (
                          <button key={intentOption} type="button" className={`btn py-2 ${activeIntent === (intentOption === 'Sell' ? 'Buy' : 'Rent') ? 'btn-dark fw-bold' : 'btn-outline-secondary'}`} onClick={() => setActiveIntent(intentOption === 'Sell' ? 'Buy' : 'Rent')}>{intentOption}</button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary">And it's a ...</label>
                      <select className="form-select fw-semibold text-muted" value={newType} onChange={(e) => setNewType(e.target.value)}>
                        <option value="Residential">Residential Property</option>
                        <option value="Commercial">Commercial Property</option>
                        <option value="Hostels">Hostels Group</option>
                        <option value="PG">PG (Paying Guest)</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold rounded-3 py-2 fs-5 shadow-sm" style={{ backgroundColor: '#0056b3', border: 'none' }}>Start Now</button>
                  </form>
                </div>
              )}

              {listingStep === 2 && isHumanVerified && (
                <form onSubmit={submitFinalListing}>
                  <h5 className="fw-bold text-success mb-3">✓ Authenticated successfully. Complete listing details:</h5>
                  <div className="mb-3">
                    <label className="form-label small fw-bold mb-1">Listing Title Name</label>
                    <input type="text" className="form-control" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Modern Commercial Store Front" />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold mb-1">Specific Classification</label>
                      {newType === 'Commercial' ? (
                        <select className="form-select" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
                          <option value="Shop">Shop 🛍️</option><option value="Warehouse">Warehouse 📦</option><option value="Clinic">Clinic 🩺</option><option value="Store">Store 🏬</option><option value="Factory">Factory 🏭</option>
                        </select>
                      ) : (
                        <select className="form-select" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
                          <option value="Apartment">Apartment Flat</option><option value="House">Independent House</option><option value="Villa">Villa</option>
                        </select>
                      )}
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6"><label className="form-label small fw-bold mb-1">City Location</label><input type="text" className="form-control" required value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Noida" /></div>
                    <div className="col-6"><label className="form-label small fw-bold mb-1">Monthly Cost (INR)</label><input type="number" className="form-control" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 45000" /></div>
                  </div>
                  <div className="mb-3"><label className="form-label small fw-bold mb-1">Key Amenities</label><input type="text" className="form-control" required value={newFacilities} onChange={(e) => setNewFacilities(e.target.value)} placeholder="e.g. Parking, Attached Bathroom, Power Backup" /></div>
                  <div className="mb-4"><label className="form-label small fw-bold mb-1 text-primary">Upload Gallery Images (4-5 Photos Required)</label><input type="file" className="form-control" multiple accept="image/*" required onChange={handleImageChange} /></div>
                  <button type="submit" className="btn btn-warning w-100 fw-bold rounded-pill text-dark shadow-sm">Publish Active Listing</button>
                </form>
              )}
            </div>
          </div>
        </main>
      )}

      {/* LOGIN / REGISTER POPUP MODAL */}
      {showAuthModal && (
        <div className="modal-backdrop fade show" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow border-0 p-4 bg-white rounded-4 position-relative text-start" style={{ maxWidth: '440px', width: '92%' }}>
            <button type="button" className="btn-close position-absolute" style={{ top: '20px', right: '22px', border: 'none', background: 'none', fontSize: '1.25rem', color: '#666' }} onClick={() => setShowAuthModal(false)}>✕</button>
            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: '1.65rem', color: '#092143' }}>Login / Register</h3>
            <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>Please enter your Phone Number</p>
            {!otpSent ? (
              <form onSubmit={handleAuthContinue}>
                <div className="mb-4 p-2 rounded-3 border d-flex align-items-center" style={{ backgroundColor: '#fff', borderColor: '#4a90e2', borderWidth: '1.5px' }}>
                  <div className="pe-2 border-end d-flex align-items-center">
                    <select className="form-select border-0 bg-transparent py-0 pe-4 shadow-none fw-semibold text-dark" style={{ width: '80px' }}>
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                    </select>
                  </div>
                  <input type="number" className="form-control border-0 bg-transparent shadow-none fs-5 ps-3 py-1" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                </div>
                <button type="submit" className="btn w-100 fw-bold py-2 text-white mb-3 shadow-sm rounded-3 transition" style={{ backgroundColor: '#6cbdff', borderColor: '#6cbdff', fontSize: '1.1rem' }}>Continue</button>
              </form>
            ) : (
              <form onSubmit={verifyAuthOTP}>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-success">Enter Security OTP Token (Bypass key code: 1234)</label>
                  <input type="text" className="form-control text-center fs-3 py-1 fw-bold" placeholder="••••" maxLength="4" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-3 text-white mb-3" style={{ fontSize: '1.1rem' }}>Verify & Validate</button>
              </form>
            )}
            <button type="button" className="btn btn-outline-dark w-100 py-2 rounded-3 d-flex align-items-center justify-content-center fw-bold mb-4" style={{ borderColor: '#d3d3d3', color: '#092143', fontSize: '1.05rem' }}>✉ Login with Email</button>
            <div className="text-center text-muted border-top pt-3" style={{ fontSize: '0.72rem' }}>By clicking you agree to <a href="#terms" className="text-primary text-decoration-none fw-semibold">Terms and Conditions</a></div>
          </div>
        </div>
      )}

      {/* DROP-OFF RECOVERY SYSTEM */}
      {showRecoveryModal && (
        <div className="modal-backdrop fade show" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow-lg border-0 p-4 bg-white rounded-3 position-relative text-center" style={{ maxWidth: '420px', width: '90%' }}>
            <button type="button" className="btn-close position-absolute" style={{ top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '1.2rem' }} onClick={() => setShowRecoveryModal(false)}>✕</button>
            <h4 className="fw-bold text-dark mb-2 mt-2">Stuck in the form?</h4>
            <p className="text-muted small mb-4">Give us your mobile number and we will call you!</p>
            <form onSubmit={handleRecoverySubmit}>
              <div className="mb-3"><input type="number" className="form-control py-2 text-center" placeholder="Phone Number" required value={recoveryPhone} onChange={(e) => setRecoveryPhone(e.target.value)} /></div>
              <button type="submit" className="btn btn-primary w-100 fw-bold py-2 rounded-3 mb-3" style={{ backgroundColor: '#6cbdff', borderColor: '#6cbdff' }}>Submit</button>
            </form>
            <div className="text-muted small my-2">— OR —</div>
            <p className="small mt-2 mb-4">Now post via <span style={{color: '#25D366'}}>🟢 Whatsapp</span>. Send a "hi" to <br /><a href="https://wa.me/917428197035" target="_blank" rel="noreferrer" className="fw-bold text-primary text-decoration-none">7428197035</a></p>
            <button type="button" className="btn btn-link btn-sm text-decoration-none text-muted fw-semibold" onClick={() => { setDismissRecoveryForever(true); setShowRecoveryModal(false); }}>Do not show again</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
