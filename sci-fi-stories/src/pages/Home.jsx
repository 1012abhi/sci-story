import React, { useEffect, useState } from 'react'
import StoryCard from '../components/StoryCard'

function Home() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter states
  const [filter, setFilter] = useState('all')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [storiesPerPage] = useState(8)

  useEffect(() => {
    setLoading(true)
    fetch("https://mxpertztestapi.onrender.com/api/sciencefiction")
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        return res.json()
      })
      .then(data => {
        console.log('Fetched stories:', data)
        
        // Check data format and log any issues
        if (!Array.isArray(data)) {
          console.error('Expected array but received:', typeof data);
          setStories([]);
        } else {
          // Check for missing Image property
          data.forEach((story, index) => {
            if (!story.Image) {
              console.warn(`Story at index ${index} is missing Image property:`, story);
            }
          });
          setStories(data);
        }
        
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching stories:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Filter stories based on search term and status filter
  const filteredStories = stories.filter(story => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      (story.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.Description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    let matchesStatus = true;
    if (filter === 'new') {
      matchesStatus = !story.Status || story.Status === 'New';
    } else if (filter === 'inProgress') {
      matchesStatus = story.Status === 'In Progress';
    } else if (filter === 'completed') {
      matchesStatus = story.Status === 'Published' || story.Status === 'Completed';
    }
    
    return matchesSearch && matchesStatus;
  });

  // Get current stories for pagination
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to page 1 when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1a0b2e 0%, #30176e 100%)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '30px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid rgba(255, 255, 255, 0.2)',
            borderTop: '4px solid #9c6dff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p style={{ fontSize: '18px', color: 'white' }}>Loading stories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1a0b2e 0%, #30176e 100%)',
      }}>
        <div style={{
          padding: '30px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '18px', color: '#ff6b6b', marginBottom: '15px' }}>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#9c6dff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Navigation buttons component
  const NavigationButtons = () => {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '40px',
        paddingTop: '20px',
      }}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          ← Previous
        </button>
        
        <div style={{ 
          width: '60%', 
          height: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          position: 'relative' 
        }}>
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: `${((currentPage - 1) / (totalPages - 1)) * 100}%`,
            width: `${100 / totalPages}%`,
            height: '100%',
            backgroundColor: '#9c6dff',
            transition: 'all 0.3s ease'
          }}></div>
        </div>
        
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          Next →
        </button>
      </div>
    );
  };

  // Filter button style and component
  const FilterButton = ({ label, icon, value }) => (
    <button
      onClick={() => setFilter(value)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        backgroundColor: filter === value ? 
          (value === 'new' ? '#9c6dff' : 
           value === 'inProgress' ? '#ffa64d' : 
           value === 'completed' ? '#4caf50' : 
           '#9c6dff') : 
          'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: filter === value ? 'bold' : 'normal',
        boxShadow: filter === value ? '0 4px 15px rgba(156, 109, 255, 0.4)' : 'none'
      }}
    >
      <span style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%'
      }}>
        {icon}
      </span>
      {label}
    </button>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0b2e 0%, #30176e 100%)',
      backgroundImage: `
        linear-gradient(135deg, #1a0b2e 0%, #30176e 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='1' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")
      `,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Space-themed decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.4
      }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
              animation: `twinkle ${Math.random() * 5 + 2}s infinite alternate`
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header style={{
        padding: '20px 0',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#9c6dff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🚀
              </div>
              <h1 style={{ 
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                BrainyLingo
              </h1>
            </div>
            
            <nav style={{ display: 'flex', gap: '20px' }}>
              <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 1 }}>Home</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>Leaderboard</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>Daily Quiz</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>Settings</a>
            </nav>
            
            <button style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer'
            }}>
              Sign Out
            </button>
          </div>
          
          <h1 style={{ 
            textAlign: 'center', 
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '40px',
            background: 'linear-gradient(to right, #9c6dff, #e6d9ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 2px 10px rgba(156, 109, 255, 0.3)'
          }}>
            Science Fiction Stories
          </h1>
        </div>
      </header>
      
      {/* Filter buttons */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '40px'
        }}>
          <FilterButton 
            label="New" 
            icon="A" 
            value="new"
          />
          <FilterButton 
            label="In Progress" 
            icon="🏆" 
            value="inProgress"
          />
          <FilterButton 
            label="Completed" 
            icon="✅" 
            value="completed"
          />
          <button
            onClick={() => setFilter('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              backgroundColor: filter === 'all' ? '#9c6dff' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Clear All
          </button>
        </div>
      </div>
      
      {/* Custom wave divider */}
      <div style={{
        height: '100px',
        background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23000\' fill-opacity=\'0.5\' d=\'M0,128L48,117.3C96,107,192,85,288,96C384,107,480,149,576,149.3C672,149,768,107,864,101.3C960,96,1056,128,1152,154.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        marginTop: '-50px',
        marginBottom: '-1px'
      }}></div>
      
      {/* Main content */}
      <main style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        paddingTop: '40px',
        paddingBottom: '60px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {filteredStories.length > 0 ? (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '30px', 
                justifyContent: 'center',
                perspective: '1000px'
              }}>
                {currentStories.map((story, index) => (
                  <div key={story._id} style={{
                    transform: `translateY(${(index % 2) * 10}px)`,
                    transition: 'transform 0.3s ease',
                    animation: `fadeIn 0.5s ease forwards ${index * 0.1}s`,
                    opacity: 0
                  }}>
                    <StoryCard data={story} />
                  </div>
                ))}
              </div>
              
              {/* Pagination controls */}
              {totalPages > 1 && <NavigationButtons />}
            </>
          ) : (
            <div style={{
              padding: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '18px', color: 'white' }}>
                {filter !== 'all' ? `No stories found with status "${filter}"` : 'No stories available.'}
              </p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  style={{
                    marginTop: '15px',
                    padding: '8px 16px',
                    backgroundColor: '#9c6dff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Show All Stories
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '20px 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <p style={{ margin: '0', opacity: 0.7 }}>© 2024 BrainyLingo. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Add keyframes for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes twinkle {
            from { opacity: 0.2; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}

export default Home
