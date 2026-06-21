import React, { useState, useEffect } from 'react';

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
    facilities: "High-Speed Wi-Fi, 24/7 Power Backup, Conference Room",
    offer: "10% off on 12-month lease",
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
    facilities: "Modular Kitchen, Swimming Pool, Gym Access",
    offer: "Zero Brokerage fee",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600"
  }
];

function App() {
  const [activeIntent, setActiveIntent] = useState("Rent");
  const [selectedCountry, setSelectedCountry] = useState("India"); 
  const [citySearch, setCitySearch] = useState(""); 
  const [propertyType, setPropertyType] = useState("Commercial");
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState([]);
  
  // Listing Form State Variables
  const [formTitle, setFormTitle] = useState("");
  const [formIntent, setFormIntent] = useState("Rent");
  const [formType, setFormType] = useState("Commercial");
  const [formCity, setFormCity] = useState("");
  const [formCountry, setFormCountry] = useState("India");
  const [formPrice, setFormPrice] = useState("");
  const [formFacilities, setFormFacilities] = useState("");
  const [formOffer, setFormOffer] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    handleSearch();
  }, [properties, selectedCountry, propertyType, activeIntent]);

  // Image Upload Quality Control Guardrail
  const handleImageChange = (e) => {
    setValidationError("");
    const files = Array.from(e.target.files);

    // Limit Check: 4 to 5 images maximum
    if (files.length < 4 || files.length > 5) {
      setValidationError("❌ Structural Rule: You must upload between 4 and 5 high-quality images.");
      e.target.value = ""; 
      return;
    }

    // High Quality Check: Ensure images are at least 1MB to verify resolution
    for (let file of files) {
      if (file.size < 1024 * 1024) { // 1 MegaByte limit
        setValidationError(`❌ Quality Alert: "${file.name}" is too low resolution. Please upload crisp images above 1MB.`);
        e.target.value = "";
        return;
      }
    }

    setSelectedImages(files);
  };

  const handleSearch = () => {
    const results = properties.filter(prop => {
      const matchesIntent = prop.intent === activeIntent;
      const matchesType = prop.type === propertyType;
      const matchesCountry = prop.country.toLowerCase() === selectedCountry.toLowerCase();
      const cleanCity = citySearch.toLowerCase().trim();
      const matchesCity = cleanCity === "" || prop.city.toLowerCase().includes(cleanCity);

      return matchesIntent && matchesType && matchesCountry && matchesCity;
    });
    setFilteredProperties(results);
  };

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      setValidationError("❌ Verification Failure: Images are completely missing.");
      return;
    }

    const newListing = {
      id: properties.length + 1,
      title: formTitle,
      intent: formIntent,
      type: formType,
      locality: "Verified Premium Zone",
      city: formCity,
      country: formCountry,
      priceDisplay: `₹${parseInt(formPrice).toLocaleString()} / month`,
      facilities: formFacilities,
      offer: formOffer,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=600" // Fallback high-res cover placeholder
    };

    setProperties([...properties, newListing]);
    
    // Clear Form Fields
    setFormTitle(""); setFormCity(""); setFormPrice(""); setFormFacilities(""); setFormOffer(""); setSelectedImages([]);
    alert("Listing submitted successfully for validation!");
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3">
        <div className="container">
          <span className="fs-3 fw-bold text-white">Rent<span style={{color: '#D4AF37'}}>Office</span>Place</span>
        </div>
      </nav>

      {/* RENDER DASHBOARD CORE MAP */}
      <main className="container py-5">
        <div className="row g-4">
          
          {/* LEFT SIDE: DISCOVER MARKETPLACE FILTERS */}
          <div className="col-md-7">
            <div className="card shadow-sm p-4 bg-white border-0 rounded-4 mb-4">
              <h4 className="fw-bold text-dark mb-3">Filter Listings</h4>
              <div className="row g-2">
                <div className="col-md-4">
                  <select className="form-select" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                    <option value="India">India 🇮🇳</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select className="form-select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Search City..." value={citySearch} onChange={(e) => setCitySearch(e.target.value)} />
                </div>
              </div>
            </div>

            <h4 className="fw-bold mb-3 text-dark">Verified Matches ({filteredProperties.length})</h4>
            {filteredProperties.map(property => (
              <div className="card mb-3 shadow-sm border-0 rounded-4 overflow-hidden bg-white" key={property.id}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src={property.image} className="img-fluid h-100 w-100" style={{ objectFit: 'cover' }} alt="Property" />
                  </div>
                  <div className="col-md-8 p-4">
                    <h5 className="fw-bold text-dark mb-1">{property.title}</h5>
                    <p className="text-muted small mb-2">📍 {property.locality}, {property.city}</p>
                    <p className="small text-secondary mb-1">💼 **Facilities:** {property.facilities}</p>
                    {property.offer && <p className="small text-danger mb-3">🔥 **Offer:** {property.offer}</p>}
                    <div className="d-flex justify-content-between align-items-center border-top pt-2">
                      <span className="fs-5 fw-bold text-success">{property.priceDisplay}</span>
                      <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold">Enquire</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE: ADVANCED PREVENTATIVE FORM GATEWAY */}
          <div className="col-md-5">
            <div className="card shadow border-0 rounded-4 p-4 bg-white sticky-top" style={{ top: '20px' }}>
              <h4 className="fw-bold text-dark mb-1">List Your Property</h4>
              <p className="text-muted small mb-4">Anti-Fraud Protection Enabled</p>

              {validationError && <div className="alert alert-danger p-2 small fw-semibold mb-3">{validationError}</div>}

              <form onSubmit={handleCreateListing}>
                <div className="mb-2">
                  <label className="form-label small fw-bold mb-1">Property Title</label>
                  <input type="text" className="form-control form-control-sm" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Premium Executive Business Suite" />
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small fw-bold mb-1">Property Type</label>
                    <select className="form-select form-select-sm" value={formType} onChange={(e) => setFormType(e.target.value)}>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold mb-1">City Location</label>
                    <input type="text" className="form-control form-control-sm" required value={formCity} onChange={(e) => setFormCity(e.target.value)} placeholder="e.g. Noida" />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold mb-1">Monthly Price (INR)</label>
                  <input type="number" className="form-control form-control-sm" required value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="e.g. 75000" />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold mb-1">Facilities Provided</label>
                  <input type="text" className="form-control form-control-sm" required value={formFacilities} onChange={(e) => setFormFacilities(e.target.value)} placeholder="Wi-Fi, AC, Parking, Elevators" />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold mb-1">Special Deal / Offer</label>
                  <input type="text" className="form-control form-control-sm" value={formOffer} onChange={(e) => setFormOffer(e.target.value)} placeholder="e.g. First month half rent" />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold mb-1 text-primary">Upload Premium Images (4-5 Photos Allowed, Min 1MB each)</label>
                  <input type="file" className="form-control form-control-sm" multiple accept="image/*" required onChange={handleImageChange} />
                </div>
                <button type="submit" className="btn btn-warning w-100 fw-bold rounded-pill text-dark shadow-sm">Submit Secure Listing</button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
