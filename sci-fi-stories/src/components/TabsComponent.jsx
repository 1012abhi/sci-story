import React, { useState } from 'react'

// Adding cosmic space-themed animations
const cosmicStyles = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.8; }
  }

  @keyframes rotateGlow {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .loading {
    opacity: 0;
    transition: opacity 0.5s ease-in;
  }

  .loaded {
    opacity: 1;
  }

  .tab-button:hover {
    background: rgba(163, 135, 255, 0.1);
    text-shadow: 0 0 8px rgba(163, 135, 255, 0.6);
  }

  .tab-content {
    position: relative;
    overflow: hidden;
  }

  .tab-content::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(163, 135, 255, 0.2) 0%, rgba(163, 135, 255, 0) 70%);
    animation: pulse 4s infinite;
    z-index: 0;
    pointer-events: none;
  }

  .glass-effect {
    position: relative;
  }

  .glass-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                      radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                      radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                      radial-gradient(circle at 30% 90%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                      radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 100px 100px;
    z-index: -1;
    opacity: 0.6;
  }

  .glass-effect::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
    z-index: 1;
  }

  .cosmic-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    background: radial-gradient(ellipse at center, rgba(163, 135, 255, 0.1) 0%, rgba(163, 135, 255, 0) 70%);
    transform: translate(-50%, -50%);
    animation: rotateGlow 30s linear infinite;
    z-index: -1;
    pointer-events: none;
  }

  .star {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    opacity: 0;
    animation: twinkle 3s infinite;
    z-index: -1;
    pointer-events: none;
  }
