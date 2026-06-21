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
  
  // App Phase Workflow: 1 = Initial Form, 2 = OTP, 3 = Multi-Step Form Dashboard
  const [listingStep, setListingStep] = useState(1);
  
  // Dashboard Core Sub-steps (Matching image_17b779.png left timeline)
  const [formSubStep, setFormSubStep] = useState(1); 

  // Core App States
  const [activeIntent, setActiveIntent] = useState("Sell"); // Sell, Rent / Lease, PG
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  // UI State Components
  const [showMyActivityDropdown, setShowMyActivityDropdown] = useState(false);
  const [shortlistedList, setShortlistedList] = useState([]);

  // Auth Inputs
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  // Property Metadata Form Fields (Matching layout metrics)
  const [propertyType, setPropertyType] = useState("Residential"); // Residential or Commercial
  const [subCategory, setSubCategory] = useState("Flat/Apartment");
  const [newTitle, setNewTitle] = useState("");
  const [newCity, setNewCity] = useState("Gurugram");
  const [newCountry, setNewCountry] = useState("India");
  const [newLocality, setNewLocality] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const countriesList = [...new Set(properties.map(p => p.country))];
    setAvailableCountries(countriesList);
  }, [properties]);

  useEffect(() => {
    const results = properties.filter(prop => {
      const matchIntent = activeIntent === "Sell" ? "Buy" : activeIntent;
      const matchesIntent = prop.intent === matchIntent;
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

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }
    setListingStep(2); 
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length === 4) {
      // Skips Account Creation completely because the user profile is recognized!
      setListingStep(3); 
      setFormSubStep(1);
    } else {
      alert("Please enter a 4-digit verification code.");
    }
  };

  const submitFinalListing = (e) => {
    e.preventDefault();
    const createdItem = {
      id: properties.length + 1,
      title: newTitle || `${propertyType} ${subCategory} in ${newLocality || 'Premium Sector'}`,
      intent: activeIntent === "Sell" ? "Buy" : activeIntent,
      type: propertyType,
      subCategory: subCategory,
      locality: newLocality || "Sector 45",
      city: newCity,
      country: newCountry,
      priceDisplay: `${newCountry === 'India' ? '₹' : '$'}${parseInt(newPrice || '45000').toLocaleString()} / month`,
      isVerified: true,
      mapAddress: `${newLocality || 'Sector 45'}, ${newCity}, ${newCountry}`,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
    };
    setProperties([...properties, createdItem]);
    alert("🎉 Listing published live onto your marketplace search index channels!");
    setCurrentPage("landing");
    setListingStep(1);
    setFormSubStep(1);
    setMobileNumber("");
    setOtpCode("");
    setNewTitle("");
    setNewLocality("");
    setNewPrice("");
  };

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }} onClick={() => setShowMyActivityDropdown(false)}>
      
      {/* GLOBAL BRAND HEADER TOP NAVIGATION */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-3" style={{ backgroundColor: '#0056b3' }}>
        <div className="container px-4">
          <span className="navbar-brand fs-3 fw-bold text-white me-5" onClick={() => { setCurrentPage("landing"); }} style={{ cursor: 'pointer' }}>
            rent<span style={{color: '#99ccff'}}>office</span>place
          </span>
          <div className="d-flex align-items-center">
            <button className="btn fw-bold px-4 py-2 rounded-3 text-white border border-white-50" onClick={() => { setCurrentPage("list-property-flow"); setListingStep(1); }}>Post Property FREE</button>
          </div>
        </div>
      </nav>

      {/* PHASE 1: LOGIN & OTP STAGES */}
      {currentPage === "list-property-flow" && listingStep < 3 && (
        <div className="container py-5 text-start" style={{ maxWidth: '480px' }}>
          <div className="card p-4 border-0 shadow-lg bg-white rounded-4">
            {listingStep === 1 ? (
              <form onSubmit={handleInitialSubmit}>
                <h3 className="fw-bold text-dark mb-3">Post Property Online</h3>
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">Enter Mobile Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light fw-bold">+91</span>
                    <input type="number" className="form-control py-2 ps-2" placeholder="7905635297" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Start Now →</button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <h4 className="fw-bold text-dark mb-2">Verify OTP</h4>
                <p className="text-muted small">Enter code sent to +91 {mobileNumber}</p>
                <input type="text" maxLength="4" className="form-control text-center fw-bold fs-3 mb-4 mx-auto" style={{ maxWidth: '150px' }} placeholder="0000" required value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} />
                <button type="submit" className="btn btn-success w-100 py-2 fw-bold">Verify Code</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2: HIGH-FIDELITY 5-STEP LISTING CONSOLE (EXACT MATCH FOR IMAGE_17B779) */}
      {currentPage === "list-property-flow" && listingStep === 3 && (
        <div className="container-fluid py-4 px-md-5">
          <div className="row g-4">
            
            {/* LEFT COLUMN COMPONENT: TIMELINE PROGRESS PANEL */}
            <div className="col-lg-3 text-start">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex flex-column gap-4 position-relative">
                    {[
                      { step: 1, label: "Basic Details" },
                      { step: 2, label: "Location Details" },
                      { step: 3, label: "Property Profile" },
                      { step: 4, label: "Photos, Videos & Voice-over" },
                      { step: 5, label: "Pricing & Others" }
                    ].map((item) => (
                      <div key={item.step} className="d-flex align-items-center gap-3">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm`} 
                             style={{ 
                               width: '32px', 
                               height: '32px', 
                               backgroundColor: formSubStep === item.step ? '#0056b3' : formSubStep > item.step ? '#198754' : '#ced4da',
                               fontSize: '0.85rem'
                             }}>
                          {formSubStep > item.step ? '✓' : item.step}
                        </div>
                        <div>
                          <span className={`d-block small fw-bold ${formSubStep === item.step ? 'text-dark' : 'text-muted'}`}>{item.label}</span>
                          <span className="text-muted text-uppercase" style={{ fontSize: '0.68rem' }}>Step {item.step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Circular Progress Indicator */}
                <div className="border-top pt-4 mt-5 d-flex align-items-center gap-3">
                  <div className="position-relative d-inline-block text-center">
                    <div className="fw-bold fs-4 text-dark p-2 bg-light rounded-circle border" style={{ width: '60px', height: '60px', lineHeight: '42px', fontSize: '0.95rem' }}>
                      {Math.round(((formSubStep - 1) / 5) * 100)}%
                    </div>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0 style-score">Property Score</h6>
                    <p className="text-muted small mb-0">Better score yields higher search visibility metrics.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* MIDDLE COLUMN COMPONENT: MAIN INTERACTIVE CONFIGURATION PANEL */}
            <div className="col-lg-6 text-start">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-4 min-vh-50">
                <h2 className="fw-bold text-dark fs-3 mb-1">Welcome back Himendra Yadav,</h2>
                <p className="text-muted fs-5 mb-4">Fill out basic details</p>

                {/* STEP MODULE 1: BASIC DETAILS PANEL */}
                {formSubStep === 1 && (
                  <div>
                    {/* Operational Intent Selection Toggles */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary d-block mb-2">I'm looking to</label>
                      <div className="d-flex gap-2">
                        {["Sell", "Rent / Lease", "PG"].map((option) => (
                          <button key={option} type="button" 
                                  className={`btn rounded-pill px-4 py-2 small fw-semibold transition-all ${activeIntent === option ? 'btn-primary shadow-sm' : 'btn-outline-secondary'}`}
                                  onClick={() => setActiveIntent(option)}>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Major Category Radio Group */}
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary d-block mb-2">What kind of property do you have?</label>
                      <div className="d-flex gap-4 mb-3">
                        <label className="fw-semibold text-dark fs-6" style={{ cursor: 'pointer' }}>
                          <input type="radio" name="propType" checked={propertyType === "Residential"} className="form-check-input me-2" onChange={() => { setPropertyType("Residential"); setSubCategory("Flat/Apartment"); }} /> Residential
                        </label>
                        <label className="fw-semibold text-dark fs-6" style={{ cursor: 'pointer' }}>
                          <input type="radio" name="propType" checked={propertyType === "Commercial"} className="form-check-input me-2" onChange={() => { setPropertyType("Commercial"); setSubCategory("Office Space"); }} /> Commercial
                        </label>
                      </div>

                      {/* Capsule Sub-type Grid Matrix */}
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {propertyType === "Residential" ? (
                          ["Flat/Apartment", "Independent House / Villa", "Independent / Builder Floor", "Plot / Land", "1 RK/ Studio Apartment", "Serviced Apartment", "Farmhouse", "Other"].map((cat) => (
                            <button key={cat} type="button" className={`btn rounded-pill px-3 py-2 small ${subCategory === cat ? 'btn-outline-primary bg-light fw-bold' : 'btn-outline-secondary text-muted'}`} onClick={() => setSubCategory(cat)} style={{ fontSize: '0.85rem' }}>
                              {cat}
                            </button>
                          ))
                        ) : (
                          ["Office Space", "Co-working Space", "Shop / Showroom", "Warehouse", "Industrial Land", "Factory"].map((cat) => (
                            <button key={cat} type="button" className={`btn rounded-pill px-3 py-2 small ${subCategory === cat ? 'btn-outline-primary bg-light fw-bold' : 'btn-outline-secondary text-muted'}`} onClick={() => setSubCategory(cat)} style={{ fontSize: '0.85rem' }}>
                              {cat}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <button type="button" className="btn btn-primary fw-bold px-5 py-3 mt-4 rounded-3 text-white fs-5" style={{ minWidth: '160px' }} onClick={() => setFormSubStep(2)}>
                      Continue
                    </button>
                  </div>
                )}

                {/* STEP MODULE 2: LOCATION DETAILS */}
                {formSubStep === 2 && (
                  <div>
                    <h5 className="fw-bold mb-3 text-dark">🎯 Step 2: Location Details</h5>
                    <div className="row g-3 mb-4">
                      <div className="col-6"><label className="form-label small fw-bold text-secondary">Country</label><input type="text" className="form-control" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} /></div>
                      <div className="col-6"><label className="form-label small fw-bold text-secondary">City</label><input type="text" className="form-control" value={newCity} onChange={(e) => setNewCity(e.target.value)} /></div>
                      <div className="col-12"><label className="form-label small fw-bold text-secondary">Locality / Sector Zone Address</label><input type="text" className="form-control" placeholder="e.g. DLF Phase 3 or Sector 45" required value={newLocality} onChange={(e) => setNewLocality(e.target.value)} /></div>
                    </div>
                    <div className="d-flex gap-2"><button type="button" className="btn btn-outline-secondary px-4" onClick={() => setFormSubStep(1)}>Back</button><button type="button" className="btn btn-primary px-4" onClick={() => setFormSubStep(3)}>Continue</button></div>
                  </div>
                )}

                {/* STEP MODULE 3: PROPERTY PROFILE */}
                {formSubStep === 3 && (
                  <div>
                    <h5 className="fw-bold mb-3 text-dark">📋 Step 3: Property Profile</h5>
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary">Property Marketing Custom Title</label>
                      <input type="text" className="form-control" placeholder="e.g. Fully Premium Furnished Office Workspace Suite" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    </div>
                    <div className="d-flex gap-2"><button type="button" className="btn btn-outline-secondary px-4" onClick={() => setFormSubStep(2)}>Back</button><button type="button" className="btn btn-primary px-4" onClick={() => setFormSubStep(4)}>Continue</button></div>
                  </div>
                )}

                {/* STEP MODULE 4: PHOTOS & MEDIA */}
                {formSubStep === 4 && (
                  <div>
                    <h5 className="fw-bold mb-3 text-dark">🖼️ Step 4: Photos, Videos & Voice-over</h5>
                    <div className="p-5 text-center border rounded-4 mb-4 bg-light" style={{ borderStyle: 'dashed' }}>
                      <span className="fs-1 d-block mb-2">📸</span>
                      <p className="fw-bold mb-1 text-dark">Upload Real Media Assets</p>
                      <p className="small text-muted mb-0">Drag and drop images here to boost conversion score vectors by up to 40%.</p>
                    </div>
                    <div className="d-flex gap-2"><button type="button" className="btn btn-outline-secondary px-4" onClick={() => setFormSubStep(3)}>Back</button><button type="button" className="btn btn-primary px-4" onClick={() => setFormSubStep(5)}>Continue</button></div>
                  </div>
                )}

                {/* STEP MODULE 5: PRICING DETAILS */}
                {formSubStep === 5 && (
                  <form onSubmit={submitFinalListing}>
                    <h5 className="fw-bold mb-3 text-dark">💰 Step 5: Pricing & Others</h5>
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-secondary">Expected Monthly Lease/Sale Valuation</label>
                      <input type="number" className="form-control form-control-lg text-dark fw-bold" placeholder="e.g. 65000" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                    </div>
                    <div className="d-flex gap-2"><button type="button" className="btn btn-outline-secondary px-4" onClick={() => setFormSubStep(4)}>Back</button><button type="submit" className="btn btn-success px-5 fw-bold text-white shadow-sm">Publish Active Listing Globally</button></div>
                  </form>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN COMPONENT: SIDEBAR MARKETING TIERS */}
            <div className="col-lg-3 text-start">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-4 mb-3">
                <h6 className="fw-bold text-uppercase text-secondary tracking-wider small mb-3" style={{ fontSize: '0.75rem' }}>🔔 Limited-Time Residential Offers</h6>
                <div className="p-3 rounded-3 bg-light border mb-3 position-relative overflow-hidden">
                  <span className="badge bg-primary position-absolute text-white" style={{ top: '10px', right: '-15px', transform: 'rotate(45deg)', padding: '4px 20px', fontSize: '0.62rem' }}>RENT</span>
                  <h6 className="fw-bold text-dark small mb-2">Residential Rent offers</h6>
                  <p className="small text-muted mb-1"><strong>75% off</strong> for rent upto ₹15,000</p>
                  <p className="small text-muted mb-0"><strong>50% off</strong> for rent above ₹15,000</p>
                </div>
                <div className="p-3 rounded-3 bg-light border position-relative overflow-hidden">
                  <span className="badge bg-danger position-absolute text-white" style={{ top: '10px', right: '-15px', transform: 'rotate(45deg)', padding: '4px 20px', fontSize: '0.62rem' }}>SALE</span>
                  <h6 className="fw-bold text-dark small mb-2">Residential Resale offers</h6>
                  <p className="small text-muted mb-0"><strong>50% off</strong> for price up to ₹50 Lakh</p>
                </div>
                <div className="text-center text-muted mt-3" style={{ fontSize: '0.7rem' }}>* offers valid till 30 Sep'26</div>
              </div>

              <div className="card border-0 shadow-sm p-3 bg-light rounded-3 text-center">
                <p className="small text-muted mb-1 fw-semibold">Need help?</p>
                <p className="small mb-0 text-dark" style={{ fontSize: '0.8rem' }}>📧 services@rentofficeplace.com</p>
                <p className="small mb-0 fw-bold text-primary" style={{ fontSize: '0.82rem' }}>📞 1800 41 99099 (Toll-Free)</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CORE MARKETPLACE CONSUMER LANDING PAGE */}
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
