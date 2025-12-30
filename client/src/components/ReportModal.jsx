import React, { useState } from 'react';
import { X, MapPin, Camera, Loader2, UploadCloud, Send } from 'lucide-react';
import API from '../services/api'; // <--- IMPORT YOUR API.JS
import { toast } from 'react-hot-toast'; // Ensure you have installed 'react-hot-toast'
import './ReportModal.css'; 

const ReportIssueModal = ({ isOpen, onClose, onReportSubmit }) => {
  if (!isOpen) return null;

  // --- State Management ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  
  // Location State
  const [location, setLocation] = useState(null);
  
  // Loading States
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // <--- New loading state

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

  // --- 🌍 REAL DYNAMIC LOCATION HANDLER ---
  const handleGetLocation = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();

        setLocation({
          lat: latitude,
          lng: longitude,
          address: data.display_name || `Lat: ${latitude}, Lng: ${longitude}`
        });
        
      } catch (error) {
        console.error("Error fetching address:", error);
        setLocation({
          lat: latitude,
          lng: longitude,
          address: "Location detected (Address lookup failed)" 
        });
      } finally {
        setIsLocating(false);
      }

    }, (error) => {
      console.error("Geolocation Error:", error);
      toast.error("Unable to retrieve location.");
      setIsLocating(false);
    });
  };

  // --- 🚀 THE SUBMIT FUNCTION (Connects to Backend) ---
  const handleSubmit = async () => {
    // 1. Validation
    if (!title || !description) {
      return toast.error("Please add a title and description");
    }
    if (!location) {
      return toast.error("Please add a location");
    }

    setIsSubmitting(true);

    try {
      // 2. Prepare Data (FormData is required for file uploads)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);
      formData.append('address', location.address);

      // Append the first image if it exists
      if (images.length > 0) {
        formData.append('image', images[0].file); 
      }

      // 3. Send to Backend (Using your API.js)
      // The interceptor in api.js will auto-attach the Token
      await API.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 4. Success Handling
      toast.success("Report Submitted Successfully!");
      
      // Reset Form
      setTitle('');
      setDescription('');
      setImages([]);
      setLocation(null);
      
      // Refresh the parent dashboard if needed
      if (onReportSubmit) onReportSubmit();

      onClose();

    } catch (error) {
      console.error("Submission Failed", error);
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
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
            <button onClick={onClose} disabled={isSubmitting} className="btn btn-secondary">
                Cancel
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? <Loader2 className="spinner" size={18} /> : <Send size={18} />}
                {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;