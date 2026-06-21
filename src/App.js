import React, { useState, useEffect } from 'react';

// Global mock data with diverse international listings
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Premium Corporate Office Suite",
    intent: "Rent",
    type: "Commercial",
    locality: "Sector 62, Noida",
    city: "Noida",
    country: "India",
    priceDisplay: "₹85,000 / month",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600"
  },
  {
    id: 2,
    title: "Luxury 3 BHK Residential Apartment",
    intent: "Rent",
    type: "Residential",
    locality: "DLF Phase 3, Gurugram",
    city: "Gurugram",
    country: "India",
    priceDisplay: "₹65,000 / month",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
  },
  {
    id: 3,
    title: "Modern Co-Working Smart Desk",
    intent: "Rent",
    type: "Commercial",
    locality: "CBD, Sydney",
    city: "Sydney",
    country: "Australia",
    priceDisplay: "$450 / month",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=600"
  },
  {
    id: 4,
    title: "Manhattan Executive Boardroom",
    intent: "Rent",
    type: "Commercial",
    locality: "Times Square, New York",
    city: "New York",
    country: "United States",
    priceDisplay: "$4,200 / month",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600"
  }
];

function App() {
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India"); // Fallback default
  const [citySearch, setCitySearch] = useState(""); 
  const [propertyType, setPropertyType] = useState("Commercial");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [detectedLocationMsg, setDetectedLocationMsg] = useState("Detecting your location...");

  // IP Geolocation Engine
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        if (data.country_name) {
          setSelectedCountry(data.country_name);
          setDetectedLocationMsg(`📍 Auto-detected location: ${data.city}, ${data.country_name}`);
          
          // Run an initial filter automatically based on detected country
          const initialMatches = MOCK_PROPERTIES.filter(prop => 
            prop.country.toLowerCase() === data.country_name.toLowerCase() &&
            prop.intent === activeIntent &&
            prop.type === propertyType
          );
          setFilteredProperties(initialMatches);
        }
      })
      .catch(err => {
        console.error("Location detection failed:", err);
        setDetectedLocationMsg("📍 Location detection unavailable. Showing default (India).");
        // Fallback filter run
        handleSearch();
      });
  }, []);

  const handleSearch = () => {
    const results = MOCK_PROPERTIES.filter(prop => {
      const matchesIntent = prop.intent === activeIntent;
      const matchesType = prop.type === propertyType;
      const matchesCountry = prop.country.toLowerCase() === selectedCountry.toLowerCase();
      
      const cleanCity = citySearch.toLowerCase().trim();
      const matchesCity = cleanCity === "" || prop.city.toLowerCase().includes(cleanCity);

      return matchesIntent && matchesType && matchesCountry && matchesCity;
    });
    setFilteredProperties(results);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* HEADER NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3">
        <div className="container">
          <span className="fs-3 fw-bold text-white">Rent<span style={{color: '#D4AF37'}}>Office</span>Place</span>
          <span className="badge bg-secondary p-2 rounded">{detectedLocationMsg}</span>
        </div>
      </nav>

      {/* SEARCH CONTAINER */}
      <header className="py-5 text-white text-center" style={{
        background: "linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.9)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200') center/cover",
        padding: "80px 0"
      }}>
        <div className="container">
          <h1 className="fw-bold mb-4">Global Commercial & Residential Gateway</h1>

          <div className="mx-auto" style={{ maxWidth: '900px' }}>
            {/* INTENT SELECTION */}
            <div className="d-flex bg-light p-1 rounded-top-4 d-inline-flex shadow">
              <button className={`btn px-4 fw-bold ${activeIntent === 'Rent' ? 'btn-warning' : 'btn-light text-muted'}`} onClick={() => setActiveIntent('Rent')}>Rent</button>
              <button className={`btn px-4 fw-bold ${activeIntent === 'Buy' ? 'btn-warning' : 'btn-light text-muted'}`} onClick={() => setActiveIntent('Buy')}>Buy</button>
            </div>

            {/* BAR WIDGET */}
            <div className="card shadow p-4 bg-white text-dark border-0 rounded-bottom-4 rounded-end-4">
              <div className="row g-2">
                
                {/* COUNTRY TARGET DROPDOWN */}
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted mb-1 text-start d-block">Country Target</label>
                  <select className="form-select fw-semibold" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                    <option value="India">India 🇮🇳</option>
                    <option value="United States">United States 🇺🇸</option>
                    <option value="Australia">Australia 🇦🇺</option>
                  </select>
                </div>

                {/* INNER CITY TEXT FILTER */}
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-muted mb-1 text-start d-block">Search Local City</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Noida, Sydney, New York" 
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                  />
                </div>

                {/* PROPERTY TYPE */}
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted mb-1 text-start d-block">Property Type</label>
                  <select className="form-select fw-semibold" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                  </select>
                </div>

                {/* CALL TO ACTION */}
                <div className="col-md-2 d-flex align-items-end">
                  <button className="btn btn-primary w-100 fw-bold py-2" onClick={handleSearch} style={{ backgroundColor: '#0056b3' }}>
                    Search
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* RENDER DYNAMIC CARD MAP */}
      <main className="container py-5">
        <h3 className="fw-bold mb-4 text-dark">Available Matches in {selectedCountry} ({filteredProperties.length})</h3>
        <div className="row g-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <div className="col-md-4" key={property.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                  <img src={property.image} className="card-img-top" alt={property.title} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="card-body p-4">
                    <span className="badge bg-danger mb-2">{property.type}</span>
                    <h5 className="card-title fw-bold text-dark">{property.title}</h5>
                    <p className="card-text text-muted">📍 {property.locality}, {property.city}</p>
                    <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                      <span className="fs-5 fw-bold text-success">{property.priceDisplay}</span>
                      <button className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold">Enquire Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted fs-5">No listings found matching these filters in {selectedCountry}. Try changing the city name or switching categories!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
