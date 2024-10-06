import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaPlus, FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';

function Sidebar({ addItem, items, isLoading, setIsLoading }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // State for showing the history section
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [historyData, setHistoryData] = useState(null); // State for fake API data

  const handleShow = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);

  const handleAdd = () => {
    if (name.trim() && description.trim()) {
      addItem({ name, description });
      setName('');
      setDescription('');
      setShowPopup(false);
    }
  };

//   const handleSend = async () => {
//     setIsLoading(true);
    
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/history'); // Replace with your actual backend endpoint
//       setHistoryData(response.data); // Assuming the API returns the history data in the same format
//     } catch (error) {
//       console.error('Error fetching history data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

  const handleSend = async () => {
    const agentsArray = items.map(item => ({
      name: item.name,
      system_prompt: item.description,
    }));

    const dataToSend = {
      prompt: prompt,
      agents: agentsArray,
    };

    console.log(dataToSend);

    setChatMessages([...chatMessages, { type: 'user', content: prompt }]);
    setPrompt('');
    setIsLoading(true);

    // Simulate a fake response
    const sendData = async () => {
        try {
          // Call the API directly without delay
          const response = await axios.post('http://127.0.0.1:8000/agents/', dataToSend);
      
          setTypedMessage(''); // Clear typed message
      
          const fullMessage = `${response.data.message}\n\n${response.data.code}`;
          setChatMessages(prevMessages => [
            ...prevMessages,
            { type: 'assistant', content: fullMessage },
          ]);
          console.log(chatMessages);
        } catch (error) {
          console.error('Error fetching history data:', error);
        } finally {
          setIsLoading(false); // Stop loading spinner/indicator
        }
    };

    sendData();
  };

  // Fake API call for history data
  const fetchHistoryData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const fakeData = [
        { id: 1, title: 'Chat with Assistant', timestamp: '2024-10-05 12:30:00' },
        { id: 2, title: 'Chat about JavaScript', timestamp: '2024-10-04 09:15:00' },
        { id: 3, title: 'React Project Discussion', timestamp: '2024-10-03 16:45:00' },
      ];
      setHistoryData(fakeData);
      setIsLoading(false);
    }, 2000); // Simulate 2-second delay
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      fetchHistoryData(); // Fetch history data when the history tab is opened
    }
  };

  return (
    <div className="d-flex flex-column justify-content-between bg-light" style={{ height: '100vh', padding: '5px 15px 0', borderRadius: '15px 0 0 15px' }}>
      {/* Header */}
      <div style={{ height: '100px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
          <Button variant="primary" onClick={handleShow} style={{ borderRadius: '50%', width: '30px', height: '30px', fontSize: '1rem', background: '#CBC6C6', border: 'none' }}>
            <FaPlus className="mr-2" style={{ cursor: 'pointer', transform: 'translate(-5px, -5px)' }} />
          </Button>
          <h4 style={{ margin: 0, paddingLeft: "10px", fontSize: "2.5rem", fontFamily: "Afacad Flux" }}>Table<span style={{ color: '#6E95EA'}}>AI</span></h4>
        </div>
        {!showHistory ? (
          <FaBars className="ml-2" style={{ cursor: 'pointer', marginRight: '20px' }} onClick={toggleHistory} />
        ) : (
          <FaTimes className="ml-2" style={{ cursor: 'pointer', marginRight: '20px' }} onClick={toggleHistory} />
        )}
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '2px solid #CBC6C6', margin: '0px 10px', padding: 0, transform: 'translateY(-10px)' }} />

      {/* History Section */}
      {showHistory ? (
        <div style={{ flexGrow: 1, padding: '10px', overflowY: 'auto' }}>
          <h5>History</h5>
          {isLoading ? (
            <div style={{ textAlign: 'center' }}>
              <Spinner animation="border" />
            </div>
          ) : (
            historyData && historyData.map((item) => (
              <div key={item.id} style={{ marginBottom: '10px' }}>
                <strong>{item.title}</strong>
                <p>{item.timestamp}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        // Chat Section
        <div className="flex-grow-1">
          <div className="d-flex flex-column justify-content-end" style={{ height: 'calc(100vh - 120px)', padding: '10px', borderRadius: '10px' }}>
            {/* Chat message area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              {chatMessages.map((message, index) => (
                <div key={index}>
                  {message.type === 'user' && <strong>You:</strong>} {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="spinner" style={{ textAlign: 'center', margin: '20px 0' }}>
                  <Spinner animation="border" />
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter prompt"
                style={{ borderRadius: '15px 0 0 15px' }}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button onClick={handleSend} style={{ borderRadius: '0 15px 15px 0', background: '#CBC6C6', border: 'none' }}>
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for adding new item */}
      <Modal show={showPopup} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name (Max 15 characters)</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              maxLength={15}
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
  );
}

export default Sidebar;
