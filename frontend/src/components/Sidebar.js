import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaPlus, FaBars } from 'react-icons/fa';

function Sidebar({ addItem, items, isLoading, setIsLoading }) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
//   const [isLoading, setIsLoading] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');

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

  const handleSend = async () => {
    const agentsArray = items.map(item => ({
      name: item.name,
      system_prompt: item.description,
    }));

    const dataToSend = {
      prompt: prompt,
      agents: agentsArray,
    };

    setChatMessages([...chatMessages, { type: 'user', content: prompt }]);
    setPrompt(''); // Clear the input
    setIsLoading(true); // Start loading

    // Simulate loading for 5 seconds
    setTimeout(() => {
      const response = {
        data: {
          message: `Sure, here is a Python code to compute the factorial of a number:\n\n`,
          code: `
            def factorial(n):
                if n == 0:
                    return 1
                else:
                    return n * factorial(n-1)

            number = 5
            result = factorial(number)
            print(f"The factorial of {number} is {result}")
          `,
          executionResult: 'The factorial of 5 is 120',
        }
      };

      const assistantResponse = response.data.message;
      const codeSample = response.data.code;
      const executionResult = response.data.executionResult;

      // Add loading message for assistant while typing
      setChatMessages(prevMessages => [
        ...prevMessages,
        { type: 'assistant', content: '' }, // Empty content for now
      ]);

      // Simulate typing the message out character by character
      let index = -1;
      const fullMessage = assistantResponse + codeSample + `\n\nExecution Result: ${executionResult}`;

      const typeOutMessage = () => {
        if (index < fullMessage.length) {
          setTypedMessage(prev => prev + fullMessage.charAt(index));
          index++;
          setTimeout(typeOutMessage, 25); // Adjust typing speed here
        }
      };

      setTypedMessage(''); // Reset typed message
      setIsLoading(false); // Stop loading
      typeOutMessage(); // Start typing out the message
    }, 5000); // 5-second loading delay
  };

  useEffect(() => {
    if (typedMessage.length > 0) {
      setChatMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].content = typedMessage;
        return newMessages;
      });
    }
  }, [typedMessage]);

  const renderChatMessage = (message, index) => {
    if (message.type === 'user') {
      return <div key={index}><strong>You:</strong> {message.content}</div>;
    } else if (message.type === 'assistant') {
      return <div key={index}><strong>Assistant:</strong> {message.content}</div>;
    } else if (message.type === 'code') {
      return (
        <pre key={index} style={{ background: '#f1f1f1', padding: '10px', borderRadius: '5px' }}>
          {message.content}
        </pre>
      );
    }
  };

  return (
    <div className="d-flex flex-column justify-content-between bg-light" style={{ height: '100vh', padding: '5px 15px 0', transform: 'translateX(7px)', borderRadius: '15px 0 0 15px' }}>
      {/* Header */}
      <div style={{ height: '100px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
          <Button variant="primary" onClick={handleShow} style={{ borderRadius: '50%', width: '30px', height: '30px', fontSize: '1rem', background: '#CBC6C6', border: 'none' }}>
            <FaPlus className="mr-2" style={{ cursor: 'pointer', transform: 'translate(-5px, -5px)' }} />
          </Button>
          <h4 style={{ margin: 0, paddingLeft: "10px", fontSize: "2.5rem", fontFamily: "Afacad Flux" }}>Table<span style={{ color: '#6E95EA'}}>AI</span></h4>
        </div>
        <FaBars className="ml-2" style={{ cursor: 'pointer', marginRight: '20px' }} onClick={() => console.log("History tab opened!")} />
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

      {/* Chat Box */}
      <div className="flex-grow-1">
        <div className="d-flex flex-column justify-content-end" style={{ height: 'calc(100vh - 120px)', padding: '10px', borderRadius: '10px' }}>
          {/* Chat message area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {chatMessages.map((message, index) => renderChatMessage(message, index))}
            {isLoading && (
            <div className="spinner" style={{ textAlign: 'center', margin: '20px 0' }}>
                <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
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
            <button className="btn btn-primary" type="button" style={{ borderRadius: '0 15px 15px 0', background: '#CBC6C6', border: 'none' }} onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
