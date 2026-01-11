import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RatingModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, comment });
    // Reset after submit
    setTimeout(() => {
      setRating(0);
      setComment('');
    }, 500);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'white', padding: '30px', borderRadius: '20px',
          width: '90%', maxWidth: '400px', position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} color="#64748b" />
        </button>

        <h2 style={{ margin: '0 0 10px 0', textAlign: 'center', color: '#1e293b' }}>Rate the Resolution</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
          How satisfied are you with the work done?
        </p>

        {/* STAR RATING */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.1s' }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(rating)}
            >
              <Star 
                size={32} 
                fill={(hover || rating) >= star ? "#fbbf24" : "none"} 
                color={(hover || rating) >= star ? "#fbbf24" : "#cbd5e1"} 
                strokeWidth={2}
              />
            </button>
          ))}
        </div>

        {/* FEEDBACK TEXT */}
        <textarea
          placeholder="Any specific feedback? (Optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px',
            border: '1px solid #e2e8f0', minHeight: '80px', marginBottom: '20px',
            fontFamily: 'inherit', fontSize: '0.9rem', resize: 'none', outline: 'none'
          }}
        />

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px',
            background: rating > 0 ? '#6366f1' : '#e2e8f0',
            color: rating > 0 ? 'white' : '#94a3b8',
            border: 'none', fontWeight: 'bold', cursor: rating > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>

      </motion.div>
    </div>
  );
};

export default RatingModal;