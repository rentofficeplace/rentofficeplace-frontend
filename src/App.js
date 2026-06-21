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

// High-fidelity dynamic location dataset matching user screenshots
const CITY_SUGGESTIONS = ["Ghaziabad", "Ghazipur", "Ghatal", "North Goa", "South Goa", "Gurugram", "Noida", "Delhi"];

const SOCIETY_SUGGESTIONS = [
  "Panchsheel Prime 390, Govind Puram, Ghaziabad",
  "Panchsheel Primrose, Avantika Colony, Ghaziabad",
  "Panchsheel Premium 24, Dasna, Ghaziabad",
  "Panchsheel Pratishtha, Sector 75, Noida"
];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [listingStep, setListingStep] = useState(1);
  const [formSubStep, setFormSubStep] = useState(1); 

  // Core App Content States
  const [activeIntent, setActiveIntent] = useState("Sell");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  // UI Dropdown States
  const [showMyActivityDropdown, setShowMyActivityDropdown] = useState(false);
  const [shortlistedList, setShortlistedList] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showSocietyDropdown, setShowSocietyDropdown] = useState(false);

  // Identity inputs
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  // Property Metadata States
  const [propertyType, setPropertyType] = useState("Residential"); 
  const [subCategory, setSubCategory] = useState("Flat/Apartment");
  
  // STEP 2 PROGRESSIVE INPUT STATES (Matches images perfectly)
  const [newCity, setNewCity] = useState("");
  const [newLocality, setNewLocality] = useState("");
  const [newSubLocality, setNewSubLocality] = useState("");
  const [newSociety, setNewSociety] = useState("");

  // STEP 3 PROPERTY PROFILE STATES (For next screen)
  const [newTitle, setNewTitle] = useState("");
  const [bhkCount, setBhkCount] = useState("3 BHK");
  const [furnishingStatus, setFurnishingStatus] = useState("Unfurnished");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const countriesList = [...new Set(properties.map(p => p.country))];
    setAvailableCountries(countriesList);
  }, [properties]);

  useEffect(() => {
    const results = properties.filter(prop => {
      const matchIntent = activeIntent === "Sell" ? "Buy" : activeIntent;
      const matchesCountry = prop.country.toLowerCase() === selectedCountry.toLowerCase();
      const cleanQuery = keywordSearch.toLowerCase().trim();
      return prop.isVerified && matchesCountry &&
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

  // Autocomplete filtering computation
  const filteredCities = CITY_SUGGESTIONS.filter(c => c.toLowerCase().includes(newCity.toLowerCase()));
  const filteredSocieties = SOCIETY_SUGGESTIONS.filter(s => s.toLowerCase().includes(newSociety.toLowerCase()));

  // Dynamic Score Calculator based on form complete parameters
  const calculatePropertyScore = () => {
    if (formSubStep === 1) return "13%";
    if (formSubStep === 2) {
      return newSociety ? "23%" : "13%";
    }
    if (formSubStep === 3) return "45%";
    if (formSubStep === 4) return "70%"
    return "95%";
  };

  const submitFinalListing = (e) => {
    e.preventDefault();
    const createdItem = {
      id: properties.length + 1,
      title: newTitle || `${bhkCount} ${subCategory} in ${newSociety || newLocality || 'Premium Area'}`,
      intent: activeIntent === "Sell" ? "Buy" : activeIntent,
      type: propertyType,
      subCategory: subCategory,
      locality: newLocality || "Premium Sector",
      city: newCity || "Ghaziabad",
      country: "India",
      priceDisplay: `₹${parseInt(newPrice || '45000').toLocaleString()} ${activeIntent === 'Sell' ? '' : '/ month'}`,
      isVerified: true,
      mapAddress: `${newSociety || newLocality}, ${newCity}, India`,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
    };
    setProperties([...properties, createdItem]);
    alert("🎉 Global real estate listing successfully verified and posted to database!");
    setCurrentPage("landing");
    setListingStep(1);
    setFormSubStep(1);
    setMobileNumber(""); setOtpCode(""); setNewCity(""); setNewLocality(""); setNewSubLocality(""); setNewSociety(""); setNewTitle(""); setNewPrice("");
  };

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }} onClick={() => { setShowCityDropdown(false); setShowSocietyDropdown(false); setShowMyActivityDropdown(false); }}>
      
      {/* BRAND TOP NAVIGATION BAR */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-3" style={{ backgroundColor: '#0056b3' }}>
        <div className="container px-4">
          <span className="navbar-brand fs-3 fw-bold text-white me-5" onClick={() => { setCurrentPage("landing"); }} style={{ cursor: 'pointer' }}>
            99acres<span className="fs-6 text-muted ms-2 text-white-50">clone</span>
          </span>
          <div className="d-flex align-items-center">
            <button className="btn fw-bold px-4 py-2 rounded-3 text-white border border-white-50" onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); }}>Post Property FREE</button>
          </div>
        </div>
      </nav>

      {/* PHASE 1: GATEWAY LAYER ACCESSIBILITY */}
      {currentPage === "list-property-flow" && listingStep < 3 && (
        <div className="container py-5 text-start" style={{ maxWidth: '480px' }}>
          <div className="card p-4 border-0 shadow-lg bg-white rounded-4">
            {listingStep === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); setListingStep(2); }}>
                <h3 className="fw-bold text-dark mb-3">Post Property Online</h3>
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">Enter Mobile Number</label>
                  <input type="number" className="form-control py-2 ps-3" placeholder="7905635297" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Start Now →</button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setListingStep(3); setFormSubStep(1); }}>
                <h4 className="fw-bold text-dark mb-2">Verify OTP</h4>
                <p className="text-muted small">Enter testing code `1234` below</p>
                <input type="text" maxLength="4" className="form-control text-center fw-bold fs-3 mb-4 mx-auto" style={{ maxWidth: '150px' }} placeholder="0000" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                <button type="submit" className="btn btn-success w-100 py-2 fw-bold">Verify Code</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2: PROGRESSIVE MULTISTEP INTERACTIVE WIZARD */}
      {currentPage === "list-property-flow" && listingStep === 3 && (
        <div className="container-fluid py-4 px-md-5">
          <div className="row g-4">
            
            {/* LEFT COLUMN: VISUAL STEP SCOREBOARD PROGRESS TIMELINE */}
            <div className="col-lg-3 text-start">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex flex-column gap-4 position-relative">
                  {[
                    { step: 1, label: "Basic Details", info: `${subCategory} for ${activeIntent}` },
                    { step: 2, label: "Location Details", info: newCity ? `${newCity}, ${newLocality || ''}` : "Step 2" },
                    { step: 3, label: "Property Profile", info: "Step 3" },
                    { step: 4, label: "Photos, Videos & Voice-over", info: "Step 4" },
                    { step: 5, label: "Pricing & Others", info: "Step 5" }
                  ].map((item) => (
                    <div key={item.step} className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" 
                           style={{ 
                             width: '32px', height: '32px', 
                             backgroundColor: formSubStep === item.step ? '#0056b3' : formSubStep > item.step ? '#198754' : '#ced4da',
                             fontSize: '0.85rem'
                           }}>
                        {formSubStep > item.step ? '✓' : item.step}
                      </div>
                      <div>
                        <span className={`d-block small fw-bold ${formSubStep === item.step ? 'text-dark' : 'text-muted'}`}>{item.label}</span>
                        <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                          {item.step === 1 && formSubStep > 1 ? (
                            <span>{item.info} <span className="text-primary fw-semibold ms-1" style={{cursor: 'pointer'}} onClick={() => setFormSubStep(1)}>Edit</span></span>
                          ) : item.step === formSubStep ? 'Active' : `Step ${item.step}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score Widget Card Matrix */}
                <div className="border-top pt-4 mt-5 d-flex align-items-center gap-3">
                  <div className="position-relative d-inline-block text-center">
                    <div className="fw-bold fs-4 text-success p-2 bg-light rounded-circle border d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', fontSize: '1rem' }}>
                      {calculatePropertyScore()}
                    </div>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Property Score</h6>
                    <p className="text-muted small mb-0">Better your property score, greater your visibility</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN: CONTENT DISPLAY MANAGER CONTAINER */}
            <div className="col-lg-6 text-start">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-4 min-vh-50">
                
                <div className="mb-3">
                  <button type="button" className="btn btn-link text-muted text-decoration-none p-0 small fw-semibold" onClick={() => setFormSubStep(formSubStep > 1 ? formSubStep - 1 : 1)}>
                    ← Back
                  </button>
                </div>

                {/* SUB-STEP 1: INITIAL CORE CATEGORIZATION SETUP */}
                {formSubStep === 1 && (
                  <div>
                    <h2 className="fw-bold text-dark fs-3 mb-1">Welcome back User,</h2>
                    <p className="text-muted fs-5 mb-4">Fill out basic details</p>
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary d-block mb-2">I'm looking to</label>
                      <div className="d-flex gap-2">
                        {["Sell", "Rent / Lease", "PG"].map((opt) => (
                          <button key={opt} type="button" className={`btn rounded-pill px-4 py-2 small fw-semibold ${activeIntent === opt ? 'btn-primary shadow-sm' : 'btn-outline-secondary'}`} onClick={() => setActiveIntent(opt)}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary d-block mb-2">Property Classification Kind</label>
                      <div className="d-flex gap-4 mb-3">
                        <label className="fw-semibold"><input type="radio" checked={propertyType === "Residential"} className="form-check-input me-2" onChange={() => setPropertyType("Residential")} /> Residential</label>
                        <label className="fw-semibold"><input type="radio" checked={propertyType === "Commercial"} className="form-check-input me-2" onChange={() => setPropertyType("Commercial")} /> Commercial</label>
                      </div>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {["Flat/Apartment", "Independent House / Villa", "Independent / Builder Floor", "Plot / Land"].map((cat) => (
                          <button key={cat} type="button" className={`btn rounded-pill px-3 py-2 small ${subCategory === cat ? 'btn-outline-primary bg-light fw-bold' : 'btn-outline-secondary text-muted'}`} onClick={() => setSubCategory(cat)}>{cat}</button>
                        ))}
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary fw-bold px-5 py-2.5 mt-3 rounded-3 text-white fs-6" onClick={() => setFormSubStep(2)}>Continue</button>
                  </div>
                )}

                {/* SUB-STEP 2: PROGRESSIVE LOCATION DISCOVERY ELEMENT (MATCHES IMAGE_17AD10 & IMAGE_17AC7D) */}
                {formSubStep === 2 && (
                  <div>
                    <h2 className="fw-bold text-dark fs-3 mb-1">Where is your property located?</h2>
                    <p className="text-muted mb-4 small fs-6">An accurate location helps you connect with the right buyers</p>

                    {/* CITY INPUT WITH CUSTOM AUTOCOMPLETE POPUP PANEL */}
                    <div className="mb-3 position-relative" onClick={(e) => e.stopPropagation()}>
                      <label className="form-label text-secondary small p-0 m-0 fw-bold">City</label>
                      <input 
                        type="text" 
                        className="form-control py-2.5 shadow-sm"
                        placeholder="Type City Name (e.g., Gha...)" 
                        value={newCity}
                        onChange={(e) => { setNewCity(e.target.value); setShowCityDropdown(true); }}
                        onFocus={() => setShowCityDropdown(true)}
                      />
                      {showCityDropdown && filteredCities.length > 0 && (
                        <div className="card shadow position-absolute bg-white rounded-3 w-100 mt-1 border-0" style={{ zIndex: 3000 }}>
                          {filteredCities.map((city, idx) => (
                            <div key={idx} className="p-3 text-dark border-bottom suggestion-item" style={{ cursor: 'pointer' }} onClick={() => { setNewCity(city); setShowCityDropdown(false); }}>
                              <strong>{city.substring(0, 3)}</strong>{city.substring(3)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* PROGRESSIVE EXPANSION: REVEALS ONLY WHEN CITY IS TYPED/SELECTED */}
                    {newCity.toLowerCase().includes("gha") || newCity.length > 3 ? (
                      <div className="animate-fade-in mt-3">
                        
                        {/* LOCALITY SPECIFICATION FIELD */}
                        <div className="mb-3">
                          <label className="form-label text-secondary small p-0 m-0 fw-bold">Locality</label>
                          <input type="text" className="form-control py-2.5 shadow-sm" placeholder="e.g. Delhi Hapur Road" value={newLocality} onChange={(e) => setNewLocality(e.target.value)} />
                        </div>

                        {/* SUB LOCALITY FIELD */}
                        <div className="mb-3">
                          <label className="form-label text-secondary small p-0 m-0 fw-bold">Sub Locality (Optional)</label>
                          <input type="text" className="form-control py-2.5 shadow-sm" placeholder="Enter Sub Locality Name" value={newSubLocality} onChange={(e) => setNewSubLocality(e.target.value)} />
                        </div>

                        {/* APARTMENT / SOCIETY INPUT WITH AUTO-FILTER MATRIX */}
                        <div className="mb-4 position-relative" onClick={(e) => e.stopPropagation()}>
                          <label className="form-label text-secondary small p-0 m-0 fw-bold">Apartment / Society</label>
                          <input 
                            type="text" 
                            className="form-control py-2.5 shadow-sm" 
                            placeholder="Type Society (e.g., Panchsheel Pr...)" 
                            value={newSociety} 
                            onChange={(e) => { setNewSociety(e.target.value); setShowSocietyDropdown(true); }}
                            onFocus={() => setShowSocietyDropdown(true)}
                          />
                          {showSocietyDropdown && newSociety.length > 2 && (
                            <div className="card shadow position-absolute bg-white rounded-3 w-100 mt-1 border-0" style={{ zIndex: 3000 }}>
                              {filteredSocieties.map((soc, idx) => (
                                <div key={idx} className="p-3 text-dark border-bottom suggestion-item small text-start" style={{ cursor: 'pointer' }} onClick={() => { setNewSociety(soc); setShowSocietyDropdown(false); }}>
                                  <strong>{soc.substring(0, 15)}</strong>{soc.substring(15)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    ) : null}

                    <button type="button" className="btn btn-primary fw-bold px-5 py-2.5 rounded-3 text-white shadow-sm mt-2" onClick={() => { if(!newCity || !newSociety) { alert("Please complete the active city and society criteria inputs."); return; } setFormSubStep(3); }}>
                      Continue
                    </button>
                  </div>
                )}

                {/* SUB-STEP 3: PROPERTY PROFILE LAYOUT CONFIGURATION (MATCHES USER DESCRIPTION) */}
                {formSubStep === 3 && (
                  <div>
                    <h2 className="fw-bold text-dark fs-3 mb-1">Tell us about your property</h2>
                    <p className="text-muted mb-4 small fs-6">Providing high-accuracy property parameters optimizes match generation speeds</p>

                    {/* BHK CONFIGURATION CAPSULE MATRIX BUTTON ROW */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary d-block mb-2">Room Configuration</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((bhk) => (
                          <button key={bhk} type="button" className={`btn rounded-pill px-4 py-2 small fw-semibold ${bhkCount === bhk ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setBhkCount(bhk)}>{bhk}</button>
                        ))}
                      </div>
                    </div>

                    {/* FURNISHING ATTRIBUTE TOGGLE BAR */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary d-block mb-2">Furnishing Status</label>
                      <div className="d-flex gap-2">
                        {["Furnished", "Semi-Furnished", "Unfurnished"].map((status) => (
                          <button key={status} type="button" className={`btn rounded-pill px-3 py-2 small fw-semibold ${furnishingStatus === status ? 'btn-outline-primary bg-light fw-bold' : 'btn-outline-secondary'}`} onClick={() => setFurnishingStatus(status)}>{status}</button>
                        ))}
                      </div>
                    </div>

                    {/* CUSTOM MARKETING DISPLAY TEXT INPUT */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary">Property Custom Display Title</label>
                      <input type="text" className="form-control py-2.5" placeholder="e.g. Ready-to-move Premium North Facing Flat Apartment" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    </div>

                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={() => setFormSubStep(2)}>Back</button>
                      <button type="button" className="btn btn-primary px-5 py-2 fw-bold" onClick={() => setFormSubStep(4)}>Continue</button>
                    </div>
                  </div>
                )}

                {/* SUB-STEP 4: INTERACTIVE PHOTOS & MEDIA CONSOLE */}
                {formSubStep === 4 && (
                  <div>
                    <h5 className="fw-bold mb-3 text-dark">🖼️ Step 4: Photos, Videos & Voice-over</h5>
                    <div className="p-5 text-center border rounded-4 mb-4 bg-light" style={{ borderStyle: 'dashed' }}>
                      <span className="fs-1 d-block mb-2">📸</span>
                      <p className="fw-bold mb-1 text-dark">Upload Real Media Assets</p>
                      <p className="small text-muted mb-0">Drag and drop images here to boost discovery engine visibility profiles.</p>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setFormSubStep(3)}>Back</button>
                      <button type="button" className="btn btn-primary px-4" onClick={() => setFormSubStep(5)}>Continue</button>
                    </div>
                  </div>
                )}

                {/* SUB-STEP 5: PRICING DEFINITION SUBMISSION SCHEDULER */}
                {formSubStep === 5 && (
                  <form onSubmit={submitFinalListing}>
                    <h5 className="fw-bold mb-3 text-dark">💰 Step 5: Pricing & Others</h5>
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary">Expected Price Valuation Model (INR)</label>
                      <input type="number" className="form-control form-control-lg text-dark fw-bold" placeholder="e.g. 7500000" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setFormSubStep(4)}>Back</button>
                      <button type="submit" className="btn btn-success px-5 fw-bold text-white shadow-sm">Publish Active Listing Globally</button>
                    </div>
                  </form>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN: BRAND INFORMATION EXPLANATION CARD TIERS */}
            <div className="col-lg-3 text-start">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-4 text-center mb-4">
                <div className="mb-3 mx-auto rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                  <span className="fs-2">🏠</span>
                </div>
                <h6 className="fw-bold text-dark mb-2">Why provide specific profiles?</h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                  Detailed profiles outlining BHK metrics, furnishing tags, and explicit square footage parameters make your listing stand out to verified tenants instantly.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* COMPACT VIEW CONSUMER LANDING PAGE CHANNEL */}
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
                  <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white text-start">
                    <img src={property.image} className="card-img-top" alt="" style={{ height: '200px', objectFit: 'cover' }} />
                    <div className="card-body p-4">
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
