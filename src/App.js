import React, { useState, useEffect } from 'react';

const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Luxury 3 BHK Residential Apartment",
    intent: "Rent",
    type: "Residential",
    subCategory: "Apartment Flat",
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
  },
  {
    id: 3,
    title: "Premium Furnished Office Workshop Suite",
    intent: "Buy",
    type: "Commercial",
    subCategory: "Office Space",
    locality: "Sector 62",
    city: "Noida",
    country: "India",
    priceDisplay: "₹75,00,000",
    isVerified: true,
    mapAddress: "Sector 62, Noida, India",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600"
  }
];

const CITY_SUGGESTIONS = ["Ghaziabad", "Ghazipur", "Ghatal", "North Goa", "South Goa", "Gurugram", "Noida", "Delhi"];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [listingStep, setListingStep] = useState(1);

  // Intent states: "Rent" or "Buy" (matching your homepage data taxonomy)
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  const [userProfile, setUserProfile] = useState("Owner"); 
  const [authMethod, setAuthMethod] = useState("Mobile");

  const [showMyActivityDropdown, setShowMyActivityDropdown] = useState(false);
  const [shortlistedList, setShortlistedList] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // User input fields
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  
  // Property attributes fields (Matches image_174f1c.png inputs)
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Residential");
  const [newSubCategory, setNewSubCategory] = useState("Apartment Flat");
  const [newCountry, setNewCountry] = useState("India");
  const [newCity, setNewCity] = useState("");
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
    if (mobileNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setListingStep(2); 
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode === "1234" || otpCode.length === 4) {
      setListingStep(3); 
    } else {
      alert("Invalid code. Please use `1234` for testing.");
    }
  };

  const handleCreateAccountSubmit = (e) => {
    e.preventDefault();
    if (!termsAgreed) {
      setShowTermsError(true);
      return;
    }
    setShowTermsError(false);
    setListingStep(4); 
  };

  const filteredCities = CITY_SUGGESTIONS.filter(c => c.toLowerCase().includes(newCity.toLowerCase()));

  const submitFinalListing = (e) => {
    e.preventDefault();
    const createdItem = {
      id: properties.length + 1,
      title: newTitle,
      intent: activeIntent,
      type: newType,
      subCategory: newSubCategory,
      locality: newLocality,
      city: newCity,
      country: newCountry,
      priceDisplay: `${newCountry === 'India' ? '₹' : '$'}${parseInt(newPrice).toLocaleString()} ${activeIntent === 'Rent' ? '/ month' : ''}`,
      isVerified: true,
      mapAddress: `${newLocality}, ${newCity}, ${newCountry}`,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
    };
    setProperties([...properties, createdItem]);
    alert("🎉 Listing published successfully on the marketplace!");
    setCurrentPage("landing");
    setListingStep(1);
    setMobileNumber(""); setEmailAddress(""); setOtpCode(""); setFullName(""); setTermsAgreed(false);
    setNewTitle(""); setNewCity(""); setNewLocality(""); setNewPrice("");
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }} onClick={() => { setShowCityDropdown(false); setShowMyActivityDropdown(false); }}>
      
      {/* MATCHED BRANDING HEADER & QUICK SHORTCUT LINKS FROM IMAGE_174F1C.PNG */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-3" style={{ backgroundColor: '#a81c1c' }}>
        <div className="container px-4">
          <span className="navbar-brand fs-3 fw-bold text-white me-5" onClick={() => { setCurrentPage("landing"); }} style={{ cursor: 'pointer' }}>
            Rent<span style={{color: '#D4AF37'}}>Office</span>Place
          </span>

          {/* DYNAMIC SHORTCUT NAVIGATION LINKS */}
          <div className="d-flex align-items-center me-auto">
            <button className={`btn btn-link text-white fw-bold text-decoration-none px-3 fs-5 ${activeIntent === 'Buy' && currentPage === 'landing' ? 'border-bottom border-2 border-warning' : ''}`} 
                    onClick={() => { setCurrentPage("landing"); setActiveIntent("Buy"); }}>
              Buy ▾
            </button>
            <button className={`btn btn-link text-white fw-bold text-decoration-none px-3 fs-5 ${activeIntent === 'Rent' && currentPage === 'landing' ? 'border-bottom border-2 border-warning' : ''}`} 
                    onClick={() => { setCurrentPage("landing"); setActiveIntent("Rent"); }}>
              Rent ▾
            </button>
            <button className={`btn btn-link text-white fw-bold text-decoration-none px-3 fs-5 ${currentPage === 'list-property-flow' ? 'border-bottom border-2 border-warning' : ''}`} 
                    onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); }}>
              Sell ▾
            </button>
          </div>

          {/* MY ACTIVITY DROPDOWN AND FREE BUTTON LAYOUT */}
          <div className="d-flex align-items-center">
            <div className="position-relative" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="btn btn-link text-white text-decoration-none me-3 fw-semibold border border-white-50 rounded-3 px-3 py-1.5" style={{ fontSize: '0.95rem' }} onClick={() => setShowMyActivityDropdown(!showMyActivityDropdown)}>
                👤 My Activity ▼
              </button>
              {showMyActivityDropdown && (
                <div className="card shadow-lg border-0 py-2 position-absolute bg-white rounded-3 mt-2 text-start" style={{ right: '15px', width: '220px', zIndex: 2000 }}>
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small" onClick={() => { setCurrentPage("landing"); setShowMyActivityDropdown(false); }}>❤️ Shortlisted ({shortlistedList.length})</button>
                  <div className="p-2 border-top mt-2">
                    <button className="btn btn-sm btn-success w-100 fw-bold rounded" onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); setShowMyActivityDropdown(false); }}>Post Property FREE</button>
                  </div>
                </div>
              )}
            </div>
            <button className="btn fw-bold px-3 py-1.5 rounded-3" style={{ backgroundColor: '#d4af37', color: '#1a1a1a', border: 'none' }} onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); }}>
              Post Property <span className="badge bg-dark text-warning ms-1 small">FREE</span>
            </button>
          </div>
        </div>
      </nav>

      {/* VIEW LAYER 1: ONBOARDING FLOW PANEL FRAMEWORK */}
      {currentPage === "list-property-flow" && (
        <div className="container py-5">
          <div className="row align-items-center g-5">
            
            {/* LEFT VALUE PROPOSITIONS PANEL */}
            <div className="col-lg-6 text-start">
              <h1 className="fw-bold text-dark display-4 mb-3" style={{ lineHeight: '1.2' }}>
                Post your property Ad to sell or rent online for <span className="text-success">Free!</span>
              </h1>
              <p className="fs-5 text-muted mb-4">Join thousands of verified owners closing premium global real estate placements daily.</p>
              
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <span className="bg-white shadow-sm p-2 rounded-circle fs-5 border">✓</span>
                  <div><strong className="text-dark d-block">Verified High-Trust Marketplace Profiles</strong><span className="text-muted small">Ensuring end-to-end transparency across real estate listing logs.</span></div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <span className="bg-white shadow-sm p-2 rounded-circle fs-5 border">✓</span>
                  <div><strong className="text-dark d-block">Dynamic Map Routing Nodes</strong><span className="text-muted small">Customers see instant directions from their exact location to your space.</span></div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR ONBOARDING CONFIGURATION PANEL */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg p-4 bg-white rounded-4 text-start mx-auto" style={{ maxWidth: '480px' }}>
                
                {listingStep === 1 && (
                  <form onSubmit={handleInitialSubmit}>
                    <h3 className="fw-bold text-dark mb-1">Let's get you started</h3>
                    <p className="text-muted small mb-4">Add your baseline parameters to post property items online for free.</p>
                    
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">You are:</label>
                      <div className="d-flex gap-2">
                        {["Owner", "Agent", "Builder"].map(profile => (
                          <button key={profile} type="button" className={`btn rounded-pill px-4 py-1.5 small fw-semibold ${userProfile === profile ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setUserProfile(profile)}>{profile}</button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary">You are here to:</label>
                      <div className="d-flex gap-2">
                        {["Rent", "Buy"].map(intentOption => (
                          <button key={intentOption} type="button" className={`btn rounded-pill px-4 py-1.5 small fw-semibold ${activeIntent === intentOption ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setActiveIntent(intentOption)}>{intentOption === 'Rent' ? 'Rent / Lease' : 'Sell Property'}</button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">Your contact number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-dark fw-bold border-end-0">IND +91</span>
                        <input type="number" className="form-control py-2 border-start-0" placeholder="WhatsApp Number" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-danger w-100 fw-bold py-2.5 fs-5 rounded-3 shadow mt-2" style={{ backgroundColor: '#df2020', border: 'none' }}>Start Now →</button>
                  </form>
                )}

                {listingStep === 2 && (
                  <form onSubmit={handleVerifyOtp}>
                    <h3 className="fw-bold text-dark mb-1">Verify identity</h3>
                    <p className="text-muted small mb-4">Enter verification security key text code sent to <strong className="text-dark">+91 {mobileNumber}</strong></p>
                    <div className="mb-4">
                      <input type="text" maxLength="4" className="form-control text-center fw-bold fs-3 mx-auto" style={{ maxWidth: '160px', letterSpacing: '6px' }} placeholder="0000" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-success w-100 fw-bold py-2.5 rounded-3 shadow-sm">Verify Code</button>
                  </form>
                )}

                {listingStep === 3 && (
                  <form onSubmit={handleCreateAccountSubmit}>
                    <h3 className="fw-bold text-dark mb-3 fs-4">Create Account</h3>
                    <div className="mb-3">
                      <input type="text" className="form-control py-2" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <input type="email" className="form-control py-2" placeholder="Email Id" required value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" id="termsCheck" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} />
                      <label className="form-check-label text-muted small" htmlFor="termsCheck">
                        I agree to the <span className="text-primary">Terms & Conditions</span> and <span className="text-primary">Privacy Policy</span>
                      </label>
                      {showTermsError && <div className="text-danger mt-1 small fw-bold">⚠️ Agreement confirmation is required.</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 rounded-3 shadow-sm" style={{ backgroundColor: '#0056b3' }}>Create Account</button>
                  </form>
                )}

                {/* STAGE 4: MAIN PROPERTY SPECIFICATION MANAGEMENT DATA VIEW */}
                {listingStep === 4 && (
                  <form onSubmit={submitFinalListing}>
                    <h4 className="fw-bold text-success mb-3 fs-5" style={{ color: '#198754' }}>✓ Account Active. Add Property Specifications</h4>
                    
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary mb-1">Property Listing Title</label>
                      <input type="text" className="form-control py-2" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Modern Office Workshop Suite" />
                    </div>
                    
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-secondary mb-1">Category</label>
                        <select className="form-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-secondary mb-1">Sub-Type</label>
                        <select className="form-select" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
                          <option value="Apartment Flat">Apartment Flat</option>
                          <option value="Independent Villa">Independent Villa</option>
                          <option value="Office Space">Office Space</option>
                          <option value="Warehouse">Warehouse</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mb-3" onClick={(e) => e.stopPropagation()}>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-secondary mb-1">Target Country</label>
                        <input type="text" className="form-control py-2" required value={newCountry} onChange={(e) => setNewCountry(e.target.value)} />
                      </div>
                      <div className="col-6 position-relative">
                        <label className="form-label small fw-bold text-secondary mb-1">City Name</label>
                        <input type="text" className="form-control py-2" required value={newCity} onChange={(e) => { setNewCity(e.target.value); setShowCityDropdown(true); }} placeholder="e.g. Noida" />
                        {showCityDropdown && newCity.length > 1 && (
                          <div className="card shadow position-absolute bg-white rounded-3 w-100 mt-1 border-0" style={{ zIndex: 3000, left: 0 }}>
                            {filteredCities.map((city, idx) => (
                              <div key={idx} className="p-2 small text-dark border-bottom" style={{ cursor: 'pointer' }} onClick={() => { setNewCity(city); setShowCityDropdown(false); }}>{city}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-secondary mb-1">Locality Sector</label>
                        <input type="text" className="form-control py-2" required value={newLocality} onChange={(e) => setNewLocality(e.target.value)} placeholder="e.g. Sector 62" />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-secondary mb-1">Monthly Valuation</label>
                        <input type="number" className="form-control py-2" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 55000" />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-success w-100 fw-bold py-2.5 rounded-3 shadow-sm text-white" style={{ backgroundColor: '#198754', border: 'none' }}>
                      Publish Listing On Marketplace
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW LAYER 2: GLOBAL SEARCH REGISTRY DISCOVERY SCREEN */}
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
                  <div className="col-md-3"><button className="btn btn-primary w-100 fw-bold shadow-sm" style={{ backgroundColor: '#a81c1c', border: 'none' }}>Search</button></div>
                </div>
              </div>
            </div>
          </header>

          <main className="container py-5">
            <h3 className="fw-bold mb-4 text-dark text-start">Available Properties For {activeIntent === 'Buy' ? 'Sale' : 'Rent'} ({filteredProperties.length})</h3>
            <div className="row g-4">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <div className="col-md-4" key={property.id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white text-start">
                      <img src={property.image} className="card-img-top" alt="" style={{ height: '200px', objectFit: 'cover' }} />
                      <div className="card-body p-4">
                        <span className="badge text-warning mb-2 px-3 py-1 rounded-pill" style={{ backgroundColor: '#1a1a1a' }}>{property.type}</span>
                        <h5 className="card-title fw-bold text-dark mb-1">{property.title}</h5>
                        <p className="card-text text-muted small mb-3">📍 {property.locality}, {property.city}</p>
                        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
                          <span className="fs-5 fw-bold text-success">{property.priceDisplay}</span>
                          <button className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold">Contact Owner</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 py-5 text-center text-muted">
                  <h5>No properties matching your specific selection filters are listed yet.</h5>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

    </div>
  );
}

export default App;
