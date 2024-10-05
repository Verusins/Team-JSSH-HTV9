import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

function App() {
  const [items, setItems] = useState([
    { name: 'Security', description: 'Keep track of every solution to align with security standards' },
  ]);

  // Function to add a new item with name and description
  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9">
          <Content items={items} />
        </div>
        <div className="col-md-3">
          <Sidebar addItem={addItem} />
        </div>
      </div>
    </div>
  );
}

export default App;