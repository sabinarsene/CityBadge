import React, { useState, useEffect, useRef } from 'react';
import { Navigation, Search, ChevronUp, Map, User, LogOut, Home, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
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
  const [code, setCode] = useState('');

 
  useEffect(() => {
    const loadUserData = () => {
      const userEmail = localStorage.getItem('userEmail');
  
      if (userEmail) {
        const userQuery = query(
          collection(db, 'users'),
          where('email', '==', userEmail)
        );
  
        const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            setUserData(userDoc);
          }
        });
  
        return () => unsubscribe(); // Clean up the listener on unmount
      } else {
        navigate('/app');
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800" style={{width:'300px'}}>
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
      title: "Palatul Parlamentului",
      description: "Cea mai mare clădire civilă din lume și sediul Parlamentului României",
      points: 150,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: false,
      lat: 44.4273,
      lng: 26.0875,
      image: "palatul-parlamentului.jpg",
      category: "Clădire"
    },
    {
      id: 2,
      title: "Ateneul Roman",
      description: "Sală de concerte emblematică și un reper cultural important al Bucureștiului",
      points: 100,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: true,
      lat: 44.4412,
      lng: 26.0963,
      image: "ateneul-roman.jpg",
      category: "Clădire"
    },
    {
      id: 3,
      title: "Muzeul Național de Artă al României",
      description: "Găzduiește o colecție impresionantă de artă românească și europeană",
      points: 120,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: true,
      lat: 44.4396,
      lng: 26.0965,
      image: "muzeul-national-arta.jpg",
      category: "Muzeu"
    },
    {
      id: 4,
      title: "Grădina Botanică",
      description: "Oază verde cu mii de specii de plante și sere spectaculoase",
      points: 80,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: false,
      lat: 44.4330,
      lng: 26.0688,
      image: "gradina-botanica.jpg",
      category: "Parc"
    },
    {
      id: 5,
      title: "Casa Ceaușescu",
      description: "Fostă reședință a familiei Ceaușescu, acum muzeu",
      points: 100,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: true,
      lat: 44.4665,
      lng: 26.1039,
      image: "casa-ceausescu.jpg",
      category: "Muzeu"
    },
    {
      id: 6,
      title: "Arcul de Triumf",
      description: "Monument istoric dedicat victoriei în Primul Război Mondial",
      points: 90,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: false,
      lat: 44.4672,
      lng: 26.0781,
      image: "arcul-de-triumf.jpg",
      category: "Clădire"
    },
    {
      id: 7,
      title: "Parcul Herăstrău",
      description: "Cel mai mare parc din București, perfect pentru plimbări și activități în aer liber",
      points: 70,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: false,
      lat: 44.4706,
      lng: 26.0784,
      image: "parcul-herastrau.jpg",
      category: "Parc"
    },
    {
      id: 8,
      title: "Muzeul Satului",
      description: "Muzeu în aer liber ce prezintă arhitectura tradițională românească",
      points: 110,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: true,
      lat: 44.4722,
      lng: 26.0744,
      image: "muzeul-satului.jpg",
      category: "Muzeu"
    },
    {
      id: 9,
      title: "Cișmigiu",
      description: "Cel mai vechi parc public din București, cu grădini frumoase și lac",
      points: 60,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: false,
      lat: 44.4353,
      lng: 26.0894,
      image: "cismigiu.jpg",
      category: "Parc"
    },
    {
      id: 10,
      title: "Centrul Vechi",
      description: "Zona istorică a Bucureștiului, cu străzi pietonale și arhitectură deosebită",
      points: 130,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: true,
      lat: 44.4323,
      lng: 26.1012,
      image: "centrul-vechi.jpg",
      category: "Clădire"
    },
    {
      id: 11,
      title: "Biserica Stavropoleos",
      description: "Biserică în stil brâncovenesc cu o arhitectură unică",
      points: 85,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: false,
      lat: 44.4314,
      lng: 26.0986,
      image: "biserica-stavropoleos.jpg",
      category: "Clădire"
    },
    {
      id: 12,
      title: "Muzeul George Enescu",
      description: "Dedicat marelui compozitor român, găzduit într-un palat Art Nouveau",
      points: 95,
      distance: `${(Math.random() * 5).toFixed(1)} km`,
      completed: false,
      lat: 44.4397,
      lng: 26.0977,
      image: "muzeul-enescu.jpg",
      category: "Muzeu"
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

  const handleLocationComplete = (id) => {
    setLocations(prevLocations =>
      prevLocations.map(location =>
        location.id === id ? { ...location, completed: true } : location
      )
    );
  };

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
          <LocationCard 
            key={location.id} 
            {...location} 
            onComplete={handleLocationComplete} // Pass the completion handler
          />
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

const LocationCard = ({ id, title, description, points, distance, completed, onComplete }) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Noua stare pentru popup

  return (
    <div>
      <div
        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
        onClick={() => setShowPopup(true)} // Afișează popup-ul când cardul este apăsat
      >
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
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Previi afișarea popup-ului pe click
                setShowVerificationModal(true);
              }}
              className="text-blue-600 text-sm hover:underline"
              style={{backgroundColor:'#dbeafe', padding:'5px', borderRadius:'5px', }}
            >
              Am ajuns aici
            </button>
          )}
        </div>
      </div>

      {/* Popup-ul cu descrierea locației */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-center mb-4">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
            >
              Închide
            </button>
          </div>
        </div>
      )}

      {showVerificationModal && (
        <LocationVerificationModal 
          onClose={() => setShowVerificationModal(false)} 
          onComplete={onComplete} 
          locationId={id} 
        />
      )}
    </div>
  );
};


const LocationVerificationModal = ({ onClose, onComplete, locationId }) => {
  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    if (code === 'qArs1') {
      const userEmail = localStorage.getItem('userEmail');
  
      if (userEmail) {
        try {
          const userRef = query(collection(db, 'users'), where('email', '==', userEmail));
          const userSnapshot = await getDocs(userRef);
          
          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            const newPoints = userDoc.data().punctaj + 100;
  
            await updateDoc(userDoc.ref, { punctaj: newPoints });
            onComplete(locationId);
            onClose();
          }
        } catch (error) {
          console.error('Error updating user points:', error);
          alert('A apărut o eroare. Vă rugăm să încercați din nou.');
        }
      }
    } else {
      alert('Cod incorect. Încercați din nou.');
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold text-center mb-4">Introduceți Codul Unic</h2>
        <input
          type="text"
          placeholder="Cod"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700">
            Anulare
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Trimite
          </button>
        </div>
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