import React, { useState, useEffect } from 'react';
import { FaUser, FaUserTie } from 'react-icons/fa'; // Importing the user icon
// import { MdPerson } from 'react-icons/md';
import { Modal, Button } from 'react-bootstrap'; // Bootstrap modal for pop-up

function Content({ items, isLoading }) {
  const radius = 250; // Radius of the table circle
  const [selectedAgent, setSelectedAgent] = useState(null); // To track the clicked agent for modal
  const [speakingAgentIndex, setSpeakingAgentIndex] = useState(0); // For alternating colors


  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setSpeakingAgentIndex((prevIndex) => (prevIndex + 1) % items.length); // Cycle through agents
      }, 500); // Change color every 500ms
      return () => clearInterval(interval); // Cleanup on unmount or stop
    }
  }, [isLoading, items.length]);

  // Calculate the positions of agents around the table
  const calculatePosition = (index, totalAgents) => {
    const angle = (2 * Math.PI) / totalAgents; // Divide 360° (2π radians) by the number of agents
    const x = radius * Math.cos(angle * index); // X position relative to the center
    const y = radius * Math.sin(angle * index); // Y position relative to the center
    return { x, y };
  };

  // Show the modal with agent's details when clicking on an agent
  const handleAgentClick = (item) => {
    setSelectedAgent(item);
  };

  // Close the modal
  const handleClose = () => {
    setSelectedAgent(null);
  };

  return (
    <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      {/* Table (circle) */}
      <div
        style={{
          width: '320px',
          height: '310px',
          borderRadius: '50%',
          backgroundColor: '#846345', // Table color (like a wooden table)
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -53%)', // Center the table horizontally and vertically
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
      </div>
      <div
        style={{
          width: '320px',
          height: '310px',
          borderRadius: '50%',
          backgroundColor: '#5E4C45', // Table color (like a wooden table)
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -47%)', // Center the table horizontally and vertically
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 0,
        }}
      >
      </div>

      {/* Agents (user icons) */}
      {items.map((item, index) => {
        const { x, y } = calculatePosition(index, items.length);
        const isSpeaking = isLoading && index === speakingAgentIndex; // Highlight the speaking agent
        const agentColor = isSpeaking ? '#CBC6C6' : '#FFF'; // Alternate color when loading

        return (
          <div
            key={index}
            className="position-absolute"
            style={{
              top: `calc(50% + ${y}px)`, // Offset by y position
              left: `calc(50% + ${x}px)`, // Offset by x position
              transform: 'translate(-50%, -50%)', // Center each icon
              textAlign: 'center',
              cursor: 'pointer', // Show pointer when hovering over agents
            }}
            onClick={() => handleAgentClick(item)} // Click event to open the modal
          >
            {index === 0 ? (
              <FaUserTie size={85} color={agentColor} />
            ) : (
              <FaUser size={85} color={agentColor} />
            )}
            <div>
              <strong style={{ color: agentColor, fontSize: '28px', fontFamily: 'Afacad Flux' }}>
                {item.name}</strong> {/* User name in the same color */}
            </div>
          </div>
        );
      })}

      {/* Modal to show agent's details */}
      {selectedAgent && (
        <Modal show={true} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedAgent.name}'s Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> {selectedAgent.name}</p>
            <p><strong>Description:</strong> {selectedAgent.description}</p>
          </Modal.Body>
          {/* 
          <Modal.Footer>
            <Button variant="danger" onClick={() => { onDelete(selectedAgent); handleClose(); }}>
              Delete Agent
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
      )}
    </div>
  );
}

export default Content;
