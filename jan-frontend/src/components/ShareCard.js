import React, { useRef, useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { useAuth } from '../context/AuthContext';
import './ShareCard.css';

const ShareCard = ({ onClose }) => {
  const { answers } = useWizard();
  const { user } = useAuth();
  const cardRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState('highlights');
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardFormat, setCardFormat] = useState('square');

  const firstName = user?.displayName?.split(' ')[0] || 'Friend';

  const templates = {
    highlights: {
      title: '2025 Highlights',
      icon: '✨',
      sections: [
        { key: 'travelMemory', label: 'Places I Loved', icon: '✈️' },
        { key: 'bigMoment', label: 'Big Moments', icon: '🎉' },
        { key: 'quietJoy', label: 'Quiet Joys', icon: '☕' }
      ]
    },
    goals: {
      title: '2026 Goals',
      icon: '🎯',
      sections: [
        { key: 'goalsDreams', label: 'Goals', icon: '🚀' },
        { key: 'placeToVisit', label: 'Places to Visit', icon: '🗺️' },
        { key: 'habitToBuild', label: 'Habits to Build', icon: '🔄' }
      ]
    },
    vision: {
      title: 'My 2026 Vision',
      icon: '🦋',
      sections: [
        { key: 'kindOfPerson', label: 'Who I Want to Be', icon: '✨' },
        { key: 'wantToExperience', label: 'Experiences I Want', icon: '🌈' },
        { key: 'perfectDay', label: 'My Perfect Day', icon: '☀️' }
      ]
    },
    reflection: {
      title: 'Lessons from 2025',
      icon: '🪞',
      sections: [
        { key: 'habitsThatStuck', label: 'Habits That Stuck', icon: '💪' },
        { key: 'whatDidntWork', label: 'What I\'m Leaving Behind', icon: '👋' },
        { key: 'wishedMoreTimeFor', label: 'Priorities for 2026', icon: '⏰' }
      ]
    }
  };

  const currentTemplate = templates[selectedTemplate];

  const getItems = (key, limit = 4) => {
    const items = answers[key] || [];
    return items.slice(0, limit);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      // Dynamic import of html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `1stofjanuary-${selectedTemplate}-${cardFormat}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="share-modal-close" onClick={onClose}>×</button>
        
        <div className="share-modal-header">
          <h2>Create Share Card</h2>
          <p>Download and share on Instagram, Stories, or anywhere!</p>
        </div>

        <div className="share-options">
          <div className="share-option-group">
            <label>Template</label>
            <div className="share-templates">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  className={`share-template-btn ${selectedTemplate === key ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate(key)}
                >
                  <span>{template.icon}</span>
                  <span>{template.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="share-option-group">
            <label>Format</label>
            <div className="share-formats">
              <button
                className={`share-format-btn ${cardFormat === 'square' ? 'active' : ''}`}
                onClick={() => setCardFormat('square')}
              >
                <span className="format-icon square-icon"></span>
                <span>Square (1:1)</span>
              </button>
              <button
                className={`share-format-btn ${cardFormat === 'story' ? 'active' : ''}`}
                onClick={() => setCardFormat('story')}
              >
                <span className="format-icon story-icon"></span>
                <span>Story (9:16)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="share-preview-container">
          <div 
            ref={cardRef} 
            className={`share-card ${cardFormat} ${selectedTemplate}`}
          >
            <div className="share-card-bg"></div>
            
            <div className="share-card-content">
              <div className="share-card-header">
                <span className="share-card-icon">{currentTemplate.icon}</span>
                <h3 className="share-card-title">{currentTemplate.title}</h3>
                <p className="share-card-name">{firstName}'s Year</p>
              </div>

              <div className="share-card-sections">
                {currentTemplate.sections.map((section) => {
                  const items = getItems(section.key);
                  if (items.length === 0) return null;
                  
                  return (
                    <div key={section.key} className="share-card-section">
                      <div className="share-section-header">
                        <span>{section.icon}</span>
                        <span>{section.label}</span>
                      </div>
                      <div className="share-section-items">
                        {items.map((item, idx) => (
                          <span key={idx} className="share-item">{item}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="share-card-footer">
                <span className="share-card-logo">🎯 1stofjanuary.com</span>
                <span className="share-card-year">2026</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="share-download-btn"
          onClick={handleDownload}
          disabled={isGenerating}
        >
          {isGenerating ? '✨ Generating...' : '📥 Download Image'}
        </button>
      </div>
    </div>
  );
};

export default ShareCard;