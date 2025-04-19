import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StoryCard({ data }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const handleImageError = (e) => {
    console.error('Image failed to load:', data?.Image);
    setImgError(true);
  }

  // Get a clean image URL from either a string or array of image paths
  const getCleanImageUrl = (imageData) => {
    if (!imageData) return null;
    
    try {
      // If it's an array, use the first item
      if (Array.isArray(imageData) && imageData.length > 0) {
        return `https://ik.imagekit.io/dev24/${encodeURIComponent(imageData[0].trim())}`;
      }
      
      // If it's a string, take only the first image if multiple are provided
      if (typeof imageData === 'string') {
        const firstImage = imageData.split(',')[0];
        return `https://ik.imagekit.io/dev24/${encodeURIComponent(firstImage.trim())}`;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating image URL:', error);
      return null;
    }
  }

  // Map status to styling
  const getStatusStyle = (status) => {
    if (!status) return { text: 'New', color: '#9c6dff', bgColor: 'rgba(156, 109, 255, 0.8)' };
    
    switch(status) {
      case 'Published':
      case 'Completed':
        return { text: 'Completed', color: '#4caf50', bgColor: 'rgba(76, 175, 80, 0.8)' };
      case 'In Progress':
        return { text: 'In Progress', color: '#ffa64d', bgColor: 'rgba(255, 166, 77, 0.8)' };
      default:
        return { text: 'New', color: '#9c6dff', bgColor: 'rgba(156, 109, 255, 0.8)' };
    }
  }

  const statusInfo = getStatusStyle(data.Status);

  return (
    <div 
      onClick={() => navigate(`/story/${data._id}`)} 
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        border: '2px solid rgba(156, 109, 255, 0.2)',
        boxShadow: isHovered ? '0 12px 24px rgba(0, 0, 0, 0.3), 0 0 15px rgba(156, 109, 255, 0.5)' : '0 8px 16px rgba(0, 0, 0, 0.2)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ 
        height: '170px', 
        overflow: 'hidden', 
        position: 'relative',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {imgError ? (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'rgba(20, 10, 40, 0.7)',
            color: '#9c6dff'
          }}>
            <span style={{ fontSize: '30px', marginBottom: '10px' }}>🌌</span>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)' }}>Image not available</p>
          </div>
        ) : (
          <img 
            src={getCleanImageUrl(data?.Image) || 'https://via.placeholder.com/300x180/140a28/9c6dff?text=No+Image'} 
            alt={data.Title || 'Story title'} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: 'block',
              filter: isHovered ? 'brightness(1.1)' : 'brightness(0.9)',
              transition: 'filter 0.3s ease, transform 0.5s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
            onError={handleImageError}
          />
        )}
        
        {/* Status badge */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: statusInfo.bgColor,
          color: 'white',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          {statusInfo.text}
        </div>
      </div>
      
      <div style={{ 
        padding: '15px', 
        position: 'relative',
        zIndex: 1
      }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          color: 'white',
          fontWeight: 'bold',
          lineHeight: 1.3,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          {data.Title || 'The Galactic Time Travelers'}
        </h3>
        
        {/* Adventure title if available */}
        {data.Storyadvenure?.Storytitle && (
          <p style={{ 
            margin: '0 0 8px 0', 
            fontSize: '13px', 
            color: '#9c6dff',
            opacity: 0.9
          }}>
            {data.Storyadvenure.Storytitle}
          </p>
        )}
      </div>
      
      {/* Glow effect on hover */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '12px',
          boxShadow: `0 0 20px ${statusInfo.color}`,
          pointerEvents: 'none',
          opacity: 0.3,
          transition: 'opacity 0.3s ease'
        }}></div>
      )}
    </div>
  )
}

export default StoryCard