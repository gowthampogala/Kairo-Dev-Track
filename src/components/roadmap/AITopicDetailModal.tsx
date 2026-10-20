import React, { useState } from 'react';
import {
  X,
  Check,
  BookOpen,
  Clock,
  FileText,
  Calendar,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu
} from 'lucide-react';
import { AITopic, AIRepositoryResource } from '../../types';
import { useApp } from '../../context/AppContext';
import { Checkbox } from '../common/Checkbox';

interface AITopicDetailModalProps {
  topic: AITopic | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const AITopicDetailModal: React.FC<AITopicDetailModalProps> = ({
  topic,
  onClose,
  onNext,
  onPrev
}) => {
  const {
    state,
    toggleAITopic,
    toggleAIDailyPlan,
    updateAITopicNotes,
    logAIStudyTime
  } = useApp();

  const [activeTab, setActiveTab] = useState<'concepts' | 'practice' | 'notes'>('concepts');

  if (!topic) return null;

  const topicState = state.aiRoadmap?.[topic.id] || { completed: false };
  const isCompleted = !!topicState.completed;
  const inDailyPlan = !!topicState.inDailyPlan;
  const notes = topicState.notes || '';
  const studyMinutes = topicState.studyMinutes || 0;

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Concept':
        return { bg: 'rgba(2, 184, 204, 0.1)', text: 'var(--color-signal-teal)', border: 'rgba(2, 184, 204, 0.25)' };
      case 'Practice':
        return { bg: 'rgba(99, 102, 241, 0.1)', text: 'var(--color-iris-violet)', border: 'rgba(99, 102, 241, 0.25)' };
      case 'Code':
        return { bg: 'rgba(228, 242, 34, 0.1)', text: 'var(--color-acid-lime)', border: 'rgba(228, 242, 34, 0.25)' };
      case 'Project':
        return { bg: 'rgba(39, 166, 68, 0.12)', text: 'var(--color-pulse-green)', border: 'rgba(39, 166, 68, 0.3)' };
      case 'Advanced':
        return { bg: 'rgba(139, 92, 246, 0.12)', text: 'var(--color-lavender)', border: 'rgba(139, 92, 246, 0.3)' };
      case 'Production':
        return { bg: 'rgba(235, 87, 87, 0.12)', text: 'var(--color-coral-red)', border: 'rgba(235, 87, 87, 0.3)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', text: 'var(--color-fog)', border: 'var(--color-graphite)' };
    }
  };

  const typeColor = getTypeBadgeColor(topic.type);

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-container"
        style={{
          maxWidth: '740px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-carbon)',
          border: '1px solid var(--color-graphite)',
          borderRadius: 'var(--radius-cards)',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--color-graphite)',
            background: 'var(--color-obsidian)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                className={`number-badge ${isCompleted ? 'completed' : ''}`}
                style={{ fontSize: '13px', padding: '3px 8px' }}
              >
                #{String(topic.number).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  background: 'var(--color-charcoal)',
                  color: 'var(--color-mist)',
                  border: '1px solid var(--color-graphite)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                {topic.phase}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  background: typeColor.bg,
                  color: typeColor.text,
                  border: `1px solid ${typeColor.border}`,
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                {topic.type}
              </span>
            </div>

            {/* Navigation & Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {onPrev && (
                <button
                  onClick={onPrev}
                  className="btn"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                  title="Previous topic"
                >
                  <ChevronLeft size={14} />
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  className="btn"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                  title="Next topic"
                >
                  <ChevronRight size={14} />
                </button>
              )}
              <button
                onClick={onClose}
                className="btn"
                style={{ padding: '6px 10px', fontSize: '12px' }}
                title="Close modal"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--color-paper)',
                letterSpacing: '-0.02em',
                margin: 0
              }}
            >
              {topic.title}
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-fog)',
                marginTop: '4px',
                lineHeight: 1.45
              }}
            >
              {topic.description}
            </p>
          </div>

          {/* Quick Action Bar inside Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isCompleted ? 'rgba(39, 166, 68, 0.12)' : 'var(--color-carbon)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-buttons)',
                  border: isCompleted ? '1px solid rgba(39, 166, 68, 0.3)' : '1px solid var(--color-graphite)',
                  cursor: 'pointer'
                }}
                onClick={() => toggleAITopic(topic.id)}
              >
                <Checkbox
                  id={`modal-cb-${topic.id}`}
                  checked={isCompleted}
                  onChange={() => toggleAITopic(topic.id)}
                  label=""
                />
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 500,
                    color: isCompleted ? 'var(--color-pulse-green)' : 'var(--color-paper)'
                  }}
                >
                  {isCompleted ? 'Marked as Completed' : 'Mark as Complete'}
                </span>
              </div>

              <button
                onClick={() => toggleAIDailyPlan(topic.id)}
                className={inDailyPlan ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                <Calendar size={13} />
                <span>{inDailyPlan ? 'In Today\'s Daily Plan' : '+ Add to Daily Plan'}</span>
              </button>
            </div>

            {/* Study Time Logger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} style={{ color: 'var(--color-fog)' }} />
              <span style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
                {studyMinutes > 0 ? `${studyMinutes}m logged` : 'Log time:'}
              </span>
              {[15, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => logAIStudyTime(topic.id, mins)}
                  className="btn"
                  style={{ fontSize: '11px', padding: '3px 8px', height: '26px' }}
                >
                  +{mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-graphite)',
            background: 'var(--color-carbon)',
            padding: '0 20px'
          }}
        >
          <button
            onClick={() => setActiveTab('concepts')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 0,
              borderBottom: activeTab === 'concepts' ? '2px solid var(--color-acid-lime)' : '2px solid transparent',
              color: activeTab === 'concepts' ? 'var(--color-paper)' : 'var(--color-fog)',
              fontSize: '13px',
              fontWeight: activeTab === 'concepts' ? 550 : 400,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={14} />
            <span>Core Concepts & Objectives</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 0,
              borderBottom: activeTab === 'practice' ? '2px solid var(--color-acid-lime)' : '2px solid transparent',
              color: activeTab === 'practice' ? 'var(--color-paper)' : 'var(--color-fog)',
              fontSize: '13px',
              fontWeight: activeTab === 'practice' ? 550 : 400,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Code2 size={14} />
            <span>Practice & Resources ({topic.resources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 0,
              borderBottom: activeTab === 'notes' ? '2px solid var(--color-acid-lime)' : '2px solid transparent',
              color: activeTab === 'notes' ? 'var(--color-paper)' : 'var(--color-fog)',
              fontSize: '13px',
              fontWeight: activeTab === 'notes' ? 550 : 400,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={14} />
            <span>My Study Notes {notes && '•'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="modal-body"
          style={{
            padding: '22px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {activeTab === 'concepts' && (
            <>
              {/* Learning Objectives */}
              <div
                style={{
                  background: 'var(--color-obsidian)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  padding: '16px 18px'
                }}
              >
                <div
                  className="card-label"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}
                >
                  <Sparkles size={12} style={{ color: 'var(--color-acid-lime)' }} />
                  <span>Key Learning Objectives</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {topic.learningObjectives.map((obj: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(228, 242, 34, 0.1)',
                          border: '1px solid rgba(228, 242, 34, 0.3)',
                          color: 'var(--color-acid-lime)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10.5px',
                          fontWeight: 600,
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      >
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '13.5px', color: 'var(--color-mist)', lineHeight: 1.5 }}>
                        {obj}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Architecture & Deep Concepts */}
              <div
                style={{
                  background: 'var(--color-obsidian)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  padding: '16px 18px'
                }}
              >
                <div
                  className="card-label"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}
                >
                  <Cpu size={12} style={{ color: 'var(--color-signal-teal)' }} />
                  <span>Architecture & Core Mechanics</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {topic.keyConcepts.map((concept: string, i: number) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--color-carbon)',
                        border: '1px solid var(--color-graphite)',
                        borderRadius: 'var(--radius-buttons)',
                        fontSize: '13px',
                        color: 'var(--color-paper)',
                        fontFamily: 'var(--font-mono)',
                        lineHeight: 1.45
                      }}
                    >
                      {concept}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'practice' && (
            <>
              {/* Hands-on Practice Exercises */}
              <div
                style={{
                  background: 'var(--color-obsidian)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  padding: '16px 18px'
                }}
              >
                <div
                  className="card-label"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}
                >
                  <Code2 size={12} style={{ color: 'var(--color-iris-violet)' }} />
                  <span>Hands-on Exercises & Implementation Tasks</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {topic.practiceExercises.map((ex: string, i: number) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 14px',
                        background: 'var(--color-carbon)',
                        border: '1px solid var(--color-graphite)',
                        borderRadius: 'var(--radius-buttons)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          background: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          color: 'var(--color-iris-violet)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 600,
                          flexShrink: 0
                        }}
                      >
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '13.5px', color: 'var(--color-mist)', lineHeight: 1.5 }}>
                        {ex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Documentation & Reference Links */}
              <div
                style={{
                  background: 'var(--color-obsidian)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  padding: '16px 18px'
                }}
              >
                <div
                  className="card-label"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}
                >
                  <BookOpen size={12} style={{ color: 'var(--color-acid-lime)' }} />
                  <span>Official Documentation & Reference Papers</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {topic.resources.map((res: AIRepositoryResource, i: number) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'var(--color-carbon)',
                        border: '1px solid var(--color-graphite)',
                        borderRadius: 'var(--radius-buttons)',
                        color: 'var(--color-paper)',
                        textDecoration: 'none',
                        fontSize: '13px',
                        transition: 'border-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-smoke)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-graphite)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: 'var(--color-fog)',
                            textTransform: 'uppercase',
                            background: 'var(--color-charcoal)',
                            padding: '2px 6px',
                            borderRadius: '3px'
                          }}
                        >
                          {res.type || 'link'}
                        </span>
                        <span>{res.title}</span>
                      </div>
                      <ExternalLink size={13} style={{ color: 'var(--color-fog)' }} />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'notes' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: 'var(--color-obsidian)',
                border: '1px solid var(--color-graphite)',
                borderRadius: 'var(--radius-buttons)',
                padding: '18px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="card-label">Personal Study Notes & Reflections</span>
                <span style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
                  Auto-saved to local storage
                </span>
              </div>
              <textarea
                value={notes}
                onChange={(e) => updateAITopicNotes(topic.id, e.target.value)}
                placeholder="Write your study notes, key takeaways, code tracing insights, or questions for this topic..."
                style={{
                  minHeight: '220px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  padding: '12px 14px',
                  background: 'var(--color-carbon)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-inputs)',
                  color: 'var(--color-paper)',
                  resize: 'vertical'
                }}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--color-graphite)',
            background: 'var(--color-obsidian)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="font-mono tab-num"
              style={{ fontSize: '12px', color: 'var(--color-fog)' }}
            >
              Topic {topic.number} of 20
            </span>
          </div>

          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
