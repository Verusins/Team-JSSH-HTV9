import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function Sidebar() {
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleShow = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);
  const handleInputChange = (e) => setInputValue(e.target.value);

  return (
    <div className="d-flex flex-column justify-content-between bg-light" style={{ height: '100vh', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ height: '100px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>TableAI</h4>
        <Button variant="primary" onClick={handleShow} style={{ borderRadius: '50%', width: '40px', height: '40px' }}>
          +
        </Button>

        {/* Temporary Popup */}
        <Modal show={showPopup} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Temporary Popup</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This is a temporary popup triggered by the "+" button.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Chat Box */}
      <div className="flex-grow-1">
        <div className="d-flex flex-column justify-content-end" style={{ height: 'calc(100vh - 180px)', border: '1px solid #ccc', padding: '10px', borderRadius: '10px' }}>
          {/* Message Display Box (Simulating messages) */}
          <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '10px' }}>
            <div className="p-2 mb-2 bg-secondary text-white rounded">User: How can I help you today?</div>
            <div className="p-2 mb-2 bg-primary text-white rounded">You: I'd like to ask about...</div>
          </div>
          
          {/* Input Box */}
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter prompt"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button className="btn btn-primary" type="button">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
