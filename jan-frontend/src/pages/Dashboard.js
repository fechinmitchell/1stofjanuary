import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWizard } from '../context/WizardContext';
import { subscribeNotify } from '../services/api';
import ShareCard from '../components/ShareCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { 
    answers, 
    isLoaded, 
    isSaving, 
    resetWizard,
    wizardInProgress,
    progressPercent,
    highestVisited,
    goToStep
  } = useWizard();
  const navigate = useNavigate();
  const [showShareCard, setShowShareCard] = useState(false);
  const [show2027Modal, setShow2027Modal] = useState(false);
  const [showVisionBoardModal, setShowVisionBoardModal] = useState(false);
  const [showNoGoalsModal, setShowNoGoalsModal] = useState(false);
  const [showRedoModal, setShowRedoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [redoConfirmText, setRedoConfirmText] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [visionBoardEmail, setVisionBoardEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [visionEmailSubmitted, setVisionEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeYear, setActiveYear] = useState(2026);
  const [visibleCards, setVisibleCards] = useState([]);
  const [expandedCards, setExpandedCards] = useState(false);

  const firstName = user?.displayName?.split(' ')[0] || 'friend';
  const CONFIRM_PHRASE = "I'm starting fresh";
  const DELETE_PHRASE = "delete my account";

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

  const handleContinueWizard = () => {
    // Navigate to wizard and go to the last visited step
    goToStep(highestVisited);
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

  const handleRedoClick = () => {
    setShowRedoModal(true);
    setRedoConfirmText('');
  };

  const handleRedoConfirm = async () => {
    if (redoConfirmText === CONFIRM_PHRASE) {
      await resetWizard();
      setShowRedoModal(false);
      setRedoConfirmText('');
      navigate('/wizard');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText === DELETE_PHRASE) {
      try {
        // Clear localStorage
        if (user) {
          localStorage.removeItem(`wizard_answers_${user.uid}`);
          localStorage.removeItem(`wizard_progress_${user.uid}`);
        }
        // Reset wizard state AND delete cloud data
        await resetWizard();
        // Log out
        await logout();
        // Navigate to home
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
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
            <button 
              className="dashboard-icon-btn" 
              onClick={handleStartWizard}
              title="Edit Goals"
            >
              ✏️
            </button>
            <button 
              className={`dashboard-icon-btn ${expandedCards ? 'active' : ''}`}
              onClick={() => setExpandedCards(!expandedCards)}
              title={expandedCards ? "Collapse All" : "Expand All"}
            >
              {expandedCards ? '📖' : '📕'}
            </button>
            <button 
              className="dashboard-icon-btn" 
              onClick={() => setShowSettingsModal(true)}
              title="Settings"
            >
              ⚙️
            </button>
            <button className="dashboard-logout-btn" onClick={handleLogout}>
              <span>🚪</span>
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Continue Wizard Banner - Only shows if wizard started but no goals saved yet */}
      {wizardInProgress && totalItems === 0 && (
        <div className="continue-wizard-banner">
          <div className="continue-wizard-content">
            <div className="continue-wizard-info">
              <span className="continue-wizard-icon">✨</span>
              <div className="continue-wizard-text">
                <span className="continue-wizard-title">Continue your journey</span>
                <span className="continue-wizard-progress">{progressPercent}% complete</span>
              </div>
            </div>
            <div className="continue-wizard-progress-bar">
              <div 
                className="continue-wizard-progress-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <button className="continue-wizard-btn" onClick={handleContinueWizard}>
              Continue →
            </button>
          </div>
        </div>
      )}

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
          {/* Only show buttons if user has no goals yet */}
          {totalItems === 0 && (
            <div className="hero-buttons">
              {wizardInProgress ? (
                <button className="hero-btn primary" onClick={handleContinueWizard}>
                  ✨ Continue Wizard ({progressPercent}%)
                </button>
              ) : (
                <button className="hero-btn primary" onClick={handleStartWizard}>
                  🚀 Get Started
                </button>
              )}
            </div>
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
                className={`goal-card ${section.color} ${isVisible ? 'visible' : ''} ${expandedCards ? 'expanded' : ''}`}
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
                      {items.map((item, idx) => (
                        <li key={idx} className={idx >= 5 ? 'hidden-goal' : ''}>
                          {item}
                        </li>
                      ))}
                      {items.length > 5 && (
                        <li className="goal-more">+{items.length - 5} more (hover to see all)</li>
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
            <button className="restart-btn" onClick={handleRedoClick}>
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

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => {
          setShowSettingsModal(false);
          setShowDeleteConfirm(false);
          setDeleteConfirmText('');
        }}>
          <div className="modal-content glass-modal settings-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => {
              setShowSettingsModal(false);
              setShowDeleteConfirm(false);
              setDeleteConfirmText('');
            }}>×</button>
            
            <div className="modal-icon">⚙️</div>
            <h2 className="modal-title">Settings</h2>
            
            {!showDeleteConfirm ? (
              <div className="settings-content">
                {/* Account Info */}
                <div className="settings-section">
                  <h3 className="settings-section-title">Account</h3>
                  <div className="settings-info">
                    <div className="settings-info-row">
                      <span className="settings-label">Name</span>
                      <span className="settings-value">{user?.displayName || 'Not set'}</span>
                    </div>
                    <div className="settings-info-row">
                      <span className="settings-label">Email</span>
                      <span className="settings-value">{user?.email || 'Not set'}</span>
                    </div>
                    <div className="settings-info-row">
                      <span className="settings-label">Goals</span>
                      <span className="settings-value">{totalItems} items</span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="settings-section danger-zone">
                  <h3 className="settings-section-title">⚠️ Danger Zone</h3>
                  <p className="settings-danger-text">
                    Once you delete your account, all your goals and data will be permanently removed.
                  </p>
                  <button 
                    className="settings-delete-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    🗑️ Delete Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="delete-confirm-content">
                <p className="modal-description">
                  This will <strong>permanently delete all your data</strong> including all {totalItems} goals.
                </p>
                <p className="modal-description" style={{ marginTop: 'var(--space-md)' }}>
                  To confirm, please type <strong>{DELETE_PHRASE}</strong> below:
                </p>
                
                <div className="redo-confirm-form">
                  <input
                    type="text"
                    className="redo-confirm-input"
                    placeholder={DELETE_PHRASE}
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    autoFocus
                  />
                  <button 
                    className={`redo-confirm-btn ${deleteConfirmText === DELETE_PHRASE ? 'active' : ''}`}
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== DELETE_PHRASE}
                  >
                    🗑️ Permanently Delete Account
                  </button>
                  <button 
                    className="redo-cancel-btn"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                  >
                    ← Back to Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Redo Goals Confirmation Modal */}
      {showRedoModal && (
        <div className="modal-overlay" onClick={() => setShowRedoModal(false)}>
          <div className="modal-content glass-modal redo-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRedoModal(false)}>×</button>
            
            <div className="modal-icon">⚠️</div>
            <h2 className="modal-title">Start Fresh?</h2>
            <p className="modal-description">
              This will <strong>delete all {totalItems} of your current goals</strong> and let you start the wizard from the beginning.
            </p>
            <p className="modal-description" style={{ marginTop: 'var(--space-md)' }}>
              To confirm, please type <strong>{CONFIRM_PHRASE}</strong> below:
            </p>
            
            <div className="redo-confirm-form">
              <input
                type="text"
                className="redo-confirm-input"
                placeholder={CONFIRM_PHRASE}
                value={redoConfirmText}
                onChange={(e) => setRedoConfirmText(e.target.value)}
                autoFocus
              />
              <button 
                className={`redo-confirm-btn ${redoConfirmText === CONFIRM_PHRASE ? 'active' : ''}`}
                onClick={handleRedoConfirm}
                disabled={redoConfirmText !== CONFIRM_PHRASE}
              >
                🗑️ Delete & Start Fresh
              </button>
              <button 
                className="redo-cancel-btn"
                onClick={() => setShowRedoModal(false)}
              >
                Nevermind, keep my goals
              </button>
            </div>
          </div>
        </div>
      )}

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