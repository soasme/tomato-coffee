import React from 'react';

import './CancelButton.css';

export default ({ onCancel }) => {
  return (
    <div className="cancel-button"
      onClick={() => onCancel()}>
      x
    </div>
  )
}