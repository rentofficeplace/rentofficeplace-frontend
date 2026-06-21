import React, { useState, useEffect } from 'react';

// Live Database Schema Mock with Verification Control States
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
    isVerified: false, // Hidden from public browse queue until admin passes it
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600"
  }
];

// Managed System Administrators List
const INITIAL_ADMINS = [
  { id: 101, name: "Super Admin (Owner)", email: "owner@rentofficeplace.com", role: "SuperAdmin" },
  { id: 102, name: "Sub Admin Staff 01", email: "support@rentofficeplace.com", role: "SubAdmin", canDelete: false, canApprove: true }
];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  
  // Role Matrix Sessions
  const [activeUserRole, setActiveUserRole] = useState("SuperAdmin"); // SuperAdmin, SubAdmin, or Public User
  const [adminsList, setAdminsList] = useState(INITIAL_ADMINS);
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  
  // Public Filters
  const [propertyType, setPropertyType] = useState("Residential");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Auth/Form states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Residential");
  const [newSubCategory, setNewSubCategory] = useState("Apartment");
  const [newCity, setNewCity] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // Sync Public Browsing Array (Public only sees `isVerified: true`)
  useEffect(() => {
    const results = properties.filter(prop => {
      const matchesType = prop.type === propertyType;
      const cleanQuery = keywordSearch.toLowerCase().trim();
      const matchesKeyword = cleanQuery === "" || prop.city.toLowerCase().includes(cleanQuery) || prop.subCategory.toLowerCase().includes(cleanQuery);
      return prop.isVerified && matchesType && matchesKeyword;
    });
    setFilteredProperties(results);
  }, [properties, propertyType, keywordSearch]);

  // Operational Capabilities
  const toggleVerification = (id) => {
    // Both Super Admin and Sub Admins with shared approval rights can toggle verify state
    const currentSubAdmin = adminsList.find(a => a.role === "SubAdmin");
    if (activeUserRole === "SubAdmin" && !currentSubAdmin.canApprove) {
      alert("❌ Operational Access Denied: Super Admin has not granted you approval privileges.");
      return;
    }

    setProperties(properties.map(p => p.id === id ? { ...p, isVerified: !p.isVerified } : p));
  };

  const deletePropertyAd = (id) => {
    // STRICT GATE: Sub Admins cannot delete unless explicitly permitted by SuperAdmin configuration rule
    if (activeUserRole === "SubAdmin") {
      const permissions = adminsList.find(a => a.role === "SubAdmin");
      if (!permissions.canDelete) {
        alert("❌ Privilege Violation: Sub-Admins are strictly blocked from deleting production database elements.");
        return;
      }
    }
    
    if (window.confirm("Are you sure you want to permanently execute this deletion?")) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const adjustSubAdminRights = (setting, value) => {
    setAdminsList(adminsList.map(admin => 
      admin.role === "SubAdmin" ? { ...admin, [setting]: value } : admin
    ));
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* PROFESSIONAL MANAGEMENT HEADER BAR */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-2" style={{ backgroundColor: '#a81c1c' }}>
        <div className="container-fluid px-4">
          <span className="navbar-brand fs-3 fw-bold text-white me-4" onClick={() => setCurrentPage("landing")} style={{ cursor: 'pointer' }}>
            Rent<span style={{color: '#D4AF37'}}>Office</span>Place
          </span>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto align-items-center">
              <li className="nav-item px-2"><a className="nav-link text-white fw-semibold" href="#browse" onClick={() => setCurrentPage("landing")}>Browse Marketplace</a></li>
              
              {/* Internal System Link */}
              {(activeUserRole === "SuperAdmin" || activeUserRole === "SubAdmin") && (
                <li className="nav-item px-2">
                  <button className="btn btn-dark btn-sm text-warning border-warning fw-bold" onClick={() => setCurrentPage("admin-panel")}>
                    ⚙️ Control Console Console
                  </button>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center">
              {/* Simulation Environment Role Dropdown Switcher */}
              <select className="form-select form-select-sm bg-warning text-dark fw-bold me-3 border-0" style={{ width: '160px' }} value={activeUserRole} onChange={(e) => { setActiveUserRole(e.target.value); setCurrentPage("landing"); }}>
                <option value="SuperAdmin">👑 Super Admin View</option>
                <option value="SubAdmin">👤 Sub-Admin Staff</option>
                <option value="Public">🌐 Public Visitor Mode</option>
              </select>

              <button className="btn fw-bold px-3 py-1 rounded-3" style={{ backgroundColor: '#d4af37', color: '#1a1a1a', border: 'none' }} onClick={() => setCurrentPage("list-property-flow")}>Post Property FREE</button>
            </div>
          </div>
        </div>
      </nav>

      {/* VIEW PANEL 1: ADMIN CONTROL ROOM CONSOLE */}
      {currentPage === "admin-panel" && (
        <main className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-dark">System Governance Console</h2>
            <span className="badge bg-dark fs-6 text-warning">Active Identity Layer: {activeUserRole}</span>
          </div>

          {/* SUPER ADMIN CONSOLE CAPABILITY MATRIX */}
          {activeUserRole === "SuperAdmin" && (
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white mb-5">
              <h4 className="fw-bold text-danger border-bottom pb-2">🛡️ Privilege Delegation Console (Role Management)</h4>
              <p className="text-muted small">Configure exact operational scopes for assigned Sub-Admin support personnel.</p>
              
              <div className="table-responsive mt-3">
                <table className="table table-bordered align-middle bg-light text-start">
                  <thead className="table-dark">
                    <tr>
                      <th>Account Personnel</th>
                      <th>Email Route</th>
                      <th>Operational Allocation Scopes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminsList.filter(a => a.role === "SubAdmin").map(sub => (
                      <tr key={sub.id}>
                        <td className="fw-bold">{sub.name}</td>
                        <td>{sub.email}</td>
                        <td>
                          <div className="d-flex gap-4">
                            <div className="form-check form-switch">
                              <input className="form-check-input" type="checkbox" id="approveSwitch" checked={sub.canApprove} onChange={(e) => adjustSubAdminRights("canApprove", e.target.checked)} />
                              <label className="form-check-label small fw-semibold" htmlFor="approveSwitch">Grant Verification Approvals</label>
                            </div>
                            <div className="form-check form-switch">
                              <input className="form-check-input" type="checkbox" id="deleteSwitch" checked={sub.canDelete} onChange={(e) => adjustSubAdminRights("canDelete", e.target.checked)} />
                              <label className="form-check-label small fw-semibold text-danger" htmlFor="deleteSwitch">Allow Permanent Asset Deletions</label>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VERIFY & AUDIT RUNNING LISTINGS */}
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
            <h4 className="fw-bold text-dark border-bottom pb-2">📋 Asset Index & Fraud Pipeline Audit</h4>
            <div className="table-responsive mt-3">
              <table className="table table-hover text-start align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Photo preview</th>
                    <th>Property Title</th>
                    <th>Target Node</th>
                    <th>Audit Verification Status</th>
                    <th className="text-center">System Execution Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.image} alt="" className="rounded shadow-sm" style={{ width: '60px', height: '40px', objectFit: 'cover' }} /></td>
                      <td>
                        <div className="fw-bold">{p.title}</div>
                        <span className="text-muted small">📍 {p.city} | Sub: {p.subCategory}</span>
                      </td>
                      <td><span className="badge bg-secondary">{p.type}</span></td>
                      <td>
                        {p.isVerified ? (
                          <span className="badge bg-success px-3 py-1">✓ Live Verified</span>
                        ) : (
                          <span className="badge bg-warning text-dark px-3 py-1">⏳ Pending Sandbox Review</span>
                        )}
                      </td>
                      <td className="text-center">
                        <button className={`btn btn-sm me-2 fw-semibold ${p.isVerified ? 'btn-outline-secondary' : 'btn-success'}`} onClick={() => toggleVerification(p.id)}>
                          {p.isVerified ? "Revoke / Hide" : "Approve & Go Live"}
                        </button>
                        <button className="btn btn-sm btn-danger fw-bold" onClick={() => deletePropertyAd(p.id)}>
                          Delete Ad
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* VIEW PANEL 2: STANDARDISED PUBLIC LANDING */}
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
                  <div className="col-md-3"><button className="btn btn-primary w-100 fw-bold shadow-sm" style={{ backgroundColor: '#0056b3' }}>Search</button></div>
                </div>
              </div>
            </div>
          </header>

          <main className="container py-5">
            <h3 className="fw-bold mb-4 text-dark text-start">Available Verified Placements ({filteredProperties.length})</h3>
            <div className="row g-4">
              {filteredProperties.map(property => (
                <div className="col-md-4" key={property.id}>
                  <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                    <img src={property.image} className="card-img-top" alt="" style={{ height: '200px', objectFit: 'cover' }} />
                    <div className="card-body p-4">
                      <span className="badge bg-dark text-warning mb-2 px-3 py-1 rounded-pill">{property.type}</span>
                      <h5 className="card-title fw-bold text-dark">{property.title}</h5>
                      <p className="card-text text-muted mb-2">📍 {property.locality}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* VIEW PANEL 3: USER AD ENTRY FLOW */}
      {currentPage === "list-property-flow" && (
        <main className="container py-5">
          <div className="mx-auto" style={{ maxWidth: '550px' }}>
            <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
              <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">Post Property Details</h4>
              <form onSubmit={triggerInitialSubmit}>
                <div className="mb-3"><label className="form-label small fw-bold mb-1">Listing Name / Title</label><input type="text" className="form-control" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Luxury Penthouse Suite" /></div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold mb-1">Category</label>
                    <select className="form-select" value={newType} onChange={(e) => { setNewType(e.target.value); setNewSubCategory(e.target.value === 'Commercial' ? 'Shop' : 'Apartment'); }}>
                      <option value="Residential">Residential</option><option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold mb-1">Sub-type</label>
                    {newType === 'Commercial' ? (
                      <select className="form-select" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
                        <option value="Shop">Shop 🛍️</option><option value="Warehouse">Warehouse 📦</option><option value="Clinic">Clinic 🩺</option><option value="Factory">Factory 🏭</option>
                      </select>
                    ) : (
                      <select className="form-select" value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
                        <option value="Apartment">Apartment Flat</option><option value="Villa">Villa</option>
                      </select>
                    )}
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6"><label className="form-label small fw-bold mb-1">City Location</label><input type="text" className="form-control" required value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Noida" /></div>
                  <div className="col-6"><label className="form-label small fw-bold mb-1">Monthly Cost (INR)</label><input type="number" className="form-control" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 50000" /></div>
                </div>
                <button type="submit" className="btn btn-warning w-100 fw-bold rounded-pill text-dark mt-2 shadow-sm">Submit securely for Verification</button>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* SIMULATED PASS GATE MODAL */}
      {showAuthModal && (
        <div className="modal-backdrop fade show" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card shadow border-0 p-4 bg-white rounded-4 p-4 text-center" style={{ maxWidth: '400px', width: '90%' }}>
            <h4 className="fw-bold mb-3">Security Processing Gateway</h4>
            <p className="small text-muted mb-4">To prevent fraud, new user listings pass through an isolated sandboxed verification holding tier before deployment.</p>
            <button type="button" className="btn btn-primary w-100 fw-bold py-2" onClick={() => {
              const item = { id: properties.length + 1, title: newTitle, intent: "Rent", type: newType, subCategory: newSubCategory, locality: "Pending Evaluation Zone", city: newCity, priceDisplay: `₹${parseInt(newPrice).toLocaleString()} / month`, isVerified: false, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600" };
              setProperties([...properties, item]);
              setShowAuthModal(false);
              setCurrentPage("landing");
              alert("🚀 Submission Secured! Listing routed to Admin holding tier for compliance verification.");
            }}>Acknowledge & Route to Admin</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
