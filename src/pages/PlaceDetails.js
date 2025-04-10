// PlaceDetails.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const PlaceDetails = () => {
  const { placeName } = useParams();

  // Predefined embed map links
  const mapLinks = {
    "Sanjay Gandhi National Park": "https://www.google.com/maps?q=Sanjay+Gandhi+National+Park+Mumbai&output=embed",
    "Gateway of India": "https://www.google.com/maps?q=Gateway+of+India+Mumbai&output=embed", 
    "Juhu Beach Mumbai": "https://www.google.com/maps?q=Juhu+Beach+Mumbai&output=embed"
  };

  const mapUrl = mapLinks[placeName] || `https://www.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{placeName}</h2>
      <iframe
        title={placeName}
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapUrl}
      ></iframe>
    </div>
  );
};

export default PlaceDetails;
