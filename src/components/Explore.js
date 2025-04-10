import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Explore.css';
import { toast, ToastContainer } from 'react-toastify';

const Explore = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showTripForm, setShowTripForm] = useState(false);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);

  const [formData, setFormData] = useState({
    location: '',
    dateFrom: '',
    dateTo: '',
    adults: 1,
    children: 0,
    pets: 0,
    budget: ''
  });

  const quizQuestions = [
    {
      question: "Which Indian destination is on your bucket list?",
      options: ["Leh-Ladakh 🏔️", "Kerala Backwaters 🚣", "Jaipur Palaces 🏰", "Goa Beaches 🏖️"]
    },
    {
      question: "What type of trip do you love most in India?",
      options: ["Spiritual - Varanasi", "Adventure - Rishikesh", "Romantic - Udaipur", "Nature - Munnar"]
    },
    {
      question: "Your preferred travel season?",
      options: ["Winter ❄️", "Summer ☀️", "Monsoon 🌧️", "All Seasons 🌈"]
    },
    {
      question: "Which festival would you love to celebrate while traveling?",
      options: ["Holi in Mathura 🎨", "Diwali in Jaipur 🪔", "Durga Puja in Kolkata 🐯", "Ganesh Chaturthi in Mumbai 🐘"]
    },
    {
      question: "Choose your ideal stay during a trip:",
      options: ["Houseboat in Kerala 🚤", "Desert camp in Jaisalmer 🏜️", "Homestay in Himachal 🏡", "Luxury resort in Udaipur 🏞️"]
    }
  ];

  const handlePrediction = async () => {
    const placeName = formData.location || "Mumbai";

    const dataToSend = {
      place: placeName
    };

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (result.success) {
        console.log("Places:", result.places);
        setRecommendedPlaces(result.places);
        toast.success(`Top Places in ${result.location}: ${result.places.join(', ')}`, { autoClose: 4000 });
      } else {
        console.error("Prediction error:", result.error);
        // toast.error(`Prediction failed: ${result.error}`);
      }

    } catch (error) {
      console.error("Prediction request failed:", error);
      toast.error("Prediction request failed. Check console or server.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const goBack = () => setActiveFilter(null);

  const handlePlaceClick = (placeName) => {
    navigate('/travelbot', { state: { selectedPlace: placeName} });
  };

  const handleOptionClick = (option) => {
    setAnswers([...answers, option]);
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowQuiz(false);
      setCurrentQuestionIndex(0);
      toast.success("Thanks for completing the quiz! 🎉", { autoClose: 3000 });
    }
  };

  return (
    <div className="dashboard">
    
      <aside className="sidebar">
        <h2>✨ Team Travel.</h2>
        <nav><a href="#">Chats</a></nav>
        <button className="new-chat1" onClick={() => navigate('/travelbot')}>New chat</button>
        <footer><small>© 2025 Team Travel, Inc.</small></footer>
      </aside>

      <main className="main-content">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        rtl={false}
        closeOnClick
        pauseOnHover
        draggable
        hideProgressBar={false}
        newestOnTop={false}
        closeButton={false}
      />
        <h1>Where to today?</h1>
        <p className="subtext">
          Hey there, where would you like to go? I’m here to assist you in planning your experience. Ask me anything travel related.
        </p>

        {showQuiz ? (
          <div className="quiz-section">
            <h2>Travel Quiz 🧳</h2>
            <h3>{quizQuestions[currentQuestionIndex].question}</h3>
            <ul className="quiz-options">
              {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                <li key={idx} onClick={() => handleOptionClick(option)}>{option}</li>
              ))}
            </ul>
          </div>
        ) : (
          <section className="tiles">
            <h2>Get started</h2>
            <div className="tile-container">
              <div className="tile" onClick={() => setShowQuiz(true)}>Take our travel quiz</div>
              <div className="tile" onClick={() => setShowTripForm(true)}>Create a trip</div>
            </div>

            {showTripForm && (
              <div className="filter-section">
                <h3>Wants trip Suggestion?</h3>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter destination (e.g., Mumbai)"
                />
                <button onClick={handlePrediction}>Find Best Match</button>
                <button onClick={() => {
                  setShowTripForm(false);
                  setRecommendedPlaces([]); 
                }}>Back</button>
              </div>
            )}

            {/* Suggested Places */}
            {recommendedPlaces.length > 0 && (
              <div className="suggested-places-container">
                <h3>Suggested Places</h3>
                <div className="suggested-places-grid">
                {[...new Set(recommendedPlaces)].slice(0, 4).map((place, index) => (
                    <div key={index} className="suggested-tile" onClick={() => handlePlaceClick(place)}>
                      {place}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2>Get inspired</h2>
            <div className="tile-container">
              <div className="tile" onClick={() => handlePlaceClick('Gateway of India')}>Gateway of India</div>
              <div className="tile" onClick={() => handlePlaceClick('Sanjay Gandhi National Park')}>Sanjay Gandhi National Park</div>
              <div className="tile" onClick={() => handlePlaceClick('Juhu Beach Mumbai')}>Juhu Beach</div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Explore;
