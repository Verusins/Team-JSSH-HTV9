import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaBars } from 'react-icons/fa'; // Importing icons for plus and menu signs

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

  const handleHistoryOpen = () => {
    // Implement the logic to open the history tab
    console.log("History tab opened!");
  };

  return (
    <div className="d-flex flex-column justify-content-between bg-light" style={{ height: '100vh', padding: '5px 15px 0', transform: 'translateX(10px)', borderRadius: '15px 0 0 15px' }}>
      {/* Header */}
      <div style={{ height: '100px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
          {/* <FaPlus className="mr-2" style={{ cursor: 'pointer' }} onClick={handleShow} /> */}
          <Button variant="primary" onClick={handleShow} style={{ borderRadius: '50%', width: '30px', height: '30px', fontSize: '1rem', background: '#CBC6C6', border: 'none' }}>
            <FaPlus className="mr-2" style={{ cursor: 'pointer', transform: 'translate(-5px, -5px)' }} onClick={handleShow} />
          </Button>
          <h4 style={{ margin: 0, paddingLeft: "10px" }}>TableAI</h4>
        </div>
        <FaBars className="ml-2" style={{ cursor: 'pointer', marginRight: '20px' }} onClick={handleHistoryOpen} />
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '2px solid #CBC6C6', margin: '0px 10px', padding: 0, transform: 'translateY(-10px)' }} />

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

      {/* Chat Box */}
      <div className="flex-grow-1">
        <div className="d-flex flex-column justify-content-end" style={{ height: 'calc(100vh - 150px)', padding: '10px', borderRadius: '10px' }}>
          {/* Chat message area */}
          <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '10px' }}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
         
          </div>
          {/* Input Box */}
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Enter prompt" style={{ borderRadius: '25px 0 0 25px' }} />
            <button className="btn btn-primary" type="button" style={{ borderRadius: '0 15px 15px 0', background: '#CBC6C6', border: 'none' }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
