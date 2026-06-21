import React, { useState, useEffect } from 'react';

// Unified Initial Properties Database Template
const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Luxury 3 BHK Residential Apartment",
    intent: "Rent",
    type: "Residential",
    subCategory: "Apartment",
    locality: "DLF Phase 3, Gurugram",
    city: "Gurugram",
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
    locality: "Sector 62, Noida",
    city: "Noida",
    priceDisplay: "₹1,85,000 / month",
    isVerified: true,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600"
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [listingStep, setListingStep] = useState(1);

  // Active Role State Management System
  const [activeUserRole, setActiveUserRole] = useState("Public"); // "SuperAdmin" or "Public"
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  
  // Public Filter Elements
  const [propertyType, setPropertyType] = useState("Residential");
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

  // Post Listing Fields
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Residential");
  const [newSubCategory, setNewSubCategory] = useState("Apartment");
  const [newCity, setNewCity] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const results = properties.filter(prop => {
      const matchesType = prop.type === propertyType;
      const cleanQuery = keywordSearch.toLowerCase().trim();
      const matchesKeyword = cleanQuery === "" || prop.city.toLowerCase().includes(cleanQuery) || prop.subCategory.toLowerCase().includes(cleanQuery);
      return prop.isVerified && matchesType && matchesKeyword;
    });
    setFilteredProperties(results);
  }, [properties, propertyType, keywordSearch]);

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

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', position: 'relative' }} onClick={() => setShowMyActivityDropdown(false)}>
      
      {/* ========================================================
          HIGH-FIDELITY ALIGNED HEADER SHORTCUT NAVIGATION BAR
          ======================================================== */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-3" style={{ backgroundColor: '#a81c1c' }}>
        <div className="container px-4">
          
          {/* Brand Logo Anchor */}
          <span className="navbar-brand fs-3 fw-bold text-white me-5" onClick={() => { setCurrentPage("landing"); setActivityViewFilter("ALL"); }} style={{ cursor: 'pointer' }}>
            Rent<span style={{color: '#D4AF37'}}>Office</span>Place
          </span>

          {/* High-Visibility Navigation Shortcuts (Buy, Rent, Sell) */}
          <div className="d-flex align-items-center me-auto">
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-6 hover-opacity" onClick={() => { setCurrentPage("landing"); setActiveIntent("Buy"); setActivityViewFilter("ALL"); }}>
              Buy ▾
            </button>
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-6 hover-opacity" onClick={() => { setCurrentPage("landing"); setActiveIntent("Rent"); setActivityViewFilter("ALL"); }}>
              Rent ▾
            </button>
            <button className="btn btn-link text-white fw-bold text-decoration-none px-3 fs-6 hover-opacity" onClick={() => setCurrentPage("list-property-flow")}>
              Sell ▾
            </button>
          </div>

          <div className="d-flex align-items-center">
            {/* Dynamic Governance Portal Shortcut Hook */}
            {activeUserRole === "SuperAdmin" && (
              <button className="btn btn-dark btn-sm text-warning border-warning fw-bold me-3 px-3" onClick={() => setCurrentPage("admin-panel")}>
                ⚙️ Admin Control Panel
              </button>
            )}

            {/* User Dropdown Action Group */}
            <div className="position-relative" onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="btn btn-link text-white text-decoration-none me-3 fw-semibold border border-white-50 rounded px-3 py-1" 
                style={{ fontSize: '0.92rem' }}
                onClick={() => setShowMyActivityDropdown(!showMyActivityDropdown)}
              >
                👤 Sign In / My Activity {showMyActivityDropdown ? '▲' : '▼'}
              </button>

              {showMyActivityDropdown && (
                <div className="card shadow-lg border-0 py-2 position-absolute bg-white rounded-3 mt-2 text-start animate__animated animate__fadeIn" style={{ right: '15px', width: '240px', zIndex: 2000 }}>
                  <div className="px-3 py-2 border-bottom">
                    <button className="btn btn-sm btn-primary w-100 fw-bold rounded" onClick={() => { setShowAuthModal(true); setShowMyActivityDropdown(false); }}>LOGIN / REGISTER</button>
                  </div>
                  
                  <div className="px-3 pt-2 small fw-bold text-primary text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>My Activity</div>
                  
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small" style={{ fontSize: '0.9rem' }} onClick={() => { setCurrentPage("landing"); setActivityViewFilter("SEARCHED"); setShowMyActivityDropdown(false); }}>
                    🔍 Recently Searched ({recentlySearched.length})
                  </button>
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small" style={{ fontSize: '0.9rem' }} onClick={() => { setCurrentPage("landing"); setActivityViewFilter("VIEWED"); setShowMyActivityDropdown(false); }}>
                    👁️ Recently Viewed ({recentlyViewed.length})
                  </button>
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small" style={{ fontSize: '0.9rem' }} onClick={() => { setCurrentPage("landing"); setActivityViewFilter("SHORTLISTED"); setShowMyActivityDropdown(false); }}>
                    ❤️ Shortlisted ({shortlistedList.length})
                  </button>
                  <button className="btn btn-link w-100 text-start text-dark text-decoration-none px-3 py-1 small border-bottom pb-2" style={{ fontSize: '0.9rem' }} onClick={() => { setCurrentPage("landing"); setActivityViewFilter("CONTACTED"); setShowMyActivityDropdown(false); }}>
                    📞 Contacted ({contactedList.length})
                  </button>

                  <div className="p-2">
                    <button className="btn btn-sm btn-success w-100 fw-bold rounded" onClick={() => { setCurrentPage("list-property-flow"); setShowMyActivityDropdown(false); }}>Post Property FREE</button>
                  </div>
                </div>
              )}
            </div>

            <button className="btn fw-bold px-3 py-1 rounded-3" style={{ backgroundColor: '#d4af37', color: '#1a1a1a', border: 'none', fontSize: '0.95rem' }} onClick={() => setCurrentPage("list-property-flow")}>Post Property <span className="badge bg-dark text-warning ms-1 small">FREE</span></button>
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
                  <div className="col-md-4">
                    <select className="form-select fw-semibold" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                      <option value="Residential">Residential 🏠</option>
                      <option value="Commercial">Commercial 🏢</option>
                    </select>
                  </div>
                  <div className="col-md-5">
                    <input type="text" className="form-control" placeholder="Search city or specific type (e.g. Noida)..." value={keywordSearch} onChange={(e) => setKeywordSearch(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-primary w-100 fw-bold shadow-sm" style={{ backgroundColor: '#0056b3' }} onClick={executeSearchLog}>Search Fields</button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0 text-dark">
                {activityViewFilter === "ALL" && `Verified Active Listings (${filteredProperties.length})`}
                {activityViewFilter === "SEARCHED" && "Your Recent Search Phrases History"}
                {activityViewFilter === "VIEWED" && `Recently Viewed Spaces Engine (${recentlyViewed.length})`}
                {activityViewFilter === "SHORTLISTED" && `Your Shortlisted Luxury Units (${shortlistedList.length})`}
                {activityViewFilter === "CONTACTED" && `Owners You Have Contacted (${contactedList.length})`}
              </h3>
              {activityViewFilter !== "ALL" && (
                <button className="btn btn-outline-dark btn-sm rounded-pill fw-bold" onClick={() => setActivityViewFilter("ALL")}>Clear Activity Filter ✕</button>
              )}
            </div>

            <div className="row g-4">
              {activityViewFilter === "SEARCHED" ? (
                <div className="col-12 text-start">
                  <ul className="list-group shadow-sm bg-white border-0 rounded-3">
                    {recentlySearched.length > 0 ? recentlySearched.map((term, i) => (
                      <li key={i} className="list-group-item py-3 fw-semibold text-secondary">🔍 Keyword Phrase Query: "{term}"</li>
                    )) : <li className="list-group-item py-4 text-center text-muted">No keywords registered in this browser segment yet.</li>}
                  </ul>
                </div>
              ) : (
                (activityViewFilter === "ALL" ? filteredProperties :
                 activityViewFilter === "VIEWED" ? recentlyViewed :
                 activityViewFilter === "SHORTLISTED" ? shortlistedList : contactedList).map(property => (
                  <div className="col-md-4" key={property.id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white position-relative">
                      <button type="button" className="btn position-absolute top-0 end-0 m-3 rounded-circle shadow p-2 bg-white" style={{ zIndex: 10, border: 'none' }} onClick={() => toggleShortlistStatus(property)}>
                        {shortlistedList.some(s => s.id === property.id) ? '❤️' : '🤍'}
                      </button>
                      <img src={property.image} className="card-img-top" alt="" style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => trackPropertyView(property)} />
                      <div className="card-body p-4 text-start">
                        <span className="badge bg-dark text-warning mb-2 px-3 py-1 rounded-pill">{property.type}</span>
                        <h5 className="card-title fw-bold text-dark mb-1" style={{ cursor: 'pointer' }} onClick={() => trackPropertyView(property)}>{property.title}</h5>
                        <p className="card-text text-muted small mb-3">📍 {property.locality}</p>
                        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
                          <span className="fs-5 fw-bold text-success">{property.priceDisplay}</span>
                          <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold" onClick={() => logContactAction(property)}>Contact Owner</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      )}

      {/* PROPERTY AD CREATION LAYOUT SCREEN */}
      {currentPage === "list-property-flow" && (
        <main className="container py-5 text-start">
          <div className="mx-auto card shadow p-4 rounded-4 bg-white" style={{ maxWidth: '500px' }}>
            <h4 className="fw-bold border-bottom pb-2">List Property Securely</h4>
            <div className="mb-3"><label className="form-label small fw-bold">Title Name</label><input type="text" className="form-control" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Executive Corporate Hub" /></div>
            <button className="btn btn-primary w-100 fw-bold py-2 mt-2" onClick={() => {
              const item = { id: properties.length + 1, title: newTitle, intent: "Rent", type: newType, subCategory: newSubCategory, locality: "Verified Hub", city: newCity, priceDisplay: `₹${newPrice || '50,000'} / month`, isVerified: true, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600" };
              setProperties([...properties, item]);
              setCurrentPage("landing");
              alert("Listing pushed seamlessly into database layer!");
            }}>Publish Space Ad</button>
          </div>
        </main>
      )}

      {/* PLATFORM SUPER GOVERNANCE DASHBOARD */}
      {currentPage === "admin-panel" && (
        <main className="container py-5 text-start">
          <h2 className="fw-bold mb-4">Platform Governance Panel</h2>
          <div className="card shadow-sm border-0 p-4 bg-white rounded-4">
            <h5 className="fw-bold border-bottom pb-2 mb-3">Audit Logs Pipeline</h5>
            {properties.map(p => (
              <div key={p.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div><strong>{p.title}</strong><br/><span className="small text-muted">{p.city}</span></div>
                <button className="btn btn-sm btn-danger fw-bold" onClick={() => setProperties(properties.filter(item => item.id !== p.id))}>Delete Listing</button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ========================================================
          UPGRADED LOGIN / REGISTER GATEWAY MODAL (WITH UPFRONT ADMIN ACCESS LINK)
          ======================================================== */}
      {showAuthModal && (
        <div className="modal-backdrop fade show" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow border-0 p-4 bg-white rounded-4 text-start" style={{ maxWidth: '440px', width: '92%' }}>
            <button type="button" className="btn-close position-absolute" style={{ top: '20px', right: '22px', border: 'none', background: 'none', fontSize: '1.25rem' }} onClick={() => setShowAuthModal(false)}>✕</button>
            
            <h3 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: '1.65rem' }}>Login / Register</h3>
            <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>Please enter your Phone Number</p>
            
            <form onSubmit={(e) => { e.preventDefault(); setActiveUserRole("Public"); setShowAuthModal(false); alert("Logged in successfully as Customer User!"); }}>
              <div className="mb-4 p-2 rounded-3 border d-flex align-items-center" style={{ backgroundColor: '#fff', borderColor: '#4a90e2', borderWidth: '1.5px' }}>
                <div className="pe-2 border-end d-flex align-items-center">
                  <select className="form-select border-0 bg-transparent py-0 shadow-none fw-semibold text-dark" style={{ width: '75px' }}>
                    <option value="+91">+91</option>
                  </select>
                </div>
                <input type="number" className="form-control border-0 bg-transparent shadow-none fs-5 ps-3 py-1" required placeholder="Enter number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
              </div>
              <button type="submit" className="btn w-100 fw-bold py-2 text-white mb-3 shadow-sm rounded-3" style={{ backgroundColor: '#6cbdff', borderColor: '#6cbdff' }}>Continue</button>
            </form>
            
            <button type="button" className="btn btn-outline-dark w-100 py-2 rounded-3 d-flex align-items-center justify-content-center fw-bold mb-3" style={{ borderColor: '#d3d3d3', color: '#092143' }}>✉ Login with Email</button>
            
            {/* UPFRONT SUPER ADMIN PORTAL TOGGLE LINK */}
            <div className="text-center p-2 rounded mb-3 style-none" style={{ backgroundColor: '#fff9e6', border: '1px dashed #d4af37' }}>
              <span className="small text-muted me-1">Internal Personnel Authorization?</span>
              <button 
                type="button" 
                className="btn btn-link btn-sm p-0 fw-bold text-warning text-decoration-none"
                onClick={() => {
                  setActiveUserRole("SuperAdmin");
                  setShowAuthModal(false);
                  setCurrentPage("admin-panel");
                  alert("👑 System Authorization Granted! Welcome to the Super Admin Dashboard.");
                }}
              >
                Launch Super Admin Panel →
              </button>
            </div>

            <div className="text-center text-muted border-top pt-3" style={{ fontSize: '0.72rem' }}>By clicking you agree to <a href="#terms" className="text-primary text-decoration-none fw-semibold">Terms and Conditions</a></div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
