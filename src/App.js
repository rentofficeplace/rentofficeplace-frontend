import React, { useState, useEffect } from 'react';

// Comprehensive Mock Database featuring explicit sub-categories
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
    facilities: "Loading Docks, 24/7 Heavy Vehicle Access, High Ceilings",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600"
  },
  {
    id: 3,
    title: "Prime Market Retail Shop Front",
    intent: "Rent",
    type: "Commercial",
    subCategory: "Shop",
    locality: "Connaught Place",
    city: "Delhi",
    country: "India",
    priceDisplay: "₹95,000 / month",
    facilities: "Main Road Frontage, Central AC, Heavy Footfall",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600"
  },
  {
    id: 4,
    title: "Elite Student Co-Living Hostel",
    intent: "Rent",
    type: "Hostels",
    subCategory: "Hostel",
    locality: "North Campus, Delhi",
    city: "Delhi",
    country: "India",
    priceDisplay: "₹8,500 / month",
    facilities: "CCTV Security, Shared Study Lounge, Mess",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600"
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [listingStep, setListingStep] = useState(1);

  // Clean Search Parameters
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [keywordSearch, setKeywordSearch] = useState(""); // Searches city OR sub-category text
  const [propertyType, setPropertyType] = useState("Residential"); 
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Step 1 Form States
  const [ownerCountryResidence, setOwnerCountryResidence] = useState("India");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // Step 2 Form States
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
      
      // Intelligent Search: Looks inside City, Locality, OR SubCategory keywords!
      const cleanQuery = keywordSearch.toLowerCase().trim();
      const matchesKeyword = cleanQuery === "" || 
        prop.city.toLowerCase().includes(cleanQuery) || 
        prop.locality.toLowerCase().includes(cleanQuery) ||
        prop.subCategory.toLowerCase().includes(cleanQuery);

      return matchesIntent && matchesType && matchesCountry && matchesKeyword;
    });
    setFilteredProperties(results);
  }, [properties, activeIntent, selectedCountry, propertyType, keywordSearch]);

  const handleImageChange = (e) => {
    setErrorMsg("");
    const files = Array.from(e.target.files);
    if (files.length < 4 || files.length > 5) {
      setErrorMsg("❌ Security Rule: 4 to 5 high-resolution images required.");
      e.target.value = "";
      return;
    }
    setSelectedImages(files);
  };

  const sendOTP = (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setErrorMsg("❌ Please supply a valid mobile number.");
      return;
    }
    setOtpSent(true);
    setErrorMsg("");
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    if (otpCode === "1234") { 
      setIsHumanVerified(true);
      setListingStep(2); 
      setErrorMsg("");
    } else {
      setErrorMsg("❌ Invalid OTP token footprint.");
    }
  };

  const submitFinalListing = (e) => {
    e.preventDefault();
    const createdItem = {
      id: properties.length + 1,
      title: newTitle,
      intent: "Rent",
      type: newType,
      subCategory: newSubCategory,
      locality: "Verified Premium Hub",
      city: newCity,
      country: "India",
      priceDisplay: `₹${parseInt(newPrice).toLocaleString()} / month`,
      facilities: newFacilities,
      image: newType === 'Commercial' 
        ? "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600" 
        : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
    };
    setProperties([...properties, createdItem]);
    alert("🎉 Listing successfully verified and published live!");
    
    setCurrentPage("landing");
    setListingStep(1);
    setOtpSent(false);
    setIsHumanVerified(false);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 sticky-top shadow-sm">
        <div className="container">
          <span className="fs-3 fw-bold text-white" onClick={() => setCurrentPage("landing")} style={{ cursor: 'pointer' }}>
            Rent<span style={{color: '#D4AF37'}}>Office</span>Place
          </span>
          <div className="ms-auto">
            {currentPage === "landing" ? (
              <button className="btn btn-warning fw-bold rounded-pill px-4" onClick={() => setCurrentPage("list-property-flow")}>
                Post Property FREE
              </button>
            ) : (
              <button className="btn btn-outline-light btn-sm fw-bold rounded-pill px-3" onClick={() => setCurrentPage("landing")}>
                ← Back to Browse
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* LANDING PLATFORM */}
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
                  
                  {/* CLEAN BASE CATEGORIES */}
                  <div className="col-md-4">
                    <select className="form-select fw-semibold" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                      <option value="Residential">Residential 🏠</option>
                      <option value="Commercial">Commercial 🏢</option>
                      <option value="Hostels">Hostels 👥</option>
                      <option value="PG">PG (Paying Guest) 🛏️</option>
                    </select>
                  </div>

                  {/* SMART SEARCH KEYWORD BAR */}
                  <div className="col-md-5">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search city or specific type (e.g. Noida, Warehouse, Shop)..." 
                      value={keywordSearch} 
                      onChange={(e) => setKeywordSearch(e.target.value)} 
                    />
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
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <div className="col-md-4" key={property.id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                      <img src={property.image} className="card-img-top" alt="Property Assets" style={{ height: '200px', objectFit: 'cover' }} />
                      <div className="card-body p-4">
                        <span className="badge bg-dark text-warning mb-2 px-3 py-1 rounded-pill">{property.type} ({property.subCategory})</span>
                        <h5 className="card-title fw-bold text-dark">{property.title}</h5>
                        <p className="card-text text-muted mb-2">📍 {property.locality}</p>
                        <p className="card-text text-secondary small">⚡ **Amenities:** {property.facilities}</p>
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
                  <p className="text-muted fs-5">No records matching your filters found.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* DEDICATED SECURED LISTING FLOW */}
      {currentPage === "list-property-flow" && (
        <main className="container py-5">
          <div className="mx-auto" style={{ maxWidth: '550px' }}>
            <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
              
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h4 className="fw-bold text-dark mb-0">List New Real Estate</h4>
                <span className="badge bg-dark text-white p-2">Step {listingStep} of 2</span>
              </div>

              {errorMsg && <div className="alert alert-danger p-2 small fw-semibold mb-3">{errorMsg}</div>}

              {/* STEP 1: IDENTITY GATEWAY */}
              {listingStep === 1 && (
                <div>
                  <h5 className="fw-bold text-dark mb-2">🔐 KYC Identity Authentication</h5>
                  <p className="text-muted small mb-4">Verify your credibility to complete mobile registration.</p>
                  
                  {!otpSent ? (
                    <form onSubmit={sendOTP}>
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Country of Legal Residence</label>
                        <select className="form-select text-muted fw-semibold" value={ownerCountryResidence} onChange={(e) => setOwnerCountryResidence(e.target.value)}>
                          <option value="India">India 🇮🇳</option>
                          <option value="United States">United States 🇺🇸</option>
                          <option value="Australia">Australia 🇦🇺</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-bold">Mobile Number</label>
                        <input type="number" className="form-control" placeholder="Enter active mobile number" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                      </div>
                      <button type="submit" className="btn btn-primary w-100 fw-bold rounded-pill">Request Security Token</button>
                    </form>
                  ) : (
                    <form onSubmit={verifyOTP}>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-success">Enter Security OTP (Use bypass key "1234")</label>
                        <input type="text" className="form-control text-center fs-4" placeholder="••••" maxLength="4" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                      </div>
                      <button type="submit" className="btn btn-success w-100 fw-bold rounded-pill">Confirm Verification</button>
                    </form>
                  )}
                </div>
              )}

              {/* STEP 2: DETAILS ENTRY ENTRY */}
              {listingStep === 2 && isHumanVerified && (
                <form onSubmit={submitFinalListing}>
                  <h5 className="fw-bold text-success mb-3">✓ Verification Passed. Submit Specifications</h5>
                  
                  <div className="mb-2">
                    <label className="form-label small fw-bold mb-1">Listing Title Name</label>
                    <input type="text" className="form-control" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Modern Industrial Storage Space" />
                  </div>

                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold mb-1">Main Category</label>
                      <select className="form-select" value={newType} onChange={(e) => {
                        setNewType(e.target.value);
                        // Automatically set defaults for subCategory fields
                        setNewSubCategory(e.target.value === 'Commercial' ? 'Shop' : 'Apartment');
                      }}>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Hostels">Hostels</option>
                        <option value="PG">PG (Paying Guest)</option>
                      </select>
                    </div>

                    {/* DYNAMIC SUB-CATEGORY OPTIONS */}
                    <div className="col-6">
                      <label className="form-label small fw-bold mb-1">Specific Classification</label>
                      {newType === 'Commercial' ? (
                        <select className="form-select" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
                          <option value="Shop">Shop 🛍️</option>
                          <option value="Warehouse">Warehouse 📦</option>
                          <option value="Clinic">Clinic 🩺</option>
                          <option value="Store">Store 🏬</option>
                          <option value="Factory">Factory 🏭</option>
                        </select>
                      ) : newType === 'Residential' ? (
                        <select className="form-select" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
                          <option value="Apartment">Apartment Flat</option>
                          <option value="House">Independent House</option>
                          <option value="Villa">Villa</option>
                        </select>
                      ) : (
                        <input type="text" className="form-control" disabled value={newType} />
                      )}
                    </div>
                  </div>

                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold mb-1">City Location</label>
                      <input type="text" className="form-control" required value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Noida" />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold mb-1">Monthly Cost (INR)</label>
                      <input type="number" className="form-control" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 45000" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold mb-1">Amenities</label>
                    <input type="text" className="form-control" required value={newFacilities} onChange={(e) => setNewFacilities(e.target.value)} placeholder="e.g. 3-Phase Power, Loading Bay, Parking" />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold mb-1 text-primary">Upload Photos (4-5 Images Required)</label>
                    <input type="file" className="form-control" multiple accept="image/*" required onChange={handleImageChange} />
                  </div>

                  <button type="submit" className="btn btn-warning w-100 fw-bold rounded-pill text-dark shadow-sm">Publish Active Listing</button>
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
