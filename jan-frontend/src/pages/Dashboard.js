import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWizard } from '../context/WizardContext';
import { subscribeNotify } from '../services/api';
import ShareCard from '../components/ShareCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { answers, isLoaded, isSaving } = useWizard();
  const navigate = useNavigate();
  const [showShareCard, setShowShareCard] = useState(false);
  const [show2027Modal, setShow2027Modal] = useState(false);
  const [showVisionBoardModal, setShowVisionBoardModal] = useState(false);
  const [showNoGoalsModal, setShowNoGoalsModal] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [visionBoardEmail, setVisionBoardEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [visionEmailSubmitted, setVisionEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeYear, setActiveYear] = useState(2026);
  const [visibleCards, setVisibleCards] = useState([]);

  const firstName = user?.displayName?.split(' ')[0] || 'friend';

  const sections = activeYear === 2026 ? [
    {
      key: 'kindOfPerson',
      title: 'Who I Want to Be',
      icon: '🦋',
      color: 'purple',
      empty: 'What kind of person do you want to become?'
    },
    {
      key: 'goalsDreams',
      title: 'Goals & Dreams',
      icon: '🚀',
      color: 'coral',
      empty: 'What do you want to achieve?'
    },
    {
      key: 'placeToVisit',
      title: 'Places to Visit',
      icon: '🗺️',
      color: 'mint',
      empty: 'Where do you want to go?'
    },
    {
      key: 'habitToBuild',
      title: 'Habits to Build',
      icon: '🔄',
      color: 'blue',
      empty: 'What habits will transform you?'
    },
    {
      key: 'wantToExperience',
      title: 'Experiences I Want',
      icon: '✨',
      color: 'yellow',
      empty: 'What do you want to experience?'
    },
    {
      key: 'savingFor',
      title: 'Saving For',
      icon: '💰',
      color: 'green',
      empty: 'What are you saving for?'
    },
    {
      key: 'perfectDay',
      title: 'My Perfect Day',
      icon: '☀️',
      color: 'orange',
      empty: 'What does your ideal day look like?'
    },
    {
      key: 'wishedMoreTimeFor',
      title: 'More Time For',
      icon: '⏰',
      color: 'pink',
      empty: 'What deserves more of your time?'
    }
  ] : [
    {
      key: 'travelMemory',
      title: 'Places I Travelled',
      icon: '✈️',
      color: 'mint',
      empty: 'No travel memories yet'
    },
    {
      key: 'bigMoment',
      title: 'Big Moments',
      icon: '🎉',
      color: 'purple',
      empty: 'No big moments yet'
    },
    {
      key: 'quietJoy',
      title: 'Quiet Joys',
      icon: '☕',
      color: 'yellow',
      empty: 'No quiet joys yet'
    },
    {
      key: 'habitsThatStuck',
      title: 'Habits That Stuck',
      icon: '💪',
      color: 'coral',
      empty: 'No habits recorded yet'
    },
    {
      key: 'personWhoMadeYear',
      title: 'Special People',
      icon: '❤️',
      color: 'pink',
      empty: 'No people added yet'
    },
    {
      key: 'whatDidntWork',
      title: 'Lessons Learned',
      icon: '🪞',
      color: 'blue',
      empty: 'No reflections yet'
    }
  ];

  // Animate cards appearing
  useEffect(() => {
    if (isLoaded) {
      setVisibleCards([]);
      const timer = setTimeout(() => {
        sections.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards(prev => [...prev, index]);
          }, index * 80);
        });
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, activeYear]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleStartWizard = () => {
    navigate('/wizard');
  };

  const handleYearClick = (year) => {
    if (year === 2027) {
      setShow2027Modal(true);
    } else {
      setActiveYear(year);
    }
  };

  const handleShareClick = () => {
    if (totalItems > 0) {
      setShowShareCard(true);
    } else {
      setShowNoGoalsModal(true);
    }
  };

  const handleDownloadPDF = () => {
    if (totalItems > 0) {
      alert('📄 PDF Download coming soon!\n\nFor now, use the Share Card feature to download an image you can print or share on social media.');
    } else {
      setShowNoGoalsModal(true);
    }
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await subscribeNotify(notifyEmail, '2027_goals');
      setEmailSubmitted(true);
      setTimeout(() => {
        setShow2027Modal(false);
        setEmailSubmitted(false);
        setNotifyEmail('');
      }, 2000);
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('Failed to subscribe. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleVisionBoardNotify = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await subscribeNotify(visionBoardEmail, 'vision_board');
      setVisionEmailSubmitted(true);
      setTimeout(() => {
        setShowVisionBoardModal(false);
        setVisionEmailSubmitted(false);
        setVisionBoardEmail('');
      }, 2000);
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('Failed to subscribe. Please try again.');
    }
    setIsSubmitting(false);
  };

  // Count total items
  const totalItems = Object.values(answers).reduce((total, value) => {
    if (Array.isArray(value)) {
      return total + value.length;
    }
    return total;
  }, 0);

  if (!isLoaded) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">🎯</div>
        <p>Loading your goals...</p>
      </div>
    );
  }

  return (
    <div className="dashboard glass-theme">
      {/* Background */}
      <div className="dashboard-bg">
        <div className="bg-gradient"></div>
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo" onClick={() => navigate('/')}>
            <span className="dashboard-logo-icon">🎯</span>
            <span className="dashboard-logo-text">1st of January</span>
          </div>
          <div className="dashboard-user">
            {isSaving && <span className="saving-indicator">💾 Saving...</span>}
            <span className="dashboard-user-name">Hey, {firstName}!</span>
            <button className="dashboard-logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Year Tabs */}
      <div className="year-tabs-container">
        <div className="year-tabs">
          <button 
            className={`year-tab ${activeYear === 2025 ? 'active' : ''}`}
            onClick={() => handleYearClick(2025)}
          >
            <span className="year-tab-icon">📖</span>
            <span>2025</span>
            <span className="year-tab-label">Look Back</span>
          </button>
          <button 
            className={`year-tab ${activeYear === 2026 ? 'active' : ''}`}
            onClick={() => handleYearClick(2026)}
          >
            <span className="year-tab-icon">🎯</span>
            <span>2026</span>
            <span className="year-tab-label">Goals</span>
          </button>
          <button 
            className="year-tab disabled"
            onClick={() => handleYearClick(2027)}
          >
            <span className="year-tab-icon">🔒</span>
            <span>2027</span>
            <span className="year-tab-label">Coming Soon</span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {activeYear === 2026 ? 'My 2026 Goals' : 'My 2025 Highlights'}
          </h1>
          <p className="hero-subtitle">
            {totalItems > 0 
              ? `${totalItems} intentions set for an amazing year ✨`
              : 'Start building your vision for the year ahead'
            }
          </p>
          {totalItems === 0 && (
            <button className="hero-btn primary" onClick={handleStartWizard}>
              🚀 Get Started
            </button>
          )}
        </div>
      </div>

      {/* Goals Grid */}
      <main className="dashboard-main">
        <div className="goals-grid">
          {sections.map((section, index) => {
            const items = answers[section.key] || [];
            const hasItems = items.length > 0;
            const isVisible = visibleCards.includes(index);
            
            return (
              <div 
                key={section.key}
                className={`goal-card ${section.color} ${isVisible ? 'visible' : ''}`}
                style={{ '--delay': `${index * 0.08}s` }}
              >
                <div className="goal-card-header">
                  <span className="goal-card-icon">{section.icon}</span>
                  <h3 className="goal-card-title">{section.title}</h3>
                  {hasItems && <span className="goal-card-count">{items.length}</span>}
                </div>
                <div className="goal-card-content">
                  {hasItems ? (
                    <ul className="goal-list">
                      {items.slice(0, 5).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                      {items.length > 5 && (
                        <li className="goal-more">+{items.length - 5} more</li>
                      )}
                    </ul>
                  ) : (
                    <p className="goal-empty">{section.empty}</p>
                  )}
                </div>
                {!hasItems && (
                  <button className="goal-add-btn" onClick={handleStartWizard}>
                    + Add Goals
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Action Buttons */}
        <div className="floating-actions">
          <button 
            className={`floating-btn ${totalItems === 0 ? 'btn-disabled' : ''}`}
            onClick={handleShareClick}
            title="Share Card"
          >
            <span className="floating-btn-icon">📱</span>
            <span className="floating-btn-text">Share</span>
          </button>
          <button 
            className={`floating-btn ${totalItems === 0 ? 'btn-disabled' : ''}`}
            onClick={handleDownloadPDF}
            title="Download PDF"
          >
            <span className="floating-btn-icon">📄</span>
            <span className="floating-btn-text">PDF</span>
          </button>
        </div>

        {/* Vision Board Teaser */}
        <section className="vision-board-teaser">
          <div className="vision-board-content" onClick={() => setShowVisionBoardModal(true)}>
            <div className="vision-board-preview">
              <div className="vision-preview-item item-1">🏖️</div>
              <div className="vision-preview-item item-2">🏠</div>
              <div className="vision-preview-item item-3">💪</div>
              <div className="vision-preview-item item-4">✈️</div>
              <div className="vision-preview-item item-5">🎯</div>
              <div className="vision-preview-item item-6">💰</div>
              <div className="vision-board-overlay">
                <span className="vision-lock-icon">🔒</span>
              </div>
            </div>
            <div className="vision-board-text">
              <h3>✨ Vision Board</h3>
              <p>Create a beautiful visual board with images that inspire your goals</p>
              <span className="vision-board-badge">Coming Soon</span>
            </div>
          </div>
        </section>

        {/* Restart Wizard Section */}
        {totalItems > 0 && (
          <section className="restart-section">
            <button className="restart-btn" onClick={handleStartWizard}>
              🔄 Redo My Goals
            </button>
            <p className="restart-hint">Start fresh and go through the questions again</p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Made with ❤️ for your best year yet</p>
        <p className="footer-small">Your goals are synced to the cloud ☁️</p>
      </footer>

      {/* 2027 Modal */}
      {show2027Modal && (
        <div className="modal-overlay" onClick={() => setShow2027Modal(false)}>
          <div className="modal-content glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShow2027Modal(false)}>×</button>
            
            {!emailSubmitted ? (
              <>
                <div className="modal-icon">🔮</div>
                <h2 className="modal-title">2027 Goals Coming Soon!</h2>
                <p className="modal-description">
                  Your 2027 planning will unlock on<br />
                  <strong>January 1st, 2027</strong>
                </p>
                <p className="modal-description" style={{ marginTop: 'var(--space-md)' }}>
                  Want us to remind you when it's ready?
                </p>
                <form onSubmit={handleNotifySubmit} className="notify-form">
                  <input
                    type="email"
                    className="notify-input"
                    placeholder="Enter your email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <button type="submit" className="notify-btn" disabled={isSubmitting}>
                    {isSubmitting ? '⏳ Subscribing...' : '🔔 Notify Me'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="modal-icon">✅</div>
                <h2 className="modal-title">You're on the list!</h2>
                <p className="modal-description">
                  We'll send you a reminder on January 1st, 2027
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Vision Board Modal */}
      {showVisionBoardModal && (
        <div className="modal-overlay" onClick={() => setShowVisionBoardModal(false)}>
          <div className="modal-content glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowVisionBoardModal(false)}>×</button>
            
            {!visionEmailSubmitted ? (
              <>
                <div className="modal-icon">🎨</div>
                <h2 className="modal-title">Vision Board Coming Soon!</h2>
                <p className="modal-description">
                  We're building something beautiful ✨<br /><br />
                  Soon you'll be able to create a stunning visual board with images that represent your goals and dreams.
                </p>
                <div className="vision-features">
                  <div className="vision-feature">🖼️ Add inspiring images</div>
                  <div className="vision-feature">✨ Beautiful layouts</div>
                  <div className="vision-feature">📱 Share on social</div>
                  <div className="vision-feature">🖨️ Print as a poster</div>
                </div>
                <p className="modal-description" style={{ marginTop: 'var(--space-md)' }}>
                  Want to be first to know when it launches?
                </p>
                <form onSubmit={handleVisionBoardNotify} className="notify-form">
                  <input
                    type="email"
                    className="notify-input"
                    placeholder="Enter your email"
                    value={visionBoardEmail}
                    onChange={(e) => setVisionBoardEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  <button type="submit" className="notify-btn" disabled={isSubmitting}>
                    {isSubmitting ? '⏳ Subscribing...' : '🔔 Notify Me'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="modal-icon">✅</div>
                <h2 className="modal-title">You're on the list!</h2>
                <p className="modal-description">
                  We'll let you know as soon as Vision Board is ready!
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* No Goals Modal */}
      {showNoGoalsModal && (
        <div className="modal-overlay" onClick={() => setShowNoGoalsModal(false)}>
          <div className="modal-content glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNoGoalsModal(false)}>×</button>
            <div className="modal-icon">✍️</div>
            <h2 className="modal-title">Add Some Goals First!</h2>
            <p className="modal-description">
              Before you can share or download, you'll need to set some goals for the year ahead.
            </p>
            <button 
              className="notify-btn" 
              style={{ marginTop: 'var(--space-lg)', width: '100%' }}
              onClick={() => {
                setShowNoGoalsModal(false);
                navigate('/wizard');
              }}
            >
              🚀 Let's Get Started
            </button>
          </div>
        </div>
      )}

      {/* Share Card Modal */}
      {showShareCard && (
        <ShareCard onClose={() => setShowShareCard(false)} />
      )}
    </div>
  );
};

export default Dashboard;