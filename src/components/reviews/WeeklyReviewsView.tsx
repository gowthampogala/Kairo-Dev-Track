import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROADMAP_BLOCKS, formatWeekLabel } from '../../data/curriculum';
import { calculateBlockProgress } from '../../services/progress';
import { Badge } from '../common/Badge';
import { Checkbox } from '../common/Checkbox';

export const WeeklyReviewsView: React.FC = () => {
  const { state, currentPosition, updateWeeklyReview } = useApp();

  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({
    [currentPosition.blockIndex]: true
  });

  const toggleReview = (blockId: number) => {
    setExpandedReviews(prev => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1>Weekly Reviews & Retrospectives</h1>
        <p className="card-subtext">
          Document your progress, blockers, revision goals, and self-test assessments. Weeks 16–17 and 18–19 are reviewed as unified capstone blocks.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ROADMAP_BLOCKS.map(block => {
          const rev = state.weeklyReviews[block.id] || {
            blockId: block.id,
            isCompleted: false,
            selfTestResult: 'not_taken',
            learned: '',
            struggled: '',
            revise: '',
            nextPriority: ''
          };

          const blockTasks = Object.values(state.roadmapTasks).filter(t => t.roadmapBlockId === block.id);
          const completedCount = blockTasks.filter(t => t.status === 'done').length;
          const deliverableTask = blockTasks.find(t => t.isDeliverable);
          const selfTestTask = blockTasks.find(t => t.isSelfTest);
          const isOpen = !!expandedReviews[block.id];

          return (
            <div key={block.id} className="linear-card">
              <button
                onClick={() => toggleReview(block.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  background: 'none',
                  border: 0,
                  padding: '2px 0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--color-paper)'
                }}
              >
                <ChevronRight
                  size={16}
                  style={{
                    color: 'var(--color-fog)',
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.15s ease'
                  }}
                />
                <span style={{ flex: 1, fontSize: '14px', fontWeight: 510 }}>
                  {formatWeekLabel(block)}: {block.title}
                </span>

                <span className={`badge ${rev.isCompleted ? 'badge-completed' : ''}`}>
                  {rev.isCompleted ? 'Reviewed' : 'Open'}
                </span>

                <span className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
                  {completedCount}/{blockTasks.length} tasks
                </span>
              </button>

              {isOpen && (
                <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--color-graphite)' }}>
                  {/* Summary Bar */}
                  <div className="font-mono" style={{ fontSize: '12px', color: 'var(--color-fog)', marginBottom: '14px' }}>
                    Completed: {completedCount} · Remaining: {blockTasks.length - completedCount} · Deliverable:{' '}
                    {deliverableTask?.status === 'done' ? (
                      <span style={{ color: 'var(--color-pulse-green)' }}>Done</span>
                    ) : (
                      'Pending'
                    )}
                    {selfTestTask && (
                      <span>
                        {' '}
                        · Self-test task:{' '}
                        {selfTestTask.status === 'done' ? (
                          <span style={{ color: 'var(--color-pulse-green)' }}>Done</span>
                        ) : (
                          'Pending'
                        )}
                      </span>
                    )}
                  </div>

                  {/* Self-test assessment */}
                  <div style={{ marginBottom: '14px' }}>
                    <div className="card-label">Weekly Self-Test Assessment</div>
                    <select
                      value={rev.selfTestResult}
                      onChange={e => updateWeeklyReview(block.id, { selfTestResult: e.target.value as any })}
                      style={{ marginTop: '4px', maxWidth: '280px' }}
                    >
                      <option value="not_taken">Not taken</option>
                      <option value="passed">Passed with confidence</option>
                      <option value="needs_revision">Needs further revision</option>
                    </select>
                  </div>

                  {/* 4 Reflection textareas */}
                  <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                    <div>
                      <div className="card-label">What I learned & mastered</div>
                      <textarea
                        value={rev.learned}
                        onChange={e => updateWeeklyReview(block.id, { learned: e.target.value })}
                        placeholder="Key technical concepts, patterns, or tools absorbed..."
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                    <div>
                      <div className="card-label">What I struggled with (blockers)</div>
                      <textarea
                        value={rev.struggled}
                        onChange={e => updateWeeklyReview(block.id, { struggled: e.target.value })}
                        placeholder="Tricky bugs, difficult mental models, or points of confusion..."
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                    <div>
                      <div className="card-label">Topics that require revision</div>
                      <textarea
                        value={rev.revise}
                        onChange={e => updateWeeklyReview(block.id, { revise: e.target.value })}
                        placeholder="Specific items to review before interview preparation..."
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                    <div>
                      <div className="card-label">Next week's primary priority</div>
                      <textarea
                        value={rev.nextPriority}
                        onChange={e => updateWeeklyReview(block.id, { nextPriority: e.target.value })}
                        placeholder="The single most important objective for the upcoming block..."
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                  </div>

                  {/* Complete check */}
                  <div className="task-row" style={{ marginTop: '14px', border: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Checkbox
                      checked={rev.isCompleted}
                      onChange={() => updateWeeklyReview(block.id, { isCompleted: !rev.isCompleted })}
                      label="Mark weekly retrospective completed"
                    />
                    <span
                      onClick={() => updateWeeklyReview(block.id, { isCompleted: !rev.isCompleted })}
                      style={{ cursor: 'pointer', fontSize: '13px', fontWeight: 510, color: rev.isCompleted ? 'var(--color-acid-lime)' : 'var(--color-paper)' }}
                    >
                      Mark weekly retrospective completed
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
