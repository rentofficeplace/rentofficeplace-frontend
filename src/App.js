import React, { useState, useEffect } from 'react';

const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Premium 3 BHK Furnished Apartment in Panchsheel Primrose",
    intent: "Rent",
    type: "Residential",
    subCategory: "Apartment Flat",
    locality: "Avantika Colony",
    city: "Ghaziabad",
    country: "India",
    priceDisplay: "₹25,000 / month",
    isVerified: true,
    mapAddress: "Panchsheel Primrose, Avantika Colony, Ghaziabad, India",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
  }
];

const CITY_SUGGESTIONS = ["Ghaziabad", "Ghazipur", "Ghatal", "Gurugram", "Noida", "Delhi"];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  
  // Form pipeline phases: 
  // 1 = Basic Info, 2 = OTP Check, 3 = Create Account, 
  // 4 = Property Profile (image_173f41.png), 5 = Photos Upload, 6 = Pricing & Review
  const [listingStep, setListingStep] = useState(1);

  // Filters and Data Matrix
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  // Setup Profiles
  const [userProfile, setUserProfile] = useState("Owner"); 
  const [showMyActivityDropdown, setShowMyActivityDropdown] = useState(false);
  const [shortlistedList, setShortlistedList] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Authentication Fields
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  
  // Baseline Attributes
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Residential");
  const [newSubCategory, setNewSubCategory] = useState("Apartment Flat");
  const [newCountry, setNewCountry] = useState("India");
  const [newCity, setNewCity] = useState("");
  const [newLocality, setNewLocality] = useState("");

  // HIGH-FIDELITY PROPERTY PROFILE FIELDS (Matching image_173f41.png requirements)
  const [bhkType, setBhkType] = useState("3 BHK");
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("3");
  const [balconies, setBalconies] = useState("2");
  const [carpetArea, setCarpetArea] = useState("");
  const [parking, setParking] = useState("Covered");
  const [furnishing, setFurnishing] = useState("Semi-Furnished");
  const [floorDetail, setFloorDetail] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("Ready to Move");
  
  // Media State Storage
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState("");
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
      alert("Please use testing code `1234`.");
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

  const submitFinalListing = (e) => {
    e.preventDefault();
    const finalPhoto = uploadedPhotoUrl.trim() || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600";
    
    const createdItem = {
      id: properties.length + 1,
      title: newTitle || `${furnishing} ${bhkType} ${newSubCategory} in ${newLocality || 'Premium Suburb'}`,
      intent: activeIntent,
      type: newType,
      subCategory: newSubCategory,
      locality: newLocality || "Main Sector",
      city: newCity || "Ghaziabad",
      country: newCountry,
      priceDisplay: `${newCountry === 'India' ? '₹' : '$'}${parseInt(newPrice).toLocaleString()} ${activeIntent === 'Rent' ? '/ month' : ''}`,
      isVerified: true,
      mapAddress: `${newLocality}, ${newCity}, ${newCountry}`,
      image: finalPhoto
    };
    
    setProperties([createdItem, ...properties]);
    alert("🎉 Property verified and published live successfully on the marketplace index!");
    setCurrentPage("landing");
    setListingStep(1);
    setMobileNumber(""); setEmailAddress(""); setOtpCode(""); setFullName(""); setTermsAgreed(false);
    setNewTitle(""); setNewCity(""); setNewLocality(""); setNewPrice(""); setCarpetArea(""); setFloorDetail(""); setTotalFloors(""); setUploadedPhotoUrl("");
  };

  const filteredCities = CITY_SUGGESTIONS.filter(c => c.toLowerCase().includes(newCity.toLowerCase()));

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }} onClick={() => { setShowCityDropdown(false); setShowMyActivityDropdown(false); }}>
      
      {/* HEADER MAROON BRANDING ROW */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-3" style={{ backgroundColor: '#a81c1c' }}>
        <div className="container px-4">
          <span className="navbar-brand fs-3 fw-bold text-white me-5" onClick={() => { setCurrentPage("landing"); }} style={{ cursor: 'pointer' }}>
            Rent<span style={{color: '#D4AF37'}}>Office</span>Place
          </span>

          <div className="d-flex align-items-center me-auto">
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-5" onClick={() => { setCurrentPage("landing"); setActiveIntent("Buy"); }}>Buy ▾</button>
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-5" onClick={() => { setCurrentPage("landing"); setActiveIntent("Rent"); }}>Rent ▾</button>
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-5" onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); }}>Sell ▾</button>
          </div>

          <div className="d-flex align-items-center">
            <button className="btn fw-bold px-3 py-1.5 rounded-3" style={{ backgroundColor: '#d4af37', color: '#1a1a1a', border: 'none' }} onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); }}>
              Post Property <span className="badge bg-dark text-warning ms-1 small">FREE</span>
            </button>
          </div>
        </div>
      </nav>

      {/* CORE WORKSPACE ENTRY CONTAINER */}
      {currentPage === "list-property-flow" && (
        <div className="container py-5">
          <div className="row g-4">
            
            {/* LEFT SIDEBAR VIEW: 5-STEP VISUAL PROGRESS INDICATOR */}
            <div className="col-lg-4 text-start">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex flex-column gap-4">
                  {[
                    { step: 1, label: "Basic Details", active: listingStep === 1 },
                    { step: 2, label: "Location Details", active: listingStep === 3 },
                    { step: 3, label: "Property Profile", active: listingStep === 4 },
                    { step: 4, label: "Photos & Media Upload", active: listingStep === 5 },
                    { step: 5, label: "Pricing & Complete", active: listingStep === 6 }
                  ].map((item) => {
                    const stepState = listingStep >= item.step + (item.step > 1 ? 1 : 0);
                    const isCurrent = (item.step === 1 && listingStep <= 2) || (item.step === 2 && listingStep === 3) || (item.step === 3 && listingStep === 4) || (item.step === 4 && listingStep === 5) || (item.step === 5 && listingStep === 6);
                    return (
                      <div key={item.step} className="d-flex align-items-center gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" 
                             style={{ 
                               width: '32px', height: '32px', 
                               backgroundColor: isCurrent ? '#a81c1c' : stepState ? '#198754' : '#ced4da',
                               fontSize: '0.85rem'
                             }}>
                          {stepState && !isCurrent ? '✓' : item.step}
                        </div>
                        <div>
                          <span className={`d-block small fw-bold ${isCurrent ? 'text-dark fs-6' : 'text-muted'}`}>{item.label}</span>
                          <span className="text-muted" style={{ fontSize: '0.7rem' }}>Step {item.step}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-top pt-4 mt-5">
                  <div className="d-flex align-items-center gap-3">
                    <div className="fw-bold text-success p-2 bg-light rounded-circle border d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
                      {listingStep === 1 ? "10%" : listingStep === 3 ? "25%" : listingStep === 4 ? "55%" : listingStep === 5 ? "75%" : "95%"}
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">Property Score</h6>
                      <p className="text-muted small mb-0">Completing metrics maximizes matching visibility.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR VIEW: CONTEXTUAL STEPS MANAGER */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg p-4 bg-white rounded-4 text-start">
                
                {/* STEP 1: INITIAL CORE INTENT & BASELINE SELECTIONS */}
                {listingStep === 1 && (
                  <form onSubmit={handleInitialSubmit}>
                    <h3 className="fw-bold text-dark mb-1">Let's get your listing started</h3>
                    <p className="text-muted small mb-4">Post real estate assets onto global search hubs completely for free.</p>
                    
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary">You are:</label>
                        <select className="form-select" value={userProfile} onChange={(e) => setUserProfile(e.target.value)}>
                          <option value="Owner">Owner</option><option value="Agent">Agent</option><option value="Builder">Builder</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary">Listing Intent:</label>
                        <div className="d-flex gap-2">
                          {["Rent", "Buy"].map(opt => (
                            <button key={opt} type="button" className={`btn w-50 py-2 fw-semibold ${activeIntent === opt ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setActiveIntent(opt)}>{opt === 'Rent' ? 'Rent / Lease' : 'Sell Space'}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary">Your connection contact number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light fw-bold">IND +91</span>
                        <input type="number" className="form-control py-2" placeholder="Enter WhatsApp Mobile Number" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-danger w-100 fw-bold py-2.5 fs-5" style={{ backgroundColor: '#df2020', border: 'none' }}>Start Now →</button>
                  </form>
                )}

                {/* STEP 2: SECURITY ACCESS CHANNELS */}
                {listingStep === 2 && (
                  <form onSubmit={handleVerifyOtp}>
                    <h3 className="fw-bold text-dark mb-1">Verify Mobile Identity</h3>
                    <p className="text-muted small mb-4">Enter the verification bypass key code <strong className="text-dark">1234</strong> to unlock your session.</p>
                    <div className="mb-4">
                      <input type="text" maxLength="4" className="form-control text-center fw-bold fs-3 mx-auto" style={{ maxWidth: '160px', letterSpacing: '6px' }} placeholder="0000" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-success w-100 fw-bold py-2.5">Confirm Identity</button>
                  </form>
                )}

                {/* STEP 3: ACCOUNT GENERATION & REGISTRY ADDRESS PROMPTS */}
                {listingStep === 3 && (
                  <form onSubmit={handleCreateAccountSubmit}>
                    <h3 className="fw-bold text-dark mb-3">Complete Profile & Location Base</h3>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6"><input type="text" className="form-control py-2" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                      <div className="col-md-6"><input type="email" className="form-control py-2" placeholder="Email Id" required value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} /></div>
                    </div>

                    <div className="row g-3 mb-3" onClick={(e) => e.stopPropagation()}>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-secondary">Category classification</label>
                        <select className="form-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                          <option value="Residential">Residential</option><option value="Commercial">Commercial</option>
                        </select>
                      </div>
                      <div className="col-6 position-relative">
                        <label className="form-label small fw-bold text-secondary">City Location</label>
                        <input type="text" className="form-control" required value={newCity} onChange={(e) => { setNewCity(e.target.value); setShowCityDropdown(true); }} placeholder="e.g. Ghaziabad" />
                        {showCityDropdown && newCity.length > 1 && (
                          <div className="card shadow position-absolute bg-white rounded-3 w-100 mt-1 border-0" style={{ zIndex: 3000, left: 0 }}>
                            {filteredCities.map((city, idx) => (
                              <div key={idx} className="p-2 small text-dark border-bottom" style={{ cursor: 'pointer' }} onClick={() => { setNewCity(city); setShowCityDropdown(false); }}>{city}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">Locality Sector / Society Complex</label>
                      <input type="text" className="form-control py-2" required value={newLocality} onChange={(e) => setNewLocality(e.target.value)} placeholder="e.g. Panchsheel Primrose, Avantika Colony" />
                    </div>

                    <div className="form-check mb-4">
                      <input className="form-check-input" type="checkbox" id="terms" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} />
                      <label className="form-check-label text-muted small" htmlFor="terms">I agree to market parameters listing Terms & Conditions</label>
                      {showTermsError && <div className="text-danger small mt-1">⚠️ Checklist agreement acknowledgment mandatory.</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2">Continue to Property Details →</button>
                  </form>
                )}

                {/* STEP 4: HIGH-FIDELITY PROPERTY SPECIFICATIONS PROFILE (MATCHES IMAGE_173F41.PNG EXACTLY) */}
                {listingStep === 4 && (
                  <div>
                    <h3 className="fw-bold text-dark mb-1">Tell us about your property</h3>
                    <p className="text-muted small mb-4">Provide detailed structural attributes to capture target matching algorithms.</p>
                    
                    {/* Apartment Layout Type */}
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary d-block">Your apartment is a</label>
                      <div className="d-flex gap-2">
                        {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Other"].map(opt => (
                          <button key={opt} type="button" className={`btn rounded-pill px-4 py-1.5 small fw-semibold ${bhkType === opt ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => { setBhkType(opt); if(opt !== "Other") setBedrooms(opt.charAt(0)); }}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    <h5 className="fw-bold border-bottom pb-2 mt-4 text-dark fs-6">Add Room Details</h5>

                    {/* Bedroom Count Row */}
                    <div className="mb-3">
                      <label className="form-label small text-muted mb-1">No. of Bedrooms</label>
                      <div className="d-flex gap-2">
                        {["1", "2", "3", "4", "5"].map(num => (
                          <button key={num} type="button" className={`btn rounded-circle px-3 py-1.5 small ${bedrooms === num ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setBedrooms(num)} style={{ minWidth: '42px' }}>{num}</button>
                        ))}
                      </div>
                    </div>

                    {/* Bathroom Count Row */}
                    <div className="mb-3">
                      <label className="form-label small text-muted mb-1">No. of Bathrooms</label>
                      <div className="d-flex gap-2">
                        {["1", "2", "3", "4"].map(num => (
                          <button key={num} type="button" className={`btn rounded-circle px-3 py-1.5 small ${bathrooms === num ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setBathrooms(num)} style={{ minWidth: '42px' }}>{num}</button>
                        ))}
                      </div>
                    </div>

                    {/* Balconies Row */}
                    <div className="mb-4">
                      <label className="form-label small text-muted mb-1">Balconies</label>
                      <div className="d-flex gap-2">
                        {["0", "1", "2", "3", "More than 3"].map(num => (
                          <button key={num} type="button" className={`btn rounded-pill px-3 py-1.5 small ${balconies === num ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setBalconies(num)}>{num}</button>
                        ))}
                      </div>
                    </div>

                    <h5 className="fw-bold border-bottom pb-2 mt-4 text-dark fs-6">Area, Parking & Level Matrix</h5>

                    {/* Size and Level Matrix Fields */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary mb-1">Carpet Area (Sq. Ft.)</label>
                        <input type="number" className="form-control py-2" placeholder="e.g. 1675" required value={carpetArea} onChange={(e) => setCarpetArea(e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary mb-1">Parking Availability</label>
                        <select className="form-select" value={parking} onChange={(e) => setParking(e.target.value)}>
                          <option value="Covered">Covered Parking 🚗</option><option value="Open">Open Yard Parking 🚙</option><option value="None">No Dedicated Parking Slot</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-secondary mb-1">Furnishing Tier</label>
                        <select className="form-select" value={furnishing} onChange={(e) => setFurnishing(e.target.value)}>
                          <option value="Furnished">Fully Furnished</option><option value="Semi-Furnished">Semi-Furnished</option><option value="Unfurnished">Unfurnished Space</option>
                        </select>
                      </div>
                      <div className="col-3">
                        <label className="form-label small fw-bold text-secondary mb-1">Floor Level</label>
                        <input type="number" className="form-control" placeholder="e.g. 4" required value={floorDetail} onChange={(e) => setFloorDetail(e.target.value)} />
                      </div>
                      <div className="col-3">
                        <label className="form-label small fw-bold text-secondary mb-1">Total Floors</label>
                        <input type="number" className="form-control" placeholder="e.g. 14" required value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary mb-1">Availability Status</label>
                      <div className="d-flex gap-2">
                        {["Ready to Move", "Under Construction"].map(status => (
                          <button key={status} type="button" className={`btn rounded-pill px-4 py-1.5 small fw-semibold ${availabilityStatus === status ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setAvailabilityStatus(status)}>{status}</button>
                        ))}
                      </div>
                    </div>

                    <button type="button" className="btn btn-danger px-5 py-2.5 fw-bold" style={{ backgroundColor: '#a81c1c', border: 'none' }} onClick={() => { if(!carpetArea || !floorDetail) { alert("Please complete carpet square footage area and level details."); return; } setListingStep(5); }}>
                      Continue to Media Upload →
                    </button>
                  </div>
                )}

                {/* STEP 5: GENUINE PHOTO/MEDIA FILE CAPTURE FIELDS */}
                {listingStep === 5 && (
                  <div>
                    <h3 className="fw-bold text-dark mb-1">Photos, Videos & Voice-over</h3>
                    <p className="text-muted small mb-4">Add real property view images to draw tenant lookups instantly.</p>
                    
                    <div className="p-4 border rounded-4 text-center bg-light mb-4" style={{ borderStyle: 'dashed' }}>
                      <span className="fs-1 d-block mb-2">📸</span>
                      <label className="form-label fw-bold d-block mb-1 text-dark">Add Property Image Link URL</label>
                      <input type="text" className="form-control mx-auto mt-2 text-center small" style={{ maxWidth: '400px' }} placeholder="https://example.com/apartment-image.jpg" value={uploadedPhotoUrl} onChange={(e) => setUploadedPhotoUrl(e.target.value)} />
                      <p className="text-muted small mt-2 mb-0">Paste any public web image URL or leave blank to load default project placeholder assets.</p>
                    </div>

                    <button type="button" className="btn btn-danger px-5 py-2" style={{ backgroundColor: '#a81c1c', border: 'none' }} onClick={() => setListingStep(6)}>
                      Continue to Pricing →
                    </button>
                  </div>
                )}

                {/* STEP 6: PRICING DEFINITIONS & INVENTORY PUBLISH CHECK BOX */}
                {listingStep === 6 && (
                  <form onSubmit={submitFinalListing}>
                    <h3 className="fw-bold text-dark mb-1">Pricing & Others</h3>
                    <p className="text-muted small mb-4">Set your valuation parameters to complete deployment index hooks.</p>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary mb-1">Expected Financial Valuation (INR)</label>
                      <input type="number" className="form-control form-control-lg fw-bold text-dark" placeholder="e.g. 25000" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary mb-1">Custom Property Title / Description</label>
                      <input type="text" className="form-control" placeholder="e.g. East Facing North Corner Well Maintained Flat Suite" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-success w-100 fw-bold py-3 fs-5" style={{ backgroundColor: '#198754', border: 'none' }}>
                      Publish Listing On Marketplace
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

      {/* SEARCH CONSUMER REGISTRY INTERFACE DISCOVERY ROW */}
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
            <h3 className="fw-bold mb-4 text-dark text-start">Available Listings ({filteredProperties.length})</h3>
            <div className="row g-4">
              {filteredProperties.map(property => (
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
              ))}
            </div>
          </main>
        </div>
      )}

    </div>
  );
}

export default App;
