import React, { useState, useEffect } from 'react';

// Enhanced Global Database Template with multiple countries and sub-localities
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
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600"
  }
];

// Scalable Local SEO Matrix mapping top hotspots dynamically by country
const SEO_LOCALITY_MAP = {
  "India": {
    cities: ["Gurugram", "Noida", "Delhi"],
    categories: [
      { heading: "New Projects", items: ["Sector 56 Gurugram", "Sohna Hotspot", "Sector 52 Gurugram"] },
      { heading: "Flats & Apartments", items: ["Sohna Road", "Sector 79 Gurugram", "Sector 102 Gurugram"] },
      { heading: "Commercial & Office Spaces", items: ["Sector 62 Noida", "Cyber City Gurugram", "Connaught Place"] }
    ]
  },
  "United States": {
    cities: ["New York", "Los Angeles", "Chicago"],
    categories: [
      { heading: "Executive Hubs", items: ["Times Square NY", "Financial District LA", "Loop Chicago"] },
      { heading: "Premium Penthouses", items: ["Manhattan Luxury", "Beverly Hills Estates", "Gold Coast Chicago"] },
      { heading: "Warehouses & Logistics", items: ["Brooklyn Docks", "Long Beach Terminal", "O'Hare Logistics"] }
    ]
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [listingStep, setListingStep] = useState(1);

  // Active Role State Management System
  const [activeUserRole, setActiveUserRole] = useState("Public");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  
  // Public Filter Elements
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);

  // UI State Toggles
  const [showMyActivityDropdown, setShowMyActivityDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // User Activity Tracking Registries
  const [recentlySearched, setRecentlySearched] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [shortlistedList, setShortlistedList] = useState([]);
  const [contactedList, setContactedList] = useState([]);

  const [activityViewFilter, setActivityViewFilter] = useState("ALL");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Post Listing Fields
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Residential");
  const [newSubCategory, setNewSubCategory] = useState("Apartment");
  const [newCity, setNewCity] = useState("");
  const [newPrice, setNewPrice] = useState("");

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

  const executeSearchLog = () => {
    if (keywordSearch.trim() !== "" && !recentlySearched.includes(keywordSearch)) {
      setRecentlySearched([keywordSearch, ...recentlySearched.slice(0, 4)]);
    }
  };

  const trackPropertyView = (property) => {
    if (!recentlyViewed.some(p => p.id === property.id)) {
      setRecentlyViewed([property, ...recentlyViewed.slice(0, 4)]);
    }
    alert(`📖 Opened Details View for: ${property.title}`);
  };

  const toggleShortlistStatus = (property) => {
    if (shortlistedList.some(p => p.id === property.id)) {
      setShortlistedList(shortlistedList.filter(p => p.id !== property.id));
    } else {
      setShortlistedList([property, ...shortlistedList]);
    }
  };

  const logContactAction = (property) => {
    if (!contactedList.some(p => p.id === property.id)) {
      setContactedList([property, ...contactedList]);
    }
    alert(`📞 Owner details requested for: ${property.title}`);
  };

  // Click handler to inject SEO link text directly into active search bar
  const handleSeoLinkClick = (localityName) => {
    setKeywordSearch(localityName);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', position: 'relative' }} onClick={() => setShowMyActivityDropdown(false)}>
      
      {/* HEADER SHORTCUT NAVIGATION BAR */}
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
            {activeUserRole === "SuperAdmin" && (
              <button className="btn btn-dark btn-sm text-warning border-warning fw-bold me-3 px-3" onClick={() => setCurrentPage("admin-panel")}>⚙️ Admin Control Panel</button>
            )}

            <div className="position-relative" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="btn btn-link text-white text-decoration-none me-3 fw-semibold border border-white-50 rounded px-3 py-1" style={{ fontSize: '0.92rem' }} onClick={() => setShowMyActivityDropdown(!showMyActivityDropdown)}>
                👤 Sign In / My Activity {showMyActivityDropdown ? '▲' : '▼'}
              </button>

              {showMyActivityDropdown && (
                <div className="card shadow-lg border-0 py-2 position-absolute bg-white rounded-3 mt-2 text-start" style={{ right: '15px', width: '240px', zIndex: 2000 }}>
                  <div className="px-3 py-2 border-bottom">
                    <button className="btn btn-sm btn-primary w-100 fw-bold rounded" onClick={() => { setShowAuthModal(true); setShowMyActivityDropdown(false); }}>LOGIN / REGISTER</button>
                  </div>
                  <div className="px-3 pt-2 small fw-bold text-primary text-uppercase" style={{ fontSize: '0.75rem' }}>My Activity</div>
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small" onClick={() => { setCurrentPage("landing"); setActivityViewFilter("SEARCHED"); setShowMyActivityDropdown(false); }}>🔍 Recently Searched ({recentlySearched.length})</button>
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small" onClick={() => { setCurrentPage("landing"); setActivityViewFilter("VIEWED"); setShowMyActivityDropdown(false); }}>👁️ Recently Viewed ({recentlyViewed.length})</button>
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small" onClick={() => { setCurrentPage("landing"); setActivityViewFilter("SHORTLISTED"); setShowMyActivityDropdown(false); }}>❤️ Shortlisted ({shortlistedList.length})</button>
                  <div className="p-2"><button className="btn btn-sm btn-success w-100 fw-bold rounded" onClick={() => { setCurrentPage("list-property-flow"); setShowMyActivityDropdown(false); }}>Post Property FREE</button></div>
                </div>
              )}
            </div>
            <button className="btn fw-bold px-3 py-1 rounded-3" style={{ backgroundColor: '#d4af37', color: '#1a1a1a', border: 'none' }} onClick={() => setCurrentPage("list-property-flow")}>Post Property <span className="badge bg-dark text-warning ms-1 small">FREE</span></button>
          </div>
        </div>
      </nav>

      {/* PUBLIC EXPLORATION MAIN HOME MAP */}
      {currentPage === "landing" && (
        <div>
          <header className="py-5 text-white text-center" style={{ background: "linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.9)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200') center/cover", padding: "80px 0" }}>
            <div className="container">
              <h1 className="fw-bold mb-4">Global Real Estate Search Console</h1>
              <div className="card shadow-lg p-4 mx-auto border-0 rounded-4 bg-white text-dark" style={{ maxWidth: '850px' }}>
                <div className="row g-2">
                  <div className="col-md-3">
                    <select className="form-select fw-semibold" value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setKeywordSearch(""); }}>
                      <option value="India">India 🇮🇳</option>
                      <option value="United States">United States 🇺🇸</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Search city, sector, or classification (e.g. Noida, Warehouse)..." value={keywordSearch} onChange={(e) => setKeywordSearch(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-primary w-100 fw-bold shadow-sm" style={{ backgroundColor: '#0056b3' }} onClick={executeSearchLog}>Search Hub</button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* DYNAMIC LISTINGS DISPLAY */}
          <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0 text-dark">
                {activityViewFilter === "ALL" && `Verified Active Listings in ${selectedCountry} (${filteredProperties.length})`}
                {activityViewFilter === "SHORTLISTED" && `Your Shortlisted Luxury Units (${shortlistedList.length})`}
              </h3>
              {activityViewFilter !== "ALL" && <button className="btn btn-outline-dark btn-sm rounded-pill fw-bold" onClick={() => setActivityViewFilter("ALL")}>Clear Activity Filter ✕</button>}
            </div>

            <div className="row g-4 mb-5">
              {filteredProperties.length > 0 ? (
                (activityViewFilter === "ALL" ? filteredProperties : shortlistedList).map(property => (
                  <div className="col-md-4" key={property.id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white position-relative">
                      <button type="button" className="btn position-absolute top-0 end-0 m-3 rounded-circle shadow p-2 bg-white" style={{ zIndex: 10, border: 'none' }} onClick={() => toggleShortlistStatus(property)}>
                        {shortlistedList.some(s => s.id === property.id) ? '❤️' : '🤍'}
                      </button>
                      <img src={property.image} className="card-img-top" alt="" style={{ height: '200px', objectFit: 'cover' }} onClick={() => trackPropertyView(property)} />
                      <div className="card-body p-4 text-start">
                        <span className="badge bg-dark text-warning mb-2 px-3 py-1 rounded-pill">{property.type} ({property.subCategory})</span>
                        <h5 className="card-title fw-bold text-dark mb-1">{property.title}</h5>
                        <p className="card-text text-muted small mb-3">📍 {property.locality}, {property.city}</p>
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

            {/* ========================================================
                IMPROVISED HIGH-FIDELITY DYNAMIC DYNAMIC SEO LOCALITY FOOTER MATRIX
                ======================================================== */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mt-5 bg-white text-start">
              <h3 className="fw-bold text-dark mb-1">Top Localities in {selectedCountry}</h3>
              
              {/* Intent Selector Toggles */}
              <div className="d-flex border-bottom my-3">
                <button className={`btn fw-bold px-3 py-2 border-bottom border-3 rounded-0 ${activeIntent === 'Buy' ? 'border-primary text-primary' : 'border-transparent text-muted'}`} onClick={() => setActiveIntent("Buy")}>Buy</button>
                <button className={`btn fw-bold px-3 py-2 border-bottom border-3 rounded-0 ${activeIntent === 'Rent' ? 'border-primary text-primary' : 'border-transparent text-muted'}`} onClick={() => setActiveIntent("Rent")}>Rent / Lease</button>
              </div>

              {/* Dynamic 3-Column Locality Matrix Engine */}
              <div className="row g-4">
                {SEO_LOCALITY_MAP[selectedCountry]?.categories.map((category, colIndex) => (
                  <div className="col-md-4" key={colIndex}>
                    <h6 className="fw-bold text-dark mb-3">{category.heading} in Top Localities of {selectedCountry}</h6>
                    <div className="d-flex flex-column gap-2">
                      {category.items.map((item, itemIndex) => (
                        <button 
                          key={itemIndex}
                          type="button"
                          className="btn btn-link text-start text-decoration-none p-0 text-muted small-hover fw-medium"
                          style={{ color: '#0056b3', fontSize: '0.92rem' }}
                          onClick={() => handleSeoLinkClick(item.split(" ")[0])}
                        >
                          {item}
                        </button>
                      ))}
                      <button className="btn btn-link text-start text-decoration-none p-0 text-secondary fw-semibold mt-1" style={{ fontSize: '0.85rem' }}>View 14 More →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>
      )}

      {/* RETAINED PLATFORM INTERFACES FOR RUNTIME SYSTEM INTEGRITY */}
      {currentPage === "list-property-flow" && (
        <main className="container py-5 text-start">
          <div className="mx-auto card shadow p-4 rounded-4 bg-white" style={{ maxWidth: '500px' }}>
            <h4 className="fw-bold border-bottom pb-2">List Property Securely</h4>
            <div className="mb-3"><label className="form-label small fw-bold">Title Name</label><input type="text" className="form-control" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Executive Corporate Hub" /></div>
            <button className="btn btn-primary w-100 fw-bold py-2 mt-2" onClick={() => {
              const item = { id: properties.length + 1, title: newTitle, intent: activeIntent, type: newType, subCategory: newSubCategory, locality: "Verified Hub", city: newCity, country: selectedCountry, priceDisplay: `₹50,000 / month`, isVerified: true };
              setProperties([...properties, item]); setCurrentPage("landing"); alert("Listing pushed seamlessly!");
            }}>Publish Space Ad</button>
          </div>
        </main>
      )}

      {currentPage === "admin-panel" && (
        <main className="container py-5 text-start">
          <h2 className="fw-bold mb-4">Platform Governance Panel</h2>
          <div className="card shadow-sm border-0 p-4 bg-white rounded-4">
            {properties.map(p => (
              <div key={p.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div><strong>{p.title}</strong></div>
                <button className="btn btn-sm btn-danger fw-bold" onClick={() => setProperties(properties.filter(item => item.id !== p.id))}>Delete Listing</button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* LOGIN MODAL */}
      {showAuthModal && (
        <div className="modal-backdrop fade show" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow border-0 p-4 bg-white rounded-4 text-start" style={{ maxWidth: '440px', width: '92%' }}>
            <button type="button" className="btn-close position-absolute" style={{ top: '20px', right: '22px', border: 'none', background: 'none' }} onClick={() => setShowAuthModal(false)}>✕</button>
            <h3 className="fw-bold text-dark mt-2 mb-1">Login / Register</h3>
            <button type="button" className="btn w-100 fw-bold py-2 text-white my-3" style={{ backgroundColor: '#6cbdff' }} onClick={() => { setActiveUserRole("SuperAdmin"); setShowAuthModal(false); setCurrentPage("admin-panel"); }}>👑 Launch Super Admin Panel →</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
