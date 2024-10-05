import React from 'react';

function Content({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="border-bottom py-2">
          <strong>{item.name}</strong>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Content;
