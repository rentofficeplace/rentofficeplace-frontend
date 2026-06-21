import React, { useState, useEffect } from 'react';

// Unified Global Mock Database
const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Premium Corporate Office Suite",
    intent: "Rent",
    type: "Commercial",
    locality: "Sector 62, Noida",
    city: "Noida",
    country: "India",
    priceDisplay: "₹85,000 / month",
    facilities: "High-Speed Wi-Fi, 24/7 Power Backup",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600"
  },
  {
    id: 2,
    title: "Luxury 3 BHK Residential Apartment",
    intent: "Rent",
    type: "Residential",
    locality: "DLF Phase 3, Gurugram",
    city: "Gurugram",
    country: "India",
    priceDisplay: "₹65,000 / month",
    facilities: "Modular Kitchen, Gym Access, Pool",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
  },
  {
    id: 3,
    title: "Premium Boys & Girls Single PG Room",
    intent: "Rent",
    type: "PG",
    locality: "Sector 22, Noida",
    city: "Noida",
    country: "India",
    priceDisplay: "₹12,500 / month",
    facilities: "AC, Food Included, Laundry Service",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600"
  },
  {
    id: 4,
    title: "Elite Student Co-Living Hostel",
    intent: "Rent",
    type: "Hostels",
    locality: "North Campus, Delhi",
    city: "Delhi",
    country: "India",
    priceDisplay: "₹8,500 / month",
    facilities: "CCTV Security, Shared Study Lounge, Mess",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600"
  }
];