`;

function TabsComponent({ story }) {
  const [selectedTab, setSelectedTab] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Create starfield effect - add randomly positioned stars
  const stars = Array(15).fill().map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2
  }));

  const handleImageError = (e) => {
    console.error('Image failed to load:', story?.Image);
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

  const tabStyle = (isActive) => ({
    padding: '15px 24px',
    background: 'transparent',
    color: isActive ? '#a387ff' : '#bdc7ff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.5s ease',
    outline: 'none',
    position: 'relative',
    fontSize: '16px',
    textShadow: isActive ? '0 0 10px rgba(163, 135, 255, 0.7)' : 'none',
    animation: isActive ? 'pulse 2s infinite' : 'none'
  })

  const activeIndicator = {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    width: '80%',
    height: '3px',
    background: 'linear-gradient(90deg, rgba(163,135,255,0.2) 0%, rgba(163,135,255,1) 50%, rgba(163,135,255,0.2) 100%)',
    borderRadius: '2px',
    boxShadow: '0 0 8px rgba(163, 135, 255, 0.8)',
    animation: 'pulse 2s infinite'
  }

  const tabData = [
    { id: 1, title: 'Details', icon: '🪐' },
    { id: 2, title: 'Image', icon: '✨' },
    { id: 3, title: 'Author Info', icon: '👨‍🚀' }
  ]

  return (
    <div className="glass-effect" style={{ 
      backgroundColor: 'rgba(14, 5, 41, 0.5)',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(95, 30, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1) inset',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.8s ease-out',
      position: 'relative'
    }}>
      <style>{cosmicStyles}</style>
      {/* Add cosmic glow effect */}
      <div className="cosmic-glow"></div>
      
      {/* Add twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: star.left,
            top: star.top,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
      <div className="tab-buttons" style={{ display: 'flex', padding: '10px 0' }}>
        {tabData.map((tab, index) => (
          <button
            key={index}
            className="tab-button"
            onClick={() => setSelectedTab(index)}
            style={{
              ...tabStyle(index === selectedTab),
              animation: index === selectedTab ? 'float 4s ease-in-out infinite' : 'none',
            }}
          >
            <span style={{ fontSize: '1.2rem', marginRight: '6px' }}>{tab.icon}</span>
            <span>{tab.title}</span>
          </button>
        ))}
        <div
          className="active-indicator"
          style={{
            ...activeIndicator,
            animation: 'pulse 2s infinite',
          }}
        />
      </div>
      <div
        className="tab-content"
        style={{
          padding: '30px',
          animation: 'fadeIn 0.5s ease-out',
        }}
      >
        {selectedTab === 0 && (
          <div style={{ animation: 'slideIn 0.5s ease-out' }}>
            <h2 style={{ 
              marginTop: '0', 
              color: '#fff', 
              borderBottom: '2px solid #a387ff', 
              paddingBottom: '10px',
              fontSize: '1.8rem',
              textShadow: '0 0 10px rgba(163, 135, 255, 0.7)'
            }}>
              Story Details
            </h2>
            <div style={{ marginTop: '20px' }}>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '15px' 
              }}>
                <div>
                  <h3 style={{ 
                    margin: '0 0 5px 0', 
                    color: '#a387ff',
                    fontSize: '1.2rem',
                    textShadow: '0 0 8px rgba(163, 135, 255, 0.5)'
                  }}>Title</h3>
                  <p style={{ 
                    margin: 0,
                    fontSize: '1.1rem',
                    color: '#fff'
                  }}>{story?.Title || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 style={{ 
                    margin: '0 0 5px 0', 
                    color: '#a387ff',
                    fontSize: '1.2rem',
                    textShadow: '0 0 8px rgba(163, 135, 255, 0.5)'
                  }}>Description</h3>
                  <p style={{ 
                    margin: 0,
                    lineHeight: '1.6', 
                    color: '#bdc7ff', 
                    fontSize: '1rem' 
                  }}>{story?.Description || 'No description available.'}</p>
                </div>

                {story?.Status && (
                  <div>
                    <h3 style={{ 
                      margin: '0 0 5px 0', 
                      color: '#a387ff',
                      fontSize: '1.2rem',
                      textShadow: '0 0 8px rgba(163, 135, 255, 0.5)'
                    }}>Status</h3>
                    <span style={{
                      display: 'inline-block',
                      padding: '5px 10px',
                      background: story.Status === 'Published' 
                        ? 'linear-gradient(45deg, rgba(13, 138, 69, 0.3), rgba(13, 138, 69, 0.1))' 
                        : 'linear-gradient(45deg, rgba(188, 126, 6, 0.3), rgba(188, 126, 6, 0.1))',
                      color: story.Status === 'Published' ? '#5dffa5' : '#ffda85',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      boxShadow: story.Status === 'Published' 
                        ? '0 0 10px rgba(13, 138, 69, 0.5)' 
                        : '0 0 10px rgba(188, 126, 6, 0.5)',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {story.Status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 1 && (
          <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
            <h2 style={{ 
              marginTop: '0', 
              color: '#fff', 
              borderBottom: '2px solid #a387ff', 
              paddingBottom: '10px',
              fontSize: '1.8rem',
              textShadow: '0 0 10px rgba(163, 135, 255, 0.7)'
            }}>
              Story Image
            </h2>
            <div style={{ 
              marginTop: '30px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              {imgError ? (
                <div style={{ 
                  width: '100%', 
                  maxWidth: '600px',
                  height: '300px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(30, 15, 70, 0.4) 0%, rgba(14, 5, 41, 0.6) 100%)',
                  color: '#bdc7ff',
                  borderRadius: '8px',
                  border: '1px dashed rgba(163, 135, 255, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>✨</div>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>Image not available</p>
                    <p style={{ fontSize: '14px', color: '#8a93c2' }}>The requested image could not be loaded</p>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  padding: '10px', 
                  background: 'rgba(20, 10, 50, 0.4)', 
                  border: '1px solid rgba(163, 135, 255, 0.3)',
                  borderRadius: '8px',
                  boxShadow: '0 0 30px rgba(95, 30, 255, 0.2)',
                  animation: 'float 6s infinite ease-in-out'
                }}>
                  <img 
                    className="loading"
                    src={getCleanImageUrl(story?.Image) || 'https://via.placeholder.com/800x500/1e0f46/bdc7ff?text=No+Image'} 
                    alt={story?.Title || 'Story image'} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '500px', 
                      borderRadius: '4px',
                      display: 'block'
                    }}
                    onError={handleImageError}
                    onLoad={(e) => e.target.classList.add('loaded')}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 2 && (
          <div style={{ padding: '20px', animation: 'slideIn 0.7s ease-out' }}>
            <h2 style={{ color: '#E0AAFF', marginBottom: '15px', textShadow: '0 0 10px rgba(224, 170, 255, 0.5)' }}>
              About the Author
            </h2>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div 
                style={{ 
                  width: '120px', 
                  height: '120px',
                  flexShrink: 0,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 0 15px rgba(163, 135, 255, 0.4)',
                }}
              >
                <img
                  src={story?.author?.image || 'https://via.placeholder.com/120x120?text=Author'}
                  alt={story?.author?.name || 'Author'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className={imageLoaded ? 'loaded' : 'loading'}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/120x120?text=Author';
                    setImageLoaded(true);
                  }}
                />
              </div>
              <div>
                <h3 style={{ 
                  color: '#E0AAFF', 
                  marginBottom: '8px',
                  animation: 'pulse 3s infinite'
                }}>
                  {story?.author?.name || 'Unknown Author'}
                </h3>
                <p style={{ 
                  color: '#C8B6FF', 
                  lineHeight: '1.6',
                  fontSize: '0.95rem', 
                  marginBottom: '10px'
                }}>
                  {story?.author?.bio || 'No author information available.'}
                </p>
                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#9D8DF1' }}>📚</span>
                    <span style={{ color: '#9D8DF1', fontSize: '0.85rem' }}>
                      {story?.author?.publications || '0'} Publications
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#9D8DF1' }}>⭐</span>
                    <span style={{ color: '#9D8DF1', fontSize: '0.85rem' }}>
                      {story?.author?.rating || '4.5'} Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TabsComponent
