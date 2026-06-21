import React, { useState, useEffect } from 'react';

const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Luxury 3 BHK Residential Apartment",
    intent: "Rent",
    type: "Residential",
    subCategory: "Apartment",
    locality: "DLF Phase 3",
    city: "Gurugram",
    country: "India",
    priceDisplay: "₹65,000 / month",
    isVerified: true,
    mapAddress: "DLF Phase 3, Gurugram, Haryana, India",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
  },
  {
    id: 2,
    title: "Industrial Logistics Warehouse Space",
    intent: "Rent",
    type: "Commercial",
    subCategory: "Warehouse",
    locality: "Sector 62",
    city: "Noida",
    country: "India",
    priceDisplay: "₹1,85,000 / month",
    isVerified: true,
    mapAddress: "Sector 62, Noida, Uttar Pradesh, India",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600"
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  
  // Step Management Matrix: 1 = Baseline Initial, 2 = OTP Gateway, 3 = Create Account Modal, 4 = Listing Form
  const [listingStep, setListingStep] = useState(1);

  // Core App States
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  // Form Configuration States
  const [userProfile, setUserProfile] = useState("Owner"); 
  const [authMethod, setAuthMethod] = useState("Mobile");

  // UI State Components
  const [showMyActivityDropdown, setShowMyActivityDropdown] = useState(false);
  const [shortlistedList, setShortlistedList] = useState([]);

  // User Onboarding Input Fields
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  // New Account Fields (Matching image_17ca1f.png)
  const [fullName, setFullName] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  
  // Property Metadata Fields
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Residential");
  const [newSubCategory, setNewSubCategory] = useState("Apartment");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("India");
  const [newLocality, setNewLocality] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const countriesList = [...new Set(properties.map(p => p.country))];
    setAvailableCountries(countriesList);
  }, [properties]);

  useEffect(() => {
    const results = properties.filter(prop => {
      const matchesIntent = prop.intent === activeIntent;
      const matchesCountry = prop.country.toLowerCase() === selectedCountry.toLowerCase();
      const cleanQuery = keywordSearch.toLowerCase().trim();
      return prop.isVerified && matchesIntent && matchesCountry &&
        (cleanQuery === "" || prop.city.toLowerCase().includes(cleanQuery) || prop.locality.toLowerCase().includes(cleanQuery));
    });
    setFilteredProperties(results);
  }, [properties, activeIntent, selectedCountry, keywordSearch]);

  const toggleShortlistStatus = (property) => {
    if (shortlistedList.some(s => s.id === property.id)) {
      setShortlistedList(shortlistedList.filter(p => p.id !== property.id));
    } else {
      setShortlistedList([property, ...shortlistedList]);
    }
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (authMethod === "Mobile" && mobileNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (authMethod === "Email" && !emailAddress.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    setListingStep(2); 
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length === 4) {
      // Moves directly to the Create Account Profile Completer Step
      setListingStep(3); 
    } else {
      alert("Please enter a 4-digit code.");
    }
  };

  // Validates user profile completion variables
  const handleCreateAccountSubmit = (e) => {
    e.preventDefault();
    if (!termsAgreed) {
      setShowTermsError(true);
      return;
    }
    setShowTermsError(false);
    alert(`🎉 Profile created for ${fullName}! Moving to property placement form.`);
    setListingStep(4); // Unlocks the final listing data entry form
  };

  const submitFinalListing = (e) => {
    e.preventDefault();
    const createdItem = {
      id: properties.length + 1,
      title: newTitle,
      intent: activeIntent,
      type: newType,
      subCategory: newSubCategory,
      locality: newLocality || "Premium District",
      city: newCity,
      country: newCountry,
      priceDisplay: `${newCountry === 'India' ? '₹' : '$'}${parseInt(newPrice).toLocaleString()} / month`,
      isVerified: true,
      mapAddress: `${newLocality || 'Center'}, ${newCity}, ${newCountry}`,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
    };
    setProperties([...properties, createdItem]);
    alert("🎉 Listing published successfully live onto global grid nodes!");
    setCurrentPage("landing");
    setListingStep(1);
    setMobileNumber("");
    setEmailAddress("");
    setOtpCode("");
    setFullName("");
    setTermsAgreed(false);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }} onClick={() => setShowMyActivityDropdown(false)}>
      
      {/* BRAND HEADER NAVIGATION */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-3" style={{ backgroundColor: '#a81c1c' }}>
        <div className="container px-4">
          <span className="navbar-brand fs-3 fw-bold text-white me-5" onClick={() => { setCurrentPage("landing"); }} style={{ cursor: 'pointer' }}>
            Rent<span style={{color: '#D4AF37'}}>Office</span>Place
          </span>

          <div className="d-flex align-items-center me-auto">
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-6" onClick={() => { setCurrentPage("landing"); setActiveIntent("Buy"); }}>Buy ▾</button>
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-6" onClick={() => { setCurrentPage("landing"); setActiveIntent("Rent"); }}>Rent ▾</button>
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-6" onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); }}>Sell ▾</button>
          </div>

          <div className="d-flex align-items-center">
            <div className="position-relative" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="btn btn-link text-white text-decoration-none me-3 fw-semibold border border-white-50 rounded px-3 py-1" style={{ fontSize: '0.92rem' }} onClick={() => setShowMyActivityDropdown(!showMyActivityDropdown)}>
                👤 My Activity {showMyActivityDropdown ? '▲' : '▼'}
              </button>
              {showMyActivityDropdown && (
                <div className="card shadow-lg border-0 py-2 position-absolute bg-white rounded-3 mt-2 text-start" style={{ right: '15px', width: '220px', zIndex: 2000 }}>
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small" onClick={() => { setCurrentPage("landing"); setShowMyActivityDropdown(false); }}>❤️ Shortlisted ({shortlistedList.length})</button>
                  <div className="p-2 border-top mt-2"><button className="btn btn-sm btn-success w-100 fw-bold rounded" onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); setShowMyActivityDropdown(false); }}>Post Property FREE</button></div>
                </div>
              )}
            </div>
            <button className="btn fw-bold px-3 py-1 rounded-3" style={{ backgroundColor: '#d4af37', color: '#1a1a1a', border: 'none' }} onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); }}>Post Property <span className="badge bg-dark text-warning ms-1 small">FREE</span></button>
          </div>
        </div>
      </nav>

      {/* PREMIUM SPLIT SCREEN HERO ONBOARDING ENGINE */}
      {currentPage === "list-property-flow" && (
        <div className="container py-5">
          <div className="row align-items-center g-5">
            
            {/* LEFT COLUMN: BRAND MARKETING */}
            <div className="col-lg-6 text-start d-none d-lg-block">
              <h1 className="fw-bold text-dark display-4 mb-3" style={{ lineHeight: '1.2' }}>
                Post your property Ad to sell or rent online for <span className="text-success">Free!</span>
              </h1>
              <p className="fs-5 text-muted mb-4">Join thousands of verified owners closing premium global real estate placements daily.</p>
              
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <span className="bg-white shadow-sm p-2 rounded-circle fs-4">✓</span>
                  <div><strong className="text-dark d-block">Verified High-Trust Marketplace Profiles</strong><span className="text-muted small">Ensuring end-to-end transparency across real estate listing logs.</span></div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="bg-white shadow-sm p-2 rounded-circle fs-4">✓</span>
                  <div><strong className="text-dark d-block">Dynamic Map Routing Nodes</strong><span className="text-muted small">Customers see instant directions from their exact location to your space.</span></div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DYNAMIC ONBOARDING COMPONENT INTERFACE CARD */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg p-4 bg-white rounded-4 text-start mx-auto" style={{ maxWidth: '440px' }}>
                
                {/* STAGE 1: ACCOUNT INTENT DEFINITION */}
                {listingStep === 1 && (
                  <form onSubmit={handleInitialSubmit}>
                    <h3 className="fw-bold text-dark mb-1">Let's get you started</h3>
                    <p className="text-muted small mb-4">Add your baseline parameters to post property items online for free.</p>
                    
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">You are:</label>
                      <div className="d-flex gap-2">
                        {["Owner", "Agent", "Builder"].map(profile => (
                          <button key={profile} type="button" className={`btn rounded-pill px-4 py-2 small fw-semibold transition-all ${userProfile === profile ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setUserProfile(profile)}>
                            {profile}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary">You are here to:</label>
                      <div className="d-flex gap-2">
                        {["Rent", "Buy", "PG"].map(intentOption => (
                          <button key={intentOption} type="button" className={`btn rounded-pill px-3 py-2 small fw-semibold ${activeIntent === intentOption ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setActiveIntent(intentOption)}>
                            {intentOption === 'Rent' ? 'Rent / Lease' : intentOption === 'Buy' ? 'Sell Property' : 'List as PG'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {authMethod === "Mobile" ? (
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary">Your contact number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light text-dark fw-bold border-end-0">IND +91</span>
                          <input type="number" className="form-control py-2 ps-3 border-start-0" placeholder="WhatsApp Number" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                        </div>
                        <div className="text-end mt-2">
                          <button type="button" className="btn btn-link p-0 small text-primary text-decoration-none fw-semibold" onClick={() => setAuthMethod("Email")}>
                            ✉ Login with Email instead
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary">Your email address</label>
                        <input type="email" className="form-control py-2 ps-3" placeholder="name@example.com" required value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                        <div className="text-end mt-2">
                          <button type="button" className="btn btn-link p-0 small text-primary text-decoration-none fw-semibold" onClick={() => setAuthMethod("Mobile")}>
                            📱 Login with Mobile Number instead
                          </button>
                        </div>
                      </div>
                    )}

                    <button type="submit" className="btn btn-danger w-100 fw-bold py-3 fs-5 rounded-3 shadow mt-2" style={{ backgroundColor: '#df2020', border: 'none' }}>
                      Start Now →
                    </button>
                  </form>
                )}

                {/* STAGE 2: OTP SECURITY CHALLENGE MODULE */}
                {listingStep === 2 && (
                  <form onSubmit={handleVerifyOtp}>
                    <h3 className="fw-bold text-dark mb-1">Verify your identity</h3>
                    <p className="text-muted small mb-4">We have sent a 4-digit verification code to <strong className="text-dark">{authMethod === "Mobile" ? `+91 ${mobileNumber}` : emailAddress}</strong></p>

                    <div className="mb-4">
                      <input type="text" maxLength="4" className="form-control text-center fw-bold fs-3 mx-auto" style={{ maxWidth: '160px', letterSpacing: '6px' }} placeholder="0000" required value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} />
                    </div>

                    <button type="submit" className="btn btn-success w-100 fw-bold py-3 fs-6 rounded-3 shadow-sm mb-3">Verify & Continue ✓</button>
                  </form>
                )}

                {/* STAGE 3: ACCOUNT CREATION INTERFACE PANEL (MATCHES IMAGE_17CA1F) */}
                {listingStep === 3 && (
                  <form onSubmit={handleCreateAccountSubmit}>
                    <h3 className="fw-bold text-dark mb-3 fs-4">Create Account</h3>
                    
                    {/* User Profile Selector (Owner / Broker Toggle Match) */}
                    <div className="mb-3">
                      <label className="form-label small text-muted mb-1">You are</label>
                      <div className="d-flex gap-2">
                        <button type="button" className={`btn rounded-pill px-4 py-1 fw-semibold ${userProfile === 'Owner' ? 'btn-outline-dark bg-dark text-white' : 'btn-outline-secondary'}`} onClick={() => setUserProfile('Owner')}>Owner</button>
                        <button type="button" className={`btn rounded-pill px-4 py-1 fw-semibold ${userProfile === 'Broker' ? 'btn-outline-primary bg-light' : 'btn-outline-secondary'}`} onClick={() => setUserProfile('Broker')}>Broker</button>
                      </div>
                    </div>

                    {/* Name Input field */}
                    <div className="mb-3">
                      <input type="text" className="form-control py-2 text-muted" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>

                    {/* Locked Contact Block Field */}
                    <div className="mb-2">
                      <label className="form-label p-0 m-0 text-muted" style={{ fontSize: '0.75rem' }}>Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-muted border-end-0 small">+91 ▾</span>
                        <input type="text" className="form-control bg-light text-muted border-start-0" disabled value={mobileNumber || "7905635297"} />
                        <span className="input-group-text bg-light text-muted border-start-0">🔒</span>
                      </div>
                      <button type="button" className="btn btn-link p-0 small text-decoration-none mt-1" style={{ fontSize: '0.82rem' }} onClick={() => setListingStep(1)}>Change Number ⓘ</button>
                    </div>

                    {/* Secondary Email Verification Block field */}
                    <div className="mb-3">
                      <input type="email" className="form-control py-2 text-muted" placeholder="Email Id" required value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                    </div>

                    {/* Terms Checklist Match Group */}
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" id="termsCheck" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} />
                      <label className="form-check-label text-muted" htmlFor="termsCheck" style={{ fontSize: '0.78rem' }}>
                        I agree to the <span className="text-primary">Terms & Conditions</span> and <span className="text-primary">Privacy Policy</span>
                      </label>
                      {showTermsError && (
                        <div className="text-danger mt-1 small fw-bold" style={{ fontSize: '0.78rem' }}>
                          ⚠️ This is required for creating an account
                        </div>
                      )}
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 fs-5 rounded-3 shadow-sm" style={{ backgroundColor: '#7bb7f1', border: 'none' }}>
                      Create Account
                    </button>
                  </form>
                )}

                {/* STAGE 4: MAIN LISTING PROPERTY ATTRIBUTES DETAILS METADATA FORM */}
                {listingStep === 4 && (
                  <form onSubmit={submitFinalListing}>
                    <h4 className="fw-bold text-success mb-3">✓ Account Active. Add Property Specifications</h4>
                    
                    <div className="mb-2"><label className="form-label small fw-bold mb-1">Property Listing Title</label><input type="text" className="form-control" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Modern Office Workshop Suite" /></div>
                    
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label small fw-bold mb-1">Category</label>
                        <select className="form-select" value={newType} onChange={(e) => { setNewType(e.target.value); setNewSubCategory(e.target.value === 'Commercial' ? 'Warehouse' : 'Apartment'); }}>
                          <option value="Residential">Residential</option><option value="Commercial">Commercial</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold mb-1">Sub-Type</label>
                        {newType === 'Commercial' ? (
                          <select className="form-select" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
                            <option value="Warehouse">Warehouse 📦</option><option value="Office">Office Space 🏢</option><option value="Shop">Shop Suite 🛍️</option>
                          </select>
                        ) : (
                          <select className="form-select" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
                            <option value="Apartment">Apartment Flat</option><option value="Villa">Independent Villa</option>
                          </select>
                        )}
                      </div>
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-6"><label className="form-label small fw-bold mb-1">Target Country</label><input type="text" className="form-control" required value={newCountry} onChange={(e) => setNewCountry(e.target.value)} placeholder="e.g. India" /></div>
                      <div className="col-6"><label className="form-label small fw-bold mb-1">City Name</label><input type="text" className="form-control" required value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Noida" /></div>
                    </div>

                    <div className="row g-2 mb-4">
                      <div className="col-6"><label className="form-label small fw-bold mb-1">Locality Sector</label><input type="text" className="form-control" required value={newLocality} onChange={(e) => setNewLocality(e.target.value)} placeholder="e.g. Sector 62" /></div>
                      <div className="col-6"><label className="form-label small fw-bold mb-1">Monthly Valuation</label><input type="number" className="form-control" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 55000" /></div>
                    </div>

                    <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-pill shadow-sm">
                      Publish Listing On Marketplace
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

      {/* MAIN EXPLORATION MARKETPLACE REPO DISPLAY GRID */}
      {currentPage === "landing" && (
        <div>
          <header className="py-5 text-white text-center" style={{ background: "linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.9)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200') center/cover", padding: "75px 0" }}>
            <div className="container">
              <h1 className="fw-bold mb-4">Global Real Estate Search Console</h1>
              <div className="card shadow-lg p-4 mx-auto border-0 rounded-4 bg-white text-dark" style={{ maxWidth: '850px' }}>
                <div className="row g-2">
                  <div className="col-md-3">
                    <select className="form-select fw-semibold" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                      {availableCountries.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6"><input type="text" className="form-control" placeholder="Search city or sub-locality..." value={keywordSearch} onChange={(e) => setKeywordSearch(e.target.value)} /></div>
                  <div className="col-md-3"><button className="btn btn-primary w-100 fw-bold shadow-sm" style={{ backgroundColor: '#0056b3' }}>Search</button></div>
                </div>
              </div>
            </div>
          </header>

          <main className="container py-5">
            <h3 className="fw-bold mb-4 text-dark text-start">Available Properties ({filteredProperties.length})</h3>
            <div className="row g-4">
              {filteredProperties.map(property => (
                <div className="col-md-4" key={property.id}>
                  <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white position-relative">
                    <button type="button" className="btn position-absolute top-0 end-0 m-3 rounded-circle shadow p-2 bg-white" style={{ zIndex: 10, border: 'none' }} onClick={() => toggleShortlistStatus(property)}>
                      {shortlistedList.some(s => s.id === property.id) ? '❤️' : '🤍'}
                    </button>
                    <img src={property.image} className="card-img-top" alt="" style={{ height: '200px', objectFit: 'cover' }} />
                    <div className="card-body p-4 text-start">
                      <span className="badge bg-dark text-warning mb-2 px-3 py-1 rounded-pill">{property.type}</span>
                      <h5 className="card-title fw-bold text-dark mb-1">{property.title}</h5>
                      <p className="card-text text-muted small mb-3">📍 {property.locality}, {property.city}</p>
                      <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
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

    </div>
  );
}

export default App;