function App() {
  // Navigation State: 'landing' or 'list-property-flow'
  const [currentPage, setCurrentPage] = useState("landing");
  
  // Listing Flow Step: 1 (OTP Verification), 2 (Property Details Input Form)
  const [listingStep, setListingStep] = useState(1);

  // Search/Filter States (Initialized to "PG" so co-living options show immediately!)
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [citySearch, setCitySearch] = useState("");
  const [propertyType, setPropertyType] = useState("PG"); 
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // OTP Verification States
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // New Property Form States
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("PG");
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
      const cleanCity = citySearch.toLowerCase().trim();
      const matchesCity = cleanCity === "" || prop.city.toLowerCase().includes(cleanCity);
      return matchesIntent && matchesType && matchesCountry && matchesCity;
    });
    setFilteredProperties(results);
  }, [properties, activeIntent, selectedCountry, propertyType, citySearch]);

  // Image Upload Controller Rules
  const handleImageChange = (e) => {
    setErrorMsg("");
    const files = Array.from(e.target.files);
    if (files.length < 4 || files.length > 5) {
      setErrorMsg("❌ Security Rule: 4 to 5 high-quality images required.");
      e.target.value = "";
      return;
    }
    for (let file of files) {
      if (file.size < 1024 * 1024) { 
        setErrorMsg(`❌ Quality Warning: "${file.name}" is below 1MB resolution.`);
        e.target.value = "";
        return;
      }
    }
    setSelectedImages(files);
  };

  // Simulated Twilio Security OTP Request
  const sendOTP = (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setErrorMsg("❌ Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSent(true);
    setErrorMsg("");
    alert("🔐 Anti-Fraud System: Security OTP has been sent to your device!");
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    if (otpCode === "1234") { // Mock secure validation pass code
      setIsHumanVerified(true);
      setListingStep(2); // Unlock Phase 2 (Form Entry)
      setErrorMsg("");
    } else {
      setErrorMsg("❌ Invalid OTP Code. Please verify and retry.");
    }
  };

  const submitFinalListing = (e) => {
    e.preventDefault();
    const createdItem = {
      id: properties.length + 1,
      title: newTitle,
      intent: "Rent",
      type: newType,
      locality: "Verified Premium Area",
      city: newCity,
      country: "India",
      priceDisplay: `₹${parseInt(newPrice).toLocaleString()} / month`,
      facilities: newFacilities,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600"
    };
    setProperties([...properties, createdItem]);
    alert("🎉 Credibility Verified! Your listing is now live globally.");
    
    // Reset States and Return to main marketplace view
    setCurrentPage("landing");
    setListingStep(1);
    setOtpSent(false);
    setIsHumanVerified(false);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* GLOBAL NAVBAR CONTAINER */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 sticky-top shadow-sm">
        <div className="container">
          <span className="fs-3 fw-bold text-white cursor-pointer" onClick={() => setCurrentPage("landing")} style={{ cursor: 'pointer' }}>
            Rent<span style={{color: '#D4AF37'}}>Office</span>Place
          </span>
          <div className="ms-auto">
            {currentPage === "landing" ? (
              <button className="btn btn-warning fw-bold rounded-pill px-4 shadow-sm" onClick={() => setCurrentPage("list-property-flow")}>
                Post Property FREE
              </button>
            ) : (
              <button className="btn btn-outline-light btn-sm fw-bold rounded-pill px-3" onClick={() => setCurrentPage("landing")}>
                ← Back to Marketplace
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE VIEW 1: MAIN SEARCH MARKETPLACE LANDING INTERFACE */}
      {currentPage === "landing" && (
        <div>
          <header className="py-5 text-white text-center" style={{
            background: "linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.9)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200') center/cover",
            padding: "90px 0"
          }}>
            <div className="container">
              <h1 className="fw-bold mb-4">Find Commercial, Residential, PGs & Hostels</h1>
              
              <div className="card shadow-lg p-4 mx-auto border-0 rounded-4 bg-white text-dark" style={{ maxWidth: '850px' }}>
                <div className="row g-2">
                  <div className="col-md-3">
                    <select className="form-select fw-semibold" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                      <option value="PG">PG (Paying Guest) 🏠</option>
                      <option value="Hostels">Hostels 🏢</option>
                      <option value="Commercial">Commercial Office</option>
                      <option value="Residential">Residential Flat</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Type city location (e.g. Noida, Gurugram, Delhi)..." value={citySearch} onChange={(e) => setCitySearch(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-primary w-100 fw-bold shadow-sm" style={{ backgroundColor: '#0056b3' }}>Search</button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="container py-5">
            <h3 className="fw-bold mb-4 text-dark text-start">Verified Micro-Living Options ({filteredProperties.length})</h3>
            <div className="row g-4">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <div className="col-md-4" key={property.id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                      <img src={property.image} className="card-img-top" alt="Property View" style={{ height: '200px', objectFit: 'cover' }} />
                      <div className="card-body p-4">
                        <span className="badge bg-warning text-dark mb-2 px-3 py-1 rounded-pill">{property.type}</span>
                        <h5 className="card-title fw-bold text-dark">{property.title}</h5>
                        <p className="card-text text-muted mb-2">📍 {property.locality}</p>
                        <p className="card-text text-secondary small">💡 **Facilities:** {property.facilities}</p>
                        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                          <span className="fs-5 fw-bold text-success">{property.priceDisplay}</span>
                          <button className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold">Contact Owner</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted fs-5">No active {propertyType} choices matching that city keyword. Try switching filters!</p>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* PAGE VIEW 2: DEDICATED ANTE-FRAUD LISTING FLOW */}
      {currentPage === "list-property-flow" && (
        <main className="container py-5">
          <div className="mx-auto" style={{ maxWidth: '550px' }}>
            <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
              
              {/* FLOW STEP NAVIGATION COUNTER BAR */}
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h4 className="fw-bold text-dark mb-0">List Your Property</h4>
                <span className="badge bg-dark text-white p-2">Step {listingStep} of 2</span>
              </div>

              {errorMsg && <div className="alert alert-danger p-2 small fw-semibold mb-3">{errorMsg}</div>}

              {/* STEP 1: MOBILE IDENTITY GATEWAY CHECK */}
              {listingStep === 1 && (
                <div>
                  <h5 className="fw-bold text-dark mb-2">🔐 Identity Verification Gate</h5>
                  <p className="text-muted small mb-4">To prevent fraud, spam bots, and fake listings, verification is mandatory via Mobile OTP.</p>
                  
                  {!otpSent ? (
                    <form onSubmit={sendOTP}>
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Enter Mobile Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">+91</span>
                          <input type="number" className="form-control" placeholder="9876543210" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary w-100 fw-bold rounded-pill">Request Security OTP</button>
                    </form>
                  ) : (
                    <form onSubmit={verifyOTP}>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-success">Enter 4-Digit Security OTP (Use pass code "1234")</label>
                        <input type="text" className="form-control text-center fs-4 letter-spacing-2" placeholder="••••" maxLength="4" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                      </div>
                      <button type="submit" className="btn btn-success w-100 fw-bold rounded-pill">Verify Credibility & Proceed</button>
                    </form>
                  )}
                </div>
              )}

              {/* STEP 2: CREDIBILITY PASSED -> SECURE INPUT FORM */}
              {listingStep === 2 && isHumanVerified && (
                <form onSubmit={submitFinalListing}>
                  <h5 className="fw-bold text-success mb-3">✓ Credibility Cleared. Enter Space Details</h5>
                  
                  <div className="mb-2">
                    <label className="form-label small fw-bold mb-1">Listing Name / Title</label>
                    <input type="text" className="form-control" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Luxury Girls AC PG Sharing Room" />
                  </div>

                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold mb-1">Target Category</label>
                      <select className="form-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                        <option value="PG">PG (Paying Guest)</option>
                        <option value="Hostels">Hostels</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Residential">Residential</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold mb-1">City</label>
                      <input type="text" className="form-control" required value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Noida" />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-bold mb-1">Monthly Cost Rate (INR)</label>
                    <input type="number" className="form-control" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 12000" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold mb-1">Facilities Provided</label>
                    <input type="text" className="form-control" required value={newFacilities} onChange={(e) => setNewFacilities(e.target.value)} placeholder="e.g. Wi-Fi, AC, Attached Bath, 3 Meals" />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold mb-1 text-primary">Upload Gallery Images (4-5 Photos Required, Min 1MB each)</label>
                    <input type="file" className="form-control" multiple accept="image/*" required onChange={handleImageChange} />
                  </div>

                  <button type="submit" className="btn btn-warning w-100 fw-bold rounded-pill text-dark shadow-sm">Publish Verified Listing</button>
                </form>
              )}

            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
