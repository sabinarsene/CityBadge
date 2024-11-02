import React, { useState, useEffect, useRef } from 'react';
import { Navigation, Search, ChevronUp, Map, User, LogOut, Home, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import pfp from './Components/pfp.png';
import Chatbot from './Components/Chatbot';

const CityExplorerApp = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const toggleChat = () => setShowChat(prev => !prev);

 
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        
        if (userEmail) {
          const userQuery = query(
            collection(db, 'users'),
            where('email', '==', userEmail)
          );
          
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            setUserData(userDoc);
          }
        } else {
          navigate('/app');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };

    loadUserData();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.account-menu')) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <header className="bg-blue-600 text-white p-4 shadow-lg fixed top-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold" onClick={() => navigate('/')}>CityBadge</h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <Map size={20} />
              <span className="font-medium">12 Places</span>
            </span>
            <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full font-medium">
              {userData?.punctaj || 0} Points
            </span>
            {/* Account Menu */}
            <div className="relative account-menu">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAccountMenu(!showAccountMenu);
                }}
                className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors"
              >
                {userData?.name ? (
                  <span className="text-sm font-medium">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  // <User size={20} />
                  <img src={pfp} alt="pfp" id='app-pfp'/>
                )}
              </button>
              
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800" style={{width:'auto'}}>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium">{userData?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{userData?.email}</p>
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      {userData?.punctaj || 0} puncte
                    </p>
                  </div>
                  <button className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100">
                    <User size={18} />
                    <span>Contul meu</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-red-600"
                  >
                    <LogOut size={18} />
                    <span>Deconectare</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-20">
        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'explore' ? (
            <ExploreTab />
          ) : (
            <AchievementsTab />
          )}
        </div>
      </main>

        <div className="fixed bottom-20 right-4 flex flex-row gap-3" style={{bottom: '90px'}}>
          {showScrollTop && (
            <button
            onClick={scrollToTop}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            style={{ bottom: '130px', right: '60px' }}
          >
            <ChevronUp size={24} />
          </button>
          )}
        
        {/* Chat Button */}
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          style={{ bottom: '130px', right: '160px' }}
        >
          <MessageCircle size={24} /> {/* Lucide-react icon for chat */}
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto flex justify-center gap-12">
        <button 
            onClick={handleHomeClick}
            className="flex flex-col items-center text-gray-600"
          >
            <Home size={24} />
            <span className="text-sm mt-1">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center ${activeTab === 'explore' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <Navigation size={24} />
            <span className="text-sm mt-1">Explorează</span>
          </button>

          <button 
            onClick={() => setActiveTab('achievements')}
            className={`flex flex-col items-center ${activeTab === 'achievements' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <Search size={24} />
            <span className="text-sm mt-1">Realizări</span>
          </button>
        </div>
      </nav>
      {showChat && <Chatbot />}
    </div>
  );
};

const ExploreTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([
    {
      id: 1,
      title: "Muzeul Național de Artă",
      description: "Descoperă capodopere ale artei românești și universale",
      points: 100,
      distance: "1.2 km",
      completed: false,
      lat: 44.4396,
      lng: 26.0963
    },
    {
      id: 2,
      title: "Parcul Herăstrău",
      description: "Cel mai mare parc din București",
      points: 50,
      distance: "2.5 km",
      completed: true,
      lat: 44.4706,
      lng: 26.0784
    }
  ]);

  const observerTarget = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const newLocations = [...locations];
      for (let i = 0; i < 5; i++) {
        newLocations.push({
          id: locations.length + i + 1,
          title: `Locație ${locations.length + i + 1}`,
          description: "Descriere locație nouă",
          points: Math.floor(Math.random() * 100) + 50,
          distance: `${(Math.random() * 5).toFixed(1)} km`,
          completed: Math.random() > 0.5,
          lat: 44.4268 + (Math.random() - 0.5) * 0.1,
          lng: 26.1025 + (Math.random() - 0.5) * 0.1
        });
      }
      setLocations(newLocations);
      setLoading(false);
      if (newLocations.length >= 20) {
        setHasMore(false);
      }
    }, 1000);
  };

  const filteredLocations = locations.filter(location =>
    location.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Caută locații..."
          className="w-full p-3 border border-gray-300 rounded-lg pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      {/* Simplified Map View */}
      <div className="rounded-lg overflow-hidden shadow-lg h-96">
        <iframe
          className="w-full h-full border-0"
          src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyAafCA_cyy5BqxBmBiGaDFombVTgWWvoNk&center=44.4268,26.1025&zoom=13`}
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLocations.map((location) => (
          <LocationCard key={location.id} {...location} />
        ))}
      </div>

      {hasMore && (
        <div ref={observerTarget} className="text-center py-4">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          ) : (
            <span className="text-gray-500">Se încarcă mai multe locații...</span>
          )}
        </div>
      )}

      {!hasMore && (
        <div className="text-center py-4 text-gray-500">
          Ai văzut toate locațiile disponibile!
        </div>
      )}
    </div>
  );
};

const LocationCard = ({ title, description, points, distance, completed }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{title}</h3>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          {points} puncte
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">La {distance}</span>
        {completed ? (
          <span className="text-green-600 text-sm flex items-center gap-1">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Completat
          </span>
        ) : (
          <button className="text-blue-600 text-sm hover:underline">
            Vezi detalii
          </button>
        )}
      </div>
    </div>
  );
};

const AchievementsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [achievements] = useState([
    {
      id: 1,
      title: "Explorator Cultural",
      description: "Vizitează 5 muzee",
      progress: 3,
      total: 5
    },
    {
      id: 2,
      title: "Iubitor de Natură",
      description: "Explorează 10 parcuri",
      progress: 8,
      total: 10
    }
  ]);

  const filteredAchievements = achievements.filter(achievement =>
    achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Caută realizări..."
          className="w-full p-3 border border-gray-300 rounded-lg pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} {...achievement} />
        ))}
      </div>
    </div>
  );
};

const AchievementCard = ({ title, description, progress, total }) => {
  const percentage = (progress / total) * 100;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
        <span className="text-blue-600 text-xl font-bold">
          {progress}/{total}
        </span>
      </div>
      <h3 className="font-medium text-center mb-1">{title}</h3>
      <p className="text-gray-600 text-sm text-center mb-2">{description}</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 rounded-full h-2 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CityExplorerApp;