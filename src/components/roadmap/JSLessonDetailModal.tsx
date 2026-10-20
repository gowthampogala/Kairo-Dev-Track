import React, { useState } from 'react';
import {
  X,
  Check,
  BookOpen,
  Clock,
  FileText,
  Code,
  Copy,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ListChecks,
  ExternalLink,
  Layers
} from 'lucide-react';
import { JSLesson } from '../../data/javascriptCurriculum';
import { useApp } from '../../context/AppContext';
import { Checkbox } from '../common/Checkbox';

interface JSLessonDetailModalProps {
  lesson: JSLesson | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const JSLessonDetailModal: React.FC<JSLessonDetailModalProps> = ({
  lesson,
  onClose,
  onNext,
  onPrev
}) => {
  const {
    state,
    toggleJSLesson,
    toggleJSDailyPlan,
    updateJSLessonNotes,
    toggleJSExercise,
    toggleJSSelfAssessment,
    logJSStudyTime
  } = useApp();

  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [expandedInterviewQuestions, setExpandedInterviewQuestions] = useState<Record<number, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  if (!lesson) return null;

  const lessonState = state.jsRoadmap?.[lesson.id] || { completed: false };
  const isCompleted = !!lessonState.completed;
  const inDailyPlan = !!lessonState.inDailyPlan;
  const notes = lessonState.notes || '';
  const exercisesCompleted = lessonState.exercisesCompleted || {};
  const selfAssessmentCompleted = lessonState.selfAssessmentCompleted || {};
  const studyMinutes = lessonState.studyMinutes || 0;

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const toggleInterviewQuestion = (idx: number) => {
    setExpandedInterviewQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleSolution = (exerciseId: string) => {
    setRevealedSolutions(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
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
        className="modal-card"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          background: 'var(--color-obsidian)',
          border: '1px solid var(--color-graphite)',
          borderRadius: 'var(--radius-containers)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-graphite)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-sunken)',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                color: isCompleted ? 'var(--color-acid-lime)' : 'var(--color-fog)',
                background: 'var(--color-charcoal)',
                border: '1px solid var(--color-graphite)',
                padding: '3px 8px',
                borderRadius: '4px'
              }}
            >
              #{String(lesson.number).padStart(2, '0')}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-default" style={{ fontSize: '11px', padding: '1px 6px' }}>
                  {lesson.category}
                </span>
                {lesson.isContentPrepared ? (
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-acid-lime)',
                      background: 'rgba(228, 242, 34, 0.08)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(228, 242, 34, 0.2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={11} /> Deep Guide Prepared
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-mist)',
                      background: 'var(--color-charcoal)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--color-graphite)'
                    }}
                  >
                    Structured Topic Overview
                  </span>
                )}
                {isCompleted && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#4ade80',
                      background: 'rgba(74, 222, 128, 0.1)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(74, 222, 128, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle2 size={11} /> Completed
                  </span>
                )}
              </div>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color-paper)',
                  marginTop: '4px',
                  lineHeight: '1.3',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {lesson.title}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onPrev && (
              <button
                onClick={onPrev}
                className="btn btn-secondary"
                style={{ padding: '6px 10px', fontSize: '12px' }}
                title="Previous Lesson"
              >
                Prev
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="btn btn-secondary"
                style={{ padding: '6px 10px', fontSize: '12px' }}
                title="Next Lesson"
              >
                Next
              </button>
            )}
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: '6px', color: 'var(--color-mist)' }}
              aria-label="Close details"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div
          style={{
            padding: '10px 20px',
            background: 'var(--color-obsidian)',
            borderBottom: '1px solid var(--color-graphite)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          {/* Metadata badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--color-mist)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Layers size={13} style={{ color: 'var(--color-fog)' }} />
              <span>Lessons: <strong style={{ color: 'var(--color-paper)' }}>{lesson.lessonsCount || 'Not specified'}</strong></span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} style={{ color: 'var(--color-fog)' }} />
              <span>Duration: <strong style={{ color: 'var(--color-paper)' }}>{lesson.estimatedDuration || 'Not specified'}</strong></span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <FileText size={13} style={{ color: 'var(--color-fog)' }} />
              <span>Pages: <strong style={{ color: 'var(--color-paper)' }}>{lesson.pageCount || 'Not specified'}</strong></span>
            </span>
            {studyMinutes > 0 && (
              <span style={{ color: 'var(--color-acid-lime)', fontFamily: 'var(--font-mono)' }}>
                Studied: {studyMinutes}m
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => toggleJSDailyPlan(lesson.id)}
              className={inDailyPlan ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Calendar size={13} />
              {inDailyPlan ? "In Today's Plan" : "Add to Today's Plan"}
            </button>

            <button
              onClick={() => logJSStudyTime(lesson.id, 30)}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              title="Add 30 minutes to studied time"
            >
              <Clock size={13} />
              +30m Study
            </button>

            <button
              onClick={() => toggleJSLesson(lesson.id)}
              className={isCompleted ? 'btn btn-secondary' : 'btn btn-primary'}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isCompleted ? 'rgba(74, 222, 128, 0.15)' : undefined,
                borderColor: isCompleted ? 'rgba(74, 222, 128, 0.4)' : undefined,
                color: isCompleted ? '#4ade80' : undefined
              }}
            >
              <Check size={14} strokeWidth={2.5} />
              {isCompleted ? 'Mark Incomplete' : 'Mark Lesson Complete'}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Section: Learning Objectives */}
          <div
            style={{
              background: 'var(--surface-sunken)',
              border: '1px solid var(--color-graphite)',
              borderRadius: 'var(--radius-buttons)',
              padding: '16px 18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <BookOpen size={16} style={{ color: 'var(--color-acid-lime)' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                What I Should Learn
              </h3>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {lesson.learningObjectives.map((obj, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '13px',
                    color: 'var(--color-mist)',
                    lineHeight: '1.5'
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--color-acid-lime)',
                      marginTop: '7px',
                      flexShrink: 0
                    }}
                  />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Beginner-Friendly Explanation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={16} style={{ color: 'var(--color-acid-lime)' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Explanation & Core Concept
              </h3>
            </div>
            <div
              style={{
                fontSize: '13.5px',
                lineHeight: '1.7',
                color: 'var(--color-mist)',
                whiteSpace: 'pre-line',
                background: 'var(--color-charcoal)',
                padding: '16px 18px',
                borderRadius: 'var(--radius-buttons)',
                border: '1px solid var(--color-graphite)'
              }}
            >
              {lesson.explanation}
            </div>
          </div>

          {/* Section: Step-by-Step Code Tracing */}
          {lesson.codeTracing && (
            <div
              style={{
                background: 'rgba(228, 242, 34, 0.03)',
                border: '1px solid rgba(228, 242, 34, 0.15)',
                borderRadius: 'var(--radius-buttons)',
                padding: '16px 18px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Clock size={15} style={{ color: 'var(--color-acid-lime)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)' }}>
                  Execution Trace: {lesson.codeTracing.scenario}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lesson.codeTracing.steps.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '10px',
                      fontSize: '13px',
                      color: 'var(--color-paper)',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      borderLeft: '2px solid var(--color-acid-lime)'
                    }}
                  >
                    <span style={{ color: 'var(--color-acid-lime)', fontWeight: 600, fontSize: '11px' }}>
                      #{idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Practical JavaScript Code Examples */}
          {lesson.codeExamples && lesson.codeExamples.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Code size={16} style={{ color: 'var(--color-acid-lime)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Practical Code Examples
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {lesson.codeExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--color-graphite)',
                      borderRadius: 'var(--radius-buttons)',
                      overflow: 'hidden',
                      background: 'var(--color-obsidian)'
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 14px',
                        background: 'var(--color-charcoal)',
                        borderBottom: '1px solid var(--color-graphite)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 510, color: 'var(--color-paper)' }}>
                        {ex.title}
                      </span>
                      <button
                        onClick={() => handleCopyCode(ex.code, idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: copiedCodeIndex === idx ? 'var(--color-acid-lime)' : 'var(--color-fog)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {copiedCodeIndex === idx ? (
                          <>
                            <Check size={12} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: '14px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12.5px',
                        lineHeight: '1.6',
                        color: 'var(--color-paper)',
                        overflowX: 'auto',
                        background: 'var(--color-carbon)'
                      }}
                    >
                      <code>{ex.code}</code>
                    </pre>
                    {ex.explanation && (
                      <div
                        style={{
                          padding: '10px 14px',
                          background: 'var(--surface-hover)',
                          borderTop: '1px solid var(--color-graphite)',
                          fontSize: '12.5px',
                          color: 'var(--color-mist)',
                          lineHeight: '1.5'
                        }}
                      >
                        <strong style={{ color: 'var(--color-paper)' }}>Explanation:</strong> {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Independent Exercises */}
          {lesson.exercises && lesson.exercises.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-acid-lime)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Independent Practice Exercises
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lesson.exercises.map((ex, idx) => {
                  const isDone = !!exercisesCompleted[ex.id];
                  const showSolution = !!revealedSolutions[ex.id];
                  return (
                    <div
                      key={ex.id || idx}
                      style={{
                        border: '1px solid var(--color-graphite)',
                        borderRadius: 'var(--radius-buttons)',
                        padding: '14px 16px',
                        background: isDone ? 'rgba(74, 222, 128, 0.04)' : 'var(--color-charcoal)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <Checkbox
                          checked={isDone}
                          onChange={() => toggleJSExercise(lesson.id, ex.id)}
                          label={`Mark exercise ${idx + 1} completed`}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 510,
                              color: isDone ? 'var(--color-mist)' : 'var(--color-paper)',
                              textDecoration: isDone ? 'line-through' : 'none',
                              lineHeight: '1.5'
                            }}
                          >
                            <strong>Exercise {idx + 1}:</strong> {ex.prompt}
                          </div>
                          {ex.hint && (
                            <div style={{ fontSize: '12px', color: 'var(--color-fog)', marginTop: '6px' }}>
                              💡 <span style={{ color: 'var(--color-mist)' }}>Hint:</span> {ex.hint}
                            </div>
                          )}

                          {ex.solution && (
                            <div style={{ marginTop: '10px' }}>
                              <button
                                onClick={() => toggleSolution(ex.id)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--color-acid-lime)',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  padding: 0,
                                  fontFamily: 'var(--font-mono)'
                                }}
                              >
                                {showSolution ? 'Hide Model Solution ▲' : 'Reveal Model Solution ▼'}
                              </button>
                              {showSolution && (
                                <pre
                                  style={{
                                    marginTop: '8px',
                                    padding: '10px 12px',
                                    background: 'var(--color-carbon)',
                                    border: '1px solid var(--color-graphite)',
                                    borderRadius: '4px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    color: '#4ade80',
                                    overflowX: 'auto'
                                  }}
                                >
                                  <code>{ex.solution}</code>
                                </pre>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Common Interview Questions */}
          {lesson.interviewQuestions && lesson.interviewQuestions.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <HelpCircle size={16} style={{ color: 'var(--color-acid-lime)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Technical Interview Questions
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lesson.interviewQuestions.map((q, idx) => {
                  const isExpanded = !!expandedInterviewQuestions[idx];
                  return (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid var(--color-graphite)',
                        borderRadius: 'var(--radius-buttons)',
                        overflow: 'hidden',
                        background: 'var(--color-charcoal)'
                      }}
                    >
                      <button
                        onClick={() => toggleInterviewQuestion(idx)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-paper)',
                          textAlign: 'left',
                          fontSize: '13px',
                          fontWeight: 510,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <span>Q: {q.question}</span>
                        {isExpanded ? <ChevronUp size={15} style={{ color: 'var(--color-fog)' }} /> : <ChevronDown size={15} style={{ color: 'var(--color-fog)' }} />}
                      </button>
                      {isExpanded && (
                        <div
                          style={{
                            padding: '12px 14px',
                            background: 'var(--surface-sunken)',
                            borderTop: '1px solid var(--color-graphite)',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            color: 'var(--color-mist)'
                          }}
                        >
                          <strong style={{ color: 'var(--color-acid-lime)' }}>Answer:</strong> {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Self Assessment Checklist */}
          {lesson.selfAssessment && lesson.selfAssessment.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ListChecks size={16} style={{ color: 'var(--color-acid-lime)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Self-Assessment Checklist
                </h3>
              </div>
              <div
                style={{
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {lesson.selfAssessment.map((item, idx) => {
                  const isChecked = !!selfAssessmentCompleted[idx];
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Checkbox
                        checked={isChecked}
                        onChange={() => toggleJSSelfAssessment(lesson.id, idx)}
                        label={item}
                      />
                      <span
                        style={{
                          fontSize: '13px',
                          color: isChecked ? 'var(--color-paper)' : 'var(--color-mist)',
                          textDecoration: isChecked ? 'none' : 'none'
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Personal Study Notes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: 'var(--color-acid-lime)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Personal Study Notes & Questions
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-fog)' }}>Auto-saved to storage</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => updateJSLessonNotes(lesson.id, e.target.value)}
              placeholder="Write your personal insights, confusing points to review, or code snippets here..."
              rows={4}
              style={{
                width: '100%',
                background: 'var(--color-charcoal)',
                border: '1px solid var(--color-graphite)',
                borderRadius: 'var(--radius-buttons)',
                padding: '12px 14px',
                color: 'var(--color-paper)',
                fontFamily: 'var(--font-inter)',
                fontSize: '13px',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          {/* Section: External Resource Links */}
          {lesson.resourceLinks && lesson.resourceLinks.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ExternalLink size={15} style={{ color: 'var(--color-acid-lime)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Official Documentation & References
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {lesson.resourceLinks.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      background: 'var(--surface-sunken)',
                      border: '1px solid var(--color-graphite)',
                      borderRadius: '4px',
                      color: 'var(--color-paper)',
                      fontSize: '12px',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{res.title}</span>
                    <ExternalLink size={11} style={{ color: 'var(--color-fog)' }} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
