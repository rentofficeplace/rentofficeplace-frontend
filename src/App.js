import React, { useState } from 'react';

// Premium Mock Data incorporating Residential, Commercial, Budgets, and Details
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Premium Corporate Office Suite",
    intent: "Rent",
    type: "Commercial",
    locality: "Sector 62",
    city: "Noida",
    price: 85000, 
    priceDisplay: "₹85,000 / month",
    configuration: "Fully Furnished",
    size: "2,500 sq ft",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600"
  },
  {
    id: 2,
    title: "Luxury 3 BHK Residential Apartment",
    intent: "Rent",
    type: "Residential",
    locality: "DLF Phase 3",
    city: "Gurugram",
    price: 65000,
    priceDisplay: "₹65,000 / month",
    configuration: "3 BHK",
    size: "1,800 sq ft",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
  },
  {
    id: 3,
    title: "Modern Co-Working Smart Desk",
    intent: "Rent",
    type: "Commercial",
    locality: "CBD",
    city: "Sydney",
    price: 35000,
    priceDisplay: "₹35,000 / month",
    configuration: "Hot Desk",
    size: "Flexible",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=600"
  },
  {
    id: 4,
    title: "Ultra-Luxury 4 BHK Penthouse",
    intent: "Buy",
    type: "Residential",
    locality: "Golf Course Road",
    city: "Gurugram",
    price: 45000000,
    priceDisplay: "₹4.5 Crores",
    configuration: "4 BHK",
    size: "4,200 sq ft",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600"
  }
];

function App() {
  // 99acres-Inspired Filter States
  const [activeIntent, setActiveIntent] = useState("Rent"); // Buy or Rent Toggle
  const [searchQuery, setSearchQuery] = useState(""); // Locality / City Input
  const [propertyType, setPropertyType] = useState("Commercial"); // Commercial or Residential Selector
  const [maxBudget, setMaxBudget] = useState(""); // Budget Limit
  
  const [filteredProperties, setFilteredProperties] = useState(
    MOCK_PROPERTIES.filter(p => p.intent === "Rent" && p.type === "Commercial")
  );

  const handleSearch = () => {
    const results = MOCK_PROPERTIES.filter(prop => {
      const matchesIntent = prop.intent === activeIntent;
      const matchesType = prop.type === propertyType;
      
      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchesLocation = cleanQuery === "" || 
        prop.city.toLowerCase().includes(cleanQuery) || 
        prop.locality.toLowerCase().includes(cleanQuery);
        
      const matchesBudget = maxBudget === "" || prop.price <= parseInt(maxBudget);

      return matchesIntent && matchesType && matchesLocation && matchesBudget;
    });
    setFilteredProperties(results);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* BRAND HEADER */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 shadow-sm">
        <div className="container">
          <span className="fs-3 fw-bold text-white">Rent<span style={{color: '#D4AF37'}}>Office</span>Place</span>
          <div className="ms-auto">
            <button className="btn btn-warning px-4 fw-bold rounded-pill">Post Property FREE</button>
          </div>
        </div>
      </nav>

      {/* 99ACRES INSPIRED SEARCH CONSOLE */}
      <header className="py-5" style={{
        background: "linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.85)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200') center/cover",
        padding: "100px 0"
      }}>
        <div className="container text-center text-white">
          <h1 className="fw-bold mb-2 fs-2">Find your choice of Commercial & Residential Spaces</h1>
          <p className="text-light-50 mb-4">Over verified corporate hubs and luxury residences at your fingertips</p>

          <div className="mx-auto" style={{ maxWidth: '850px' }}>
            {/* INTENT TABS */}
            <div className="d-flex mb-0 bg-light p-1 rounded-top-4 d-inline-flex shadow">
              <button 
                className={`btn px-4 fw-bold rounded-3 ${activeIntent === 'Rent' ? 'btn-warning text-dark' : 'btn-light text-muted'}`}
                onClick={() => { setActiveIntent('Rent'); }}
              >
                Rent
              </button>
              <button 
                className={`btn px-4 fw-bold rounded-3 ${activeIntent === 'Buy' ? 'btn-warning text-dark' : 'btn-light text-muted'}`}
                onClick={() => { setActiveIntent('Buy'); }}
              >
                Buy
              </button>
            </div>

            {/* MAIN WIDGET BOX */}
            <div className="card shadow-lg p-4 bg-white text-dark border-0 rounded-bottom-4 rounded-end-4">
              <div className="row g-2 align-items-center">
                
                {/* LOCATION FIELD */}
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted border-end-0"><i className="bi bi-search"></i>📍</span>
                    <input 
                      type="text" 
                      className="form-control border-start-0" 
                      placeholder="Enter City or Locality (e.g. Noida)" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* PROPERTY TYPE */}
                <div className="col-md-3">
                  <select className="form-select text-muted fw-semibold" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="Commercial">Commercial Property</option>
                    <option value="Residential">Residential Property</option>
                  </select>
                </div>

                {/* BUDGET DROPDOWN */}
                <div className="col-md-3">
                  <select className="form-select text-muted fw-semibold" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)}>
                    <option value="">Select Max Budget</option>
                    <option value="50000">Up to ₹50,000</option>
                    <option value="100000">Up to ₹1,00,000</option>
                    <option value="50000000">Up to ₹5 Crores</option>
                  </select>
                </div>

                {/* SEARCH ACTION BUTTON */}
                <div className="col-md-2">
                  <button className="btn btn-primary w-100 fw-bold py-2 shadow-sm" onClick={handleSearch} style={{ backgroundColor: '#0056b3' }}>
                    Search
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* RENDER DYNAMIC CARDS */}
      <main className="container py-5">
        <h3 className="fw-bold mb-4 text-dark text-start">Resulting Premium Matches ({filteredProperties.length})</h3>
        <div className="row g-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <div className="col-md-4" key={property.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                  <div className="position-relative">
                    <img src={property.image} className="card-img-top" alt={property.title} style={{ height: '200px', objectFit: 'cover' }} />
                    <span className="position-absolute top-0 start-0 m-3 badge bg-dark text-warning fw-bold px-3 py-2 rounded-pill shadow">
                      For {property.intent}
                    </span>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-uppercase fw-bold text-xs tracking-wider text-primary small">{property.type}</span>
                      <span className="text-muted small fw-medium">📐 {property.size}</span>
                    </div>
                    <h5 className="card-title fw-bold text-dark mb-1">{property.title}</h5>
                    <p className="card-text text-muted mb-3 fs-6">📍 {property.locality}, {property.city}</p>
                    
                    <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
                      <div>
                        <span className="text-xs text-muted d-block uppercase small fw-semibold">Price Value</span>
                        <span className="fs-5 fw-bold text-success">{property.priceDisplay}</span>
                      </div>
                      <button className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold">Contact Owner</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="card p-5 border-0 shadow-sm rounded-4 bg-white">
                <p className="text-muted fs-5 mb-0">No spaces match those exact criteria filters. Try broadening your query location or budget fields!</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
