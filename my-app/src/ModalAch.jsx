// components/Modal.js
import React, { useEffect } from 'react';
import './ModalAch.css';

const ModalAch = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = '600px',
  closeOnOverlayClick = true 
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={closeOnOverlayClick ? onClose : null}
    >
      <div 
        className="modal-content"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalAch;