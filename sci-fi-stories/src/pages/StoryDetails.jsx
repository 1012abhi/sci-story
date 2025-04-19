import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TabsComponent from '../components/TabsComponent';
import { Brain, BookOpen, Gamepad2, LogOut, Trophy, Calendar, ChevronDown } from 'lucide-react';

function StoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [prevStory, setPrevStory] = useState(null);
  const [nextStory, setNextStory] = useState(null);
  const [selectedMode, setSelectedMode] = useState(1);

  // Fetch all stories for navigation
  useEffect(() => {
    fetch("https://mxpertztestapi.onrender.com/api/sciencefiction")
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch stories list')
        }
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setAllStories(data);
        }
      })
      .catch(err => {
        console.error('Error fetching all stories:', err)
      })
  }, [])

  // Set up previous and next story links
  useEffect(() => {
    if (allStories.length > 0 && id) {
      const currentIndex = allStories.findIndex(story => story._id === id);
      
      if (currentIndex > 0) {
        setPrevStory(allStories[currentIndex - 1]);
      } else {
        setPrevStory(null);
      }
      
      if (currentIndex < allStories.length - 1 && currentIndex !== -1) {
        setNextStory(allStories[currentIndex + 1]);
      } else {
        setNextStory(null);
      }
    }
  }, [allStories, id])

  useEffect(() => {
    setLoading(true)
    fetch(`https://mxpertztestapi.onrender.com/api/sciencefiction/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch story details')
        }
        return res.json()
      })
      .then(data => {
        console.log('Fetched story details:', data)
        
        // Validate the data
        if (!data) {
          console.error('No data received for story ID:', id);
          setError('Story not found');
        } else {
          // Check for missing Image property
          if (!data.Image) {
            console.warn('Story is missing Image property:', data);
          }
          setStory(data);
        }
        
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching story details:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  // Generate word pairs based on story data
  const generateWordPairs = () => {
    if (!story) return [];
    
    // Use story image as first pair, or default to placeholder
    const storyImage = getCleanImageUrl(story?.Image) || "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&auto=format&fit=crop&q=60";
    
    const baseWordPairs = [
      {
        id: 1,
        image: storyImage,
        title: story.Title || "Space Portal"
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
        title: "Galaxy View"
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=60",
        title: "Nebula"
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60",
        title: "Space Ship"
      }
    ];

    return [...baseWordPairs, ...baseWordPairs.map((pair, i) => ({ ...pair, id: i + 5 }))];
  };

  const gameModes = [
    {
      id: 1,
      title: 'Word Explorer',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 2,
      title: 'Story Adventure',
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 3,
      title: 'Brain Quest',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-pink-500 to-purple-600'
    }
  ];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex justify-center items-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-300">Loading story details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex justify-center items-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-md">
          <p className="text-lg text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex justify-center items-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-md">
          <p className="text-lg text-gray-300 mb-4">Story not found</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 bg-[#0B1120]/90 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                BrainyLingo
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors">Home</a>
              <a href="#" className="hover:text-blue-500 transition-colors flex items-center">
                <Trophy className="h-5 w-5 mr-1" />
                Leaderboard
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors flex items-center">
                <Calendar className="h-5 w-5 mr-1" />
                Daily Quiz
              </a>
              <div className="relative group">
                <button className="hover:text-blue-500 transition-colors flex items-center">
                  Genre
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <a href="#" className="block px-4 py-2 hover:bg-gray-800">Science Fiction</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-800">Fantasy</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-800">Mystery</a>
                </div>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-300 flex items-center">
                <LogOut className="h-5 w-5 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          <span className="text-blue-500">The Story of</span>{' '}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            {story.Title}
          </span>
        </h1>

        {/* Game Modes */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                selectedMode === mode.id
                  ? `bg-gradient-to-r ${mode.color} shadow-lg scale-105`
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {mode.icon}
              <span className="ml-2 font-medium">{mode.title}</span>
            </button>
          ))}
        </div>

        {selectedMode === 1 && (
          <>
            <p className="text-center text-gray-400 mb-8">
              Drag Pictures to the matching Words, light up correct pairs, shake for a retry
            </p>

            {/* Word Pairs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {generateWordPairs().map((pair) => (
                <div
                  key={pair.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={pair.image}
                    alt={pair.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-4">
                    <p className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                      {pair.title}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </>
        )}

        {selectedMode === 2 && (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Story Adventure</h3>
            <TabsComponent story={story} />
          </div>
        )}

        {selectedMode === 3 && (
          <div className="bg-gray-900 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Brain Quest</h3>
            <p className="text-gray-400 mb-4">Test your knowledge about this story with interactive quizzes</p>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transition-all duration-300">
              Start Quiz
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <button 
            onClick={() => prevStory && navigate(`/story/${prevStory._id}`)}
            className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
              prevStory 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-800 cursor-not-allowed opacity-50'
            }`}
            disabled={!prevStory}
          >
            ← Previous Story
          </button>
          
          <button 
            onClick={() => nextStory && navigate(`/story/${nextStory._id}`)}
            className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
              nextStory 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-800 cursor-not-allowed opacity-50'
            }`}
            disabled={!nextStory}
          >
            Next Story →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 text-center py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-500">© 2024 BrainyLingo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default StoryDetails;
