import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCapacityStatus, joinWaitlist, getWaitlistCount } from '../services/api';
import './Waitlist.css';

const Waitlist = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(null);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if capacity opened up
    const checkCapacity = async () => {
      try {
        const status = await getCapacityStatus();
        if (status.hasCapacity) {
          // Spots available! Redirect to landing
          navigate('/', { state: { spotsAvailable: true } });
        }
      } catch (err) {
        console.log('Could not check capacity');
      }
    };

    const fetchWaitlistCount = async () => {
      try {
        const data = await getWaitlistCount();
        setWaitlistCount(data.count);
      } catch (err) {
        console.log('Could not get waitlist count');
      }
    };

    checkCapacity();
    fetchWaitlistCount();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await joinWaitlist(email);
      
      if (result.alreadyUser) {
        setError('You already have an account! Try signing in on the home page.');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setPosition(result.position);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="waitlist">
      <div className="waitlist-content">
        {!submitted ? (
          <>
            <div className="waitlist-icon">🎯</div>
            <h1 className="waitlist-title">We're at capacity!</h1>
            <p className="waitlist-subtitle">
              So many people want to plan their best year ever that we've hit our limit.
              <br />
              <span className="waitlist-highlight">But don't worry — we're opening more spots soon!</span>
            </p>

            {waitlistCount > 0 && (
              <div className="waitlist-count">
                <span className="waitlist-count-number">{waitlistCount}</span>
                <span className="waitlist-count-text">people waiting</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="waitlist-form">
              <div className="waitlist-input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="waitlist-input"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  className="waitlist-submit"
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? '...' : 'Notify Me'}
                </button>
              </div>
              {error && <p className="waitlist-error">{error}</p>}
            </form>

            <p className="waitlist-promise">
              We'll only email you when spots open up. No spam, promise! ✨
            </p>

            <button 
              className="waitlist-home-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </>
        ) : (
          <>
            <div className="waitlist-icon success">🎉</div>
            <h1 className="waitlist-title">You're on the list!</h1>
            {position && (
              <p className="waitlist-position">
                You're <span className="position-number">#{position}</span> in line
              </p>
            )}
            <p className="waitlist-subtitle">
              We'll send you an email the moment spots open up.
              <br />
              Keep an eye on your inbox!
            </p>
            
            <div className="waitlist-share">
              <p>Know someone who'd love this?</p>
              <button 
                className="waitlist-share-btn"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: '1st of January - Plan Your Year',
                      text: 'Plan your best year ever in just 5 minutes!',
                      url: window.location.origin
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.origin);
                    alert('Link copied to clipboard!');
                  }
                }}
              >
                Share the link 💌
              </button>
            </div>

            <button 
              className="waitlist-home-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </>
        )}
      </div>

      <div className="waitlist-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
};

export default Waitlist;