import React, { useState } from 'react';
import { X, MapPin, Camera, Loader2, UploadCloud, Send } from 'lucide-react';
import './ReportModal.css'; // Make sure to import your CSS file

const ReportIssueModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // --- State Management ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Image State
  const [images, setImages] = useState([]);

  // Location State
  const [location, setLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // --- Handlers ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    // Simulating API delay
    setTimeout(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: "Near Civil Lines, Nagpur, Maharashtra"
                });
                setIsLocating(false);
            }, (error) => {
                alert("Unable to retrieve location");
                setIsLocating(false);
            });
        }
    }, 1500); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* Header */}
        <div className="modal-header">
          <div className="header-title">
            <Camera size={24} />
            <h2>Report an Issue</h2>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body">
          
          {/* Text Inputs */}
          <div className="form-group">
            <label>Issue Title</label>
            <input 
              type="text" 
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Broken Water Pipe"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
            />
          </div>

          <hr className="divider" />

          {/* Location Section */}
          <div className="form-group">
            <label>Location</label>
            {!location ? (
                <button 
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="location-btn"
                >
                    {isLocating ? <Loader2 className="spinner" size={18} /> : <MapPin size={18} />}
                    {isLocating ? "Detecting location..." : "Add Current Location"}
                </button>
            ) : (
                <div className="location-success">
                    <div className="location-info">
                        <MapPin size={18} />
                        <div>
                            <strong>Location Attached</strong>
                            <div style={{fontSize: '0.8rem', opacity: 0.8}}>{location.address}</div>
                        </div>
                    </div>
                    <button onClick={() => setLocation(null)} className="close-btn" style={{color: '#ef4444'}}>
                        <X size={16} />
                    </button>
                </div>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="form-group">
            <label>Evidence Photos</label>
            
            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="image-grid">
                    {images.map((img, idx) => (
                        <div key={idx} className="preview-container">
                            <img src={img.preview} alt="preview" className="preview-img" />
                            <button onClick={() => removeImage(idx)} className="remove-img-btn">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Drop Zone */}
            <div className="drop-zone">
                <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input-hidden"
                />
                <UploadCloud className="upload-icon" size={32} />
                <div style={{fontWeight: 500, color: '#4b5563'}}>Click to upload or drag images</div>
                <div style={{fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px'}}>PNG, JPG up to 5MB</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">
                Cancel
            </button>
            <button className="btn btn-primary">
                <Send size={18} />
                Submit Report
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;