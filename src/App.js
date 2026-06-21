import React, { useState, useEffect } from 'react';

// Truly Global Database: Add any listing from any country here, and the site dynamically adapts!
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
    mapAddress: "DLF Phase 3, Gurugram, Haryana, India", // Passed to Google Navigation API
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
    title: "Manhattan Executive Business Suite",
    intent: "Rent",
    type: "Commercial",
    subCategory: "Office",
    locality: "Times Square",
    city: "New York",
    country: "United States",
    priceDisplay: "$4,200 / month",
    isVerified: true,
    mapAddress: "Times Square, New York, NY, USA",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600"
  },
  {
    id: 4,
    title: "Premium Sydney Harbour Waterfront Penthouse",
    intent: "Buy",
    type: "Residential",
    subCategory: "Villa",
    locality: "Circular Quay",
    city: "Sydney",
    country: "Australia",
    priceDisplay: "$8,500,000",
    isVerified: true,
    mapAddress: "Circular Quay, Sydney, NSW, Australia",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600"
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [listingStep, setListingStep] = useState(1);

  // Core Global States
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);

  // UI State Components
  const [showMyActivityDropdown, setShowMyActivityDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // User Histories
  const [recentlySearched, setRecentlySearched] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [shortlistedList, setShortlistedList] = useState([]);
  const [contactedList, setContactedList] = useState([]);

  const [activityViewFilter, setActivityViewFilter] = useState("ALL");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // Post Listing Form States
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Residential");
  const [newSubCategory, setNewSubCategory] = useState("Apartment");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("India");
  const [newLocality, setNewLocality] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // Step 1: Automatically extract unique countries present in database listings
  useEffect(() => {
    const countriesList = [...new Set(properties.map(p => p.country))];
    setAvailableCountries(countriesList);
    if (countriesList.length > 0 && !countriesList.includes(selectedCountry)) {
      setSelectedCountry(countriesList[0]);
    }
  }, [properties]);

  // Step 2: Keep frontend search grid synced with selections
  useEffect(() => {
    const results = properties.filter(prop => {
      const matchesIntent = prop.intent === activeIntent;
      const matchesCountry = prop.country.toLowerCase() === selectedCountry.toLowerCase();
      const cleanQuery = keywordSearch.toLowerCase().trim();
      const matchesKeyword = cleanQuery === "" || 
        prop.city.toLowerCase().includes(cleanQuery) || 
        prop.locality.toLowerCase().includes(cleanQuery) ||
        prop.subCategory.toLowerCase().includes(cleanQuery);
      return prop.isVerified && matchesIntent && matchesCountry && matchesKeyword;
    });
    setFilteredProperties(results);
  }, [properties, activeIntent, selectedCountry, keywordSearch]);

  // Google Navigation Engine Generator Link Hook
  const openGoogleNavigation = (mapAddress) => {
    // Encodes destination plain-text perfectly for uniform URL architecture execution
    const secureUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapAddress)}`;
    window.open(secureUrl, '_blank');
  };

  const executeSearchLog = () => {
    if (keywordSearch.trim() !== "" && !recentlySearched.includes(keywordSearch)) {
      setRecentlySearched([keywordSearch, ...recentlySearched.slice(0, 4)]);
    }
  };

  const toggleShortlistStatus = (property) => {
    if (shortlistedList.some(s => s.id === property.id)) {
      setShortlistedList(shortlistedList.filter(p => p.id !== property.id));
    } else {
      setShortlistedList([property, ...shortlistedList]);
    }
  };

  const logContactAction = (property) => {
    if (!contactedList.some(p => p.id === property.id)) {
      setContactedList([property, ...contactedList]);
    }
    alert(`📞 Access Request: Owner routing for ${property.title} successfully connected.`);
  };

  // Extract localities dynamically inside specific country sectors for the automated SEO matrix
  const getDynamicLocalities = () => {
    const subset = properties.filter(p => p.country.toLowerCase() === selectedCountry.toLowerCase());
    return [...new Set(subset.map(p => `${p.locality} ${p.city}`))];
  };

  const submitFinalListing = (e) => {
    e.preventDefault();
    const createdItem = {
      id: properties.length + 1,
      title: newTitle,
      intent: activeIntent,
      type: newType,
      subCategory: newSubCategory,
      locality: newLocality || "Premium Zone",
      city: newCity,
      country: newCountry,
      priceDisplay: `₹${parseInt(newPrice).toLocaleString()} / month`,
      isVerified: true,
      mapAddress: `${newLocality || 'Center'}, ${newCity}, ${newCountry}`,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
    };
    setProperties([...properties, createdItem]);
    alert("🎉 Global Listing Live!");
    setCurrentPage("landing");
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }} onClick={() => setShowMyActivityDropdown(false)}>
      
      {/* GLOBAL BRAND HEADER NAVIGATION BAR */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-3" style={{ backgroundColor: '#a81c1c' }}>
        <div className="container px-4">
          <span className="navbar-brand fs-3 fw-bold text-white me-5" onClick={() => { setCurrentPage("landing"); setActivityViewFilter("ALL"); }} style={{ cursor: 'pointer' }}>
            Rent<span style={{color: '#D4AF37'}}>Office</span>Place
          </span>

          <div className="d-flex align-items-center me-auto">
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-6" onClick={() => { setCurrentPage("landing"); setActiveIntent("Buy"); setActivityViewFilter("ALL"); }}>Buy ▾</button>
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-6" onClick={() => { setCurrentPage("landing"); setActiveIntent("Rent"); setActivityViewFilter("ALL"); }}>Rent ▾</button>
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-6" onClick={() => setCurrentPage("list-property-flow")}>Sell ▾</button>
          </div>

          <div className="d-flex align-items-center">
            <div className="position-relative" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="btn btn-link text-white text-decoration-none me-3 fw-semibold border border-white-50 rounded px-3 py-1" style={{ fontSize: '0.92rem' }} onClick={() => setShowMyActivityDropdown(!showMyActivityDropdown)}>
                👤 Sign In / My Activity {showMyActivityDropdown ? '▲' : '▼'}
              </button>

              {showMyActivityDropdown && (
                <div className="card shadow-lg border-0 py-2 position-absolute bg-white rounded-3 mt-2 text-start" style={{ right: '15px', width: '240px', zIndex: 2000 }}>
                  <div className="px-3 py-2 border-bottom"><button className="btn btn-sm btn-primary w-100 fw-bold rounded" onClick={() => { setShowAuthModal(true); setShowMyActivityDropdown(false); }}>LOGIN / REGISTER</button></div>
                  <div className="px-3 pt-2 small fw-bold text-primary text-uppercase" style={{ fontSize: '0.75rem' }}>My Activity</div>
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small" onClick={() => { setCurrentPage("landing"); setActivityViewFilter("SHORTLISTED"); setShowMyActivityDropdown(false); }}>❤️ Shortlisted ({shortlistedList.length})</button>
                  <div className="p-2"><button className="btn btn-sm btn-success w-100 fw-bold rounded" onClick={() => { setCurrentPage("list-property-flow"); setShowMyActivityDropdown(false); }}>Post Property FREE</button></div>
                </div>
              )}
            </div>
            <button className="btn fw-bold px-3 py-1 rounded-3" style={{ backgroundColor: '#d4af37', color: '#1a1a1a', border: 'none' }} onClick={() => setCurrentPage("list-property-flow")}>Post Property <span className="badge bg-dark text-warning ms-1 small">FREE</span></button>
          </div>
        </div>
      </nav>

      {/* PUBLIC DISCOVERY LANDING CONSOLE */}
      {currentPage === "landing" && (
        <div>
          <header className="py-5 text-white text-center" style={{ background: "linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.9)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200') center/cover", padding: "80px 0" }}>
            <div className="container">
              <h1 className="fw-bold mb-4">Global Real Estate Search Console</h1>
              <div className="card shadow-lg p-4 mx-auto border-0 rounded-4 bg-white text-dark" style={{ maxWidth: '900px' }}>
                <div className="row g-2">
                  
                  {/* COMPLETELY AUTODETECTED & GLOBAL COUNTRY SELECTOR */}
                  <div className="col-md-3">
                    <select className="form-select fw-semibold" value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setKeywordSearch(""); }}>
                      {availableCountries.map((country, idx) => (
                        <option key={idx} value={country}>{country} 🌐</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Search city, sector, or placement (e.g. Noida, Times Square)..." value={keywordSearch} onChange={(e) => setKeywordSearch(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-primary w-100 fw-bold shadow-sm" style={{ backgroundColor: '#0056b3' }} onClick={executeSearchLog}>Search Hub</button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ASSET LIST GRID DISPLAY CARD RENDERING PLACEMENT */}
          <main className="container py-5">
            <h3 className="fw-bold mb-4 text-dark text-start">Available Matches in {selectedCountry} ({filteredProperties.length})</h3>
            
            <div className="row g-4 mb-5">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <div className="col-md-4" key={property.id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white position-relative">
                      <button type="button" className="btn position-absolute top-0 end-0 m-3 rounded-circle shadow p-2 bg-white" style={{ zIndex: 10, border: 'none' }} onClick={() => toggleShortlistStatus(property)}>
                        {shortlistedList.some(s => s.id === property.id) ? '❤️' : '🤍'}
                      </button>
                      
                      <img src={property.image} className="card-img-top" alt="" style={{ height: '200px', objectFit: 'cover' }} />
                      
                      <div className="card-body p-4 text-start">
                        <span className="badge bg-dark text-warning mb-2 px-3 py-1 rounded-pill">{property.type} ({property.subCategory})</span>
                        <h5 className="card-title fw-bold text-dark mb-1">{property.title}</h5>
                        <p className="card-text text-muted small mb-2">📍 {property.locality}, {property.city}</p>
                        
                        {/* THE GOOGLE MAPS ROUTE CONNECTOR ACTION BUTTON */}
                        <button 
                          type="button" 
                          className="btn btn-link p-0 text-decoration-none small text-primary fw-bold mb-3 d-block"
                          onClick={() => openGoogleNavigation(property.mapAddress)}
                        >
                          🗺️ View Navigation Route from My Location →
                        </button>

                        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
                          <span className="fs-5 fw-bold text-success">{property.priceDisplay}</span>
                          <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold" onClick={() => logContactAction(property)}>Contact Owner</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 py-4 text-center text-muted fs-5">No spaces matching your search query are live inside {selectedCountry} yet.</div>
              )}
            </div>

            {/* AUTOMATED GLOBAL MULTI-COUNTRY SEO FOOTER DIRECTORY CARD */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mt-5 bg-white text-start">
              <h3 className="fw-bold text-dark mb-1">Top Active Localities in {selectedCountry}</h3>
              <p className="text-muted small">Auto-generated crawl index for global placement matrices</p>
              
              <div className="row g-3 mt-2">
                {getDynamicLocalities().map((loc, index) => (
                  <div className="col-md-4" key={index}>
                    <button 
                      type="button" 
                      className="btn btn-link text-start text-decoration-none p-0 fw-semibold" 
                      style={{ color: '#0056b3' }}
                      onClick={() => { setKeywordSearch(loc.split(" ")[0]); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                    >
                      🏢 {activeIntent} in {loc}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>
      )}

      {/* PROPERTY SUBMISSION WORKFLOW COVERS AD CREATION ROUTING */}
      {currentPage === "list-property-flow" && (
        <main className="container py-5 text-start">
          <div className="mx-auto card shadow-lg border-0 p-4 rounded-4 bg-white" style={{ maxWidth: '520px' }}>
            <h4 className="fw-bold border-bottom pb-2 mb-3">Post Property Globally</h4>
            <form onSubmit={submitFinalListing}>
              <div className="mb-2"><label className="form-label small fw-bold mb-1">Listing Name</label><input type="text" className="form-control" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Executive Corporate Hub" /></div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Country Location</label>
                  <input type="text" className="form-control" required value={newCountry} onChange={(e) => setNewCountry(e.target.value)} placeholder="e.g. Australia" />
                </div>
                <div className="col-6"><label className="form-label small fw-bold mb-1">City</label><input type="text" className="form-control" required value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Sydney" /></div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6"><label className="form-label small fw-bold mb-1">Locality Sector</label><input type="text" className="form-control" required value={newLocality} onChange={(e) => setNewLocality(e.target.value)} placeholder="e.g. Circular Quay" /></div>
                <div className="col-6"><label className="form-label small fw-bold mb-1">Price</label><input type="number" className="form-control" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 75000" /></div>
              </div>
              <button type="submit" className="btn btn-warning w-100 fw-bold rounded-pill text-dark shadow-sm">Publish Active Listing Globally</button>
            </form>
          </div>
        </main>
      )}

      {/* AUTHENTICATION OVERLAY */}
      {showAuthModal && (
        <div className="modal-backdrop fade show" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow border-0 p-4 bg-white rounded-4 text-center" style={{ maxWidth: '400px', width: '90%' }}>
            <h3 className="fw-bold text-dark mb-4">Authentication Portal</h3>
            <input type="number" className="form-control text-center py-2 mb-3" placeholder="Enter phone connection link" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
            <button className="btn btn-primary w-100 fw-bold py-2 mb-2" onClick={() => setShowAuthModal(false)}>Continue</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
