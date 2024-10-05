import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

function Sidebar({ addItem }) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleShow = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);

  const handleAdd = () => {
    if (name.trim() && description.trim()) {
      // Add new item with name and description
      addItem({ name, description });
      setName('');
      setDescription('');
      setShowPopup(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-between bg-light" style={{ height: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ height: '100px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>TableAI</h4>
        <Button variant="primary" onClick={handleShow} style={{ borderRadius: '50%', width: '40px', height: '40px' }}>
          +
        </Button>

        {/* Popup for adding new item */}
        <Modal show={showPopup} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter item name"
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter item description"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAdd}>
              Add Item
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Chat Box */}
      <div className="flex-grow-1">
        <div className="d-flex flex-column justify-content-end" style={{ height: 'calc(100vh - 180px)', border: '1px solid #ccc', padding: '10px', borderRadius: '10px' }}>
          {/* Chat message area */}
          <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '10px' }}>
            <div className="p-2 mb-2 bg-secondary text-white rounded">User: How can I help you today?</div>
            <div className="p-2 mb-2 bg-primary text-white rounded">You: I'd like to ask about...</div>
          </div>
          {/* Input Box */}
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Enter prompt" />
            <button className="btn btn-primary" type="button">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
