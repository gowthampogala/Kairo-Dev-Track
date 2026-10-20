import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Search,
  Clock,
  BookOpen,
  Calendar,
  FileCode,
  ArrowRight,
  Play,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROADMAP_BLOCKS, formatWeekLabel, getStudyBlockName, STUDY_BLOCK_DEFINITIONS } from '../../data/curriculum';
import { JS_CURRICULUM, JSLesson } from '../../data/javascriptCurriculum';
import { Badge } from '../common/Badge';
import { Checkbox } from '../common/Checkbox';
import { JSLessonDetailModal } from '../roadmap/JSLessonDetailModal';
import { TaskCategory } from '../../types';

export const DailyChecklistView: React.FC = () => {
  const {
    state,
    setSelectedBlockAndDay,
    toggleRoadmapTask,
    addCustomRoadmapTask,
    editRoadmapTask,
    deleteCustomRoadmapTask,
    toggleStudyBlock,
    setStudyHours,
    setStudyNotes,
    toggleJSLesson,
    toggleJSDailyPlan,
    updateJSLessonNotes,
    toggleJSExercise,
    logJSStudyTime,
    setActivePage
  } = useApp();

  const selectedBlockId = state.selectedBlock;
  const selectedDay = state.selectedDay;
  const currentBlock = ROADMAP_BLOCKS[selectedBlockId] || ROADMAP_BLOCKS[0];

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Quick Add State
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customCat, setCustomCat] = useState<TaskCategory>('Learn');
  const [customMinutes, setCustomMinutes] = useState<string>('');

  // Edit custom task state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCat, setEditCat] = useState<TaskCategory>('Learn');
  const [editMinutes, setEditMinutes] = useState<string>('');

  // Delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Selected JS Lesson for detail modal
  const [selectedJSLessonModal, setSelectedJSLessonModal] = useState<JSLesson | null>(null);

  // Quick pick selector value
  const [selectedJSLessonId, setSelectedJSLessonId] = useState<string>('');

  // Study blocks for current day
  const dayKey = `${selectedBlockId}:${selectedDay}`;
  const studyBlockEntry = state.studyBlocks[dayKey] || {
    dayKey,
    checkedBlocks: [false, false, false, false, false],
    hoursStudied: '',
    notes: ''
  };

  // Scheduled JS lessons in Daily Plan
  const jsRoadmapState = state.jsRoadmap || {};
  const scheduledJSLessons = JS_CURRICULUM.filter(l => jsRoadmapState[l.id]?.inDailyPlan);

  // Next incomplete JS lesson
  const nextIncompleteJSLesson = JS_CURRICULUM.find(l => !jsRoadmapState[l.id]?.completed) || JS_CURRICULUM[0];

  // Get tasks for selected block and day
  const tasksForDay = Object.values(state.roadmapTasks).filter(
    t => t.roadmapBlockId === selectedBlockId && t.roadmapDay === selectedDay
  );

  const filteredTasks = tasksForDay.filter(task => {
    const matchesQuery =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'done' && task.status === 'done') ||
      (statusFilter === 'todo' && task.status !== 'done');

    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    return matchesQuery && matchesStatus && matchesCategory;
  });

  const completedCount = tasksForDay.filter(t => t.status === 'done').length;
  const isRest = selectedDay % 7 === 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    addCustomRoadmapTask(selectedBlockId, selectedDay, {
      title: customTitle.trim(),
      description: customDesc.trim() || undefined,
      category: customCat,
      estimateMinutes: customMinutes ? parseInt(customMinutes, 10) : undefined
    });

    setCustomTitle('');
    setCustomDesc('');
    setCustomMinutes('');
  };

  const startEdit = (t: any) => {
    setEditingTaskId(t.id);
    setEditTitle(t.title);
    setEditDesc(t.description || '');
    setEditCat(t.category);
    setEditMinutes(t.estimateMinutes ? String(t.estimateMinutes) : '');
  };

  const handleSaveEdit = () => {
    if (!editingTaskId || !editTitle.trim()) return;
    editRoadmapTask(editingTaskId, {
      title: editTitle.trim(),
      description: editDesc.trim() || undefined,
      category: editCat,
      estimateMinutes: editMinutes ? parseInt(editMinutes, 10) : undefined
    });
    setEditingTaskId(null);
  };

  const handleAddJSLessonToDaily = (lessonId: string) => {
    if (!lessonId) return;
    toggleJSDailyPlan(lessonId);
    setSelectedJSLessonId('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* View Header */}
      <div>
        <h1>Daily Study Checklist</h1>
        <p className="card-subtext">
          Select your active roadmap block and day, plan your daily JavaScript study, and record your study hours.
        </p>
      </div>

      {/* Week & Block Navigation Card */}
      <div className="linear-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div className="card-label">Curriculum Block</div>
            <select
              value={selectedBlockId}
              onChange={e => setSelectedBlockAndDay(Number(e.target.value), 1)}
              style={{ marginTop: '4px', maxWidth: '400px' }}
              aria-label="Select roadmap block"
            >
              {ROADMAP_BLOCKS.map(block => (
                <option key={block.id} value={block.id}>
                  {formatWeekLabel(block)}: {block.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="card-label">Deliverable</span>
            <div style={{ fontSize: '13px', color: 'var(--color-paper)', marginTop: '4px', fontWeight: 510 }}>
              {currentBlock.deliverable}
            </div>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '16px', paddingBottom: '4px' }}>
          {Array.from({ length: currentBlock.weekSpan * 7 }, (_, i) => i + 1).map(dayNum => {
            const isCurrent = dayNum === selectedDay;
            const isDayRest = dayNum % 7 === 0;

            return (
              <button
                key={dayNum}
                className={`pill-tab ${isCurrent ? 'active' : ''}`}
                style={{ minWidth: '36px', justifyContent: 'center' }}
                onClick={() => setSelectedBlockAndDay(selectedBlockId, dayNum)}
              >
                {isDayRest ? 'R' : dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TODAY'S JAVASCRIPT STUDY PLAN CARD */}
      {/* ========================================================================= */}
      <div
        className="linear-card"
        style={{
          borderLeft: '2px solid var(--color-acid-lime)',
          background: 'var(--color-obsidian)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileCode size={18} style={{ color: 'var(--color-acid-lime)' }} />
            <div>
              <h2 style={{ fontSize: '15px', margin: 0 }}>Today's JavaScript Study Plan</h2>
              <p className="card-subtext" style={{ margin: '2px 0 0 0', fontSize: '12px' }}>
                Select topics from your 41-lesson curriculum, track study time, practice exercises separately, and retain notes.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (!jsRoadmapState[nextIncompleteJSLesson.id]?.inDailyPlan) {
                  toggleJSDailyPlan(nextIncompleteJSLesson.id);
                }
              }}
              className="btn btn-secondary"
              style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Add next incomplete lesson to today's study plan"
            >
              <Play size={12} fill="currentColor" />
              <span>Next: #{nextIncompleteJSLesson.number} {nextIncompleteJSLesson.title.slice(0, 20)}...</span>
            </button>

            <button
              onClick={() => setActivePage('js-roadmap')}
              className="btn btn-secondary"
              style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <span>Full JS Roadmap</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Lesson Selector Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--color-charcoal)',
            border: '1px solid var(--color-graphite)',
            borderRadius: 'var(--radius-buttons)',
            padding: '8px 12px',
            marginBottom: '16px'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--color-mist)', whiteSpace: 'nowrap' }}>
            + Add Lesson to Today:
          </span>
          <select
            value={selectedJSLessonId}
            onChange={(e) => handleAddJSLessonToDaily(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--color-paper)',
              fontSize: '12.5px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="" style={{ background: 'var(--color-carbon)', color: 'var(--color-fog)' }}>
              Choose from 41 JavaScript lessons...
            </option>
            {JS_CURRICULUM.map(lesson => {
              const isMastered = !!jsRoadmapState[lesson.id]?.completed;
              const isPlanned = !!jsRoadmapState[lesson.id]?.inDailyPlan;
              return (
                <option
                  key={lesson.id}
                  value={lesson.id}
                  style={{ background: 'var(--color-carbon)', color: isMastered ? 'var(--color-pulse-green)' : 'var(--color-paper)' }}
                >
                  #{String(lesson.number).padStart(2, '0')}: {lesson.title} {isMastered ? '(✓ Mastered)' : isPlanned ? '(In Today’s Plan)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Scheduled Lessons List */}
        {scheduledJSLessons.length === 0 ? (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              border: '1px dashed var(--color-graphite)',
              borderRadius: 'var(--radius-buttons)',
              color: 'var(--color-fog)',
              fontSize: '13px'
            }}
          >
            <p style={{ margin: 0 }}>No JavaScript lessons currently added to today's study plan.</p>
            <button
              onClick={() => toggleJSDailyPlan(nextIncompleteJSLesson.id)}
              className="btn btn-primary"
              style={{ marginTop: '10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={13} />
              Add Lesson #{nextIncompleteJSLesson.number}: {nextIncompleteJSLesson.title}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {scheduledJSLessons.map(lesson => {
              const lState = jsRoadmapState[lesson.id] || { completed: false };
              const isMastered = !!lState.completed;
              const notes = lState.notes || '';
              const studyMins = lState.studyMinutes || 0;
              const exercises = lesson.exercises || [];
              const exercisesDone = lState.exercisesCompleted || {};

              return (
                <div
                  key={lesson.id}
                  style={{
                    background: isMastered ? 'rgba(74, 222, 128, 0.03)' : 'var(--color-charcoal)',
                    border: isMastered ? '1px solid rgba(74, 222, 128, 0.25)' : '1px solid var(--color-graphite)',
                    borderRadius: 'var(--radius-buttons)',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <Checkbox
                        checked={isMastered}
                        onChange={() => toggleJSLesson(lesson.id)}
                        label={`Mark lesson ${lesson.number} fully understood and complete`}
                      />

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: isMastered ? 'var(--color-acid-lime)' : 'var(--color-fog)',
                              background: 'var(--color-obsidian)',
                              border: '1px solid var(--color-graphite)',
                              padding: '1px 6px',
                              borderRadius: '3px'
                            }}
                          >
                            #{String(lesson.number).padStart(2, '0')}
                          </span>
                          <span
                            style={{
                              fontSize: '13.5px',
                              fontWeight: 510,
                              color: isMastered ? 'var(--color-mist)' : 'var(--color-paper)',
                              textDecoration: isMastered ? 'line-through' : 'none'
                            }}
                          >
                            {lesson.title}
                          </span>
                          <span className="badge badge-default" style={{ fontSize: '10.5px' }}>
                            {lesson.category}
                          </span>
                          {lesson.isContentPrepared && (
                            <span style={{ fontSize: '10px', color: 'var(--color-acid-lime)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Sparkles size={10} /> Prepared Guide
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--color-fog)', marginTop: '3px' }}>
                          Duration: {lesson.estimatedDuration || 'Not specified'} · Lessons: {lesson.lessonsCount || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    {/* Top Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedJSLessonModal(lesson)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11.5px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <BookOpen size={13} />
                        <span>Open Guide</span>
                      </button>

                      <button
                        onClick={() => toggleJSDailyPlan(lesson.id)}
                        className="btn btn-ghost"
                        style={{ fontSize: '11.5px', padding: '4px 8px', color: 'var(--color-fog)' }}
                        title="Remove from today's plan"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Practice Exercises (Decoupled from Lesson Mastery) */}
                  {exercises.length > 0 && (
                    <div
                      style={{
                        background: 'var(--surface-sunken)',
                        border: '1px solid var(--color-graphite)',
                        borderRadius: '4px',
                        padding: '10px 12px'
                      }}
                    >
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-paper)', marginBottom: '6px' }}>
                        Practice Exercises ({Object.values(exercisesDone).filter(Boolean).length}/{exercises.length} Completed):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {exercises.map((ex, idx) => {
                          const isExDone = !!exercisesDone[ex.id];
                          return (
                            <div key={ex.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Checkbox
                                checked={isExDone}
                                onChange={() => toggleJSExercise(lesson.id, ex.id)}
                                label={ex.prompt}
                              />
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: isExDone ? 'var(--color-mist)' : 'var(--color-paper)',
                                  textDecoration: isExDone ? 'line-through' : 'none'
                                }}
                              >
                                <strong>Ex {idx + 1}:</strong> {ex.prompt}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Study Time Logging & Personal Notes */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', alignItems: 'center' }}>
                    {/* Time Tracking */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-mist)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} style={{ color: 'var(--color-fog)' }} /> Time Logged:
                        <strong style={{ color: studyMins > 0 ? 'var(--color-acid-lime)' : 'var(--color-paper)', fontFamily: 'var(--font-mono)' }}>
                          {studyMins}m
                        </strong>
                      </span>
                      <button
                        onClick={() => logJSStudyTime(lesson.id, 15)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '3px 8px' }}
                      >
                        +15m
                      </button>
                      <button
                        onClick={() => logJSStudyTime(lesson.id, 30)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '3px 8px' }}
                      >
                        +30m
                      </button>
                      <button
                        onClick={() => logJSStudyTime(lesson.id, 45)}
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '3px 8px' }}
                      >
                        +45m
                      </button>
                    </div>

                    {/* Quick Notes */}
                    <input
                      type="text"
                      placeholder="Add personal note for this lesson..."
                      value={notes}
                      onChange={(e) => updateJSLessonNotes(lesson.id, e.target.value)}
                      style={{
                        fontSize: '12px',
                        padding: '5px 10px',
                        background: 'var(--surface-sunken)',
                        border: '1px solid var(--color-graphite)',
                        borderRadius: '4px',
                        color: 'var(--color-paper)',
                        fontFamily: 'var(--font-inter)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Search & Filters for General Tasks */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--color-fog)' }} />
          <input
            type="text"
            placeholder="Search daily tasks…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          style={{ flex: '1 1 140px' }}
          aria-label="Status filter"
        >
          <option value="all">All statuses</option>
          <option value="todo">Incomplete</option>
          <option value="done">Completed</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{ flex: '1 1 140px' }}
          aria-label="Category filter"
        >
          <option value="all">All categories</option>
          <option value="Learn">Learn</option>
          <option value="Practise">Practise</option>
          <option value="Build">Build</option>
          <option value="Test">Test</option>
          <option value="Review">Review</option>
        </select>
      </div>

      {/* Scheduled Tasks Card */}
      <div className="linear-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2>Scheduled Daily Block Tasks</h2>
          <span className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
            {completedCount}/{tasksForDay.length} completed
          </span>
        </div>

        {filteredTasks.length > 0 ? (
          <div>
            {filteredTasks.map(task => {
              const isDone = task.status === 'done';
              const isEditing = editingTaskId === task.id;

              if (isEditing) {
                return (
                  <div key={task.id} style={{ padding: '12px', background: 'var(--color-obsidian)', borderRadius: '6px', margin: '8px 0' }}>
                    <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                      <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
                      <input type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description" />
                      <select value={editCat} onChange={e => setEditCat(e.target.value as any)}>
                        <option value="Learn">Learn</option>
                        <option value="Practise">Practise</option>
                        <option value="Build">Build</option>
                        <option value="Test">Test</option>
                        <option value="Review">Review</option>
                      </select>
                      <input type="number" value={editMinutes} onChange={e => setEditMinutes(e.target.value)} placeholder="Minutes" />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button className="btn btn-primary" onClick={handleSaveEdit}>
                        <Check size={14} /> Save
                      </button>
                      <button className="btn" onClick={() => setEditingTaskId(null)}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={task.id} className={`task-row ${isDone ? 'task-done' : ''}`}>
                  <Checkbox
                    checked={isDone}
                    onChange={() => toggleRoadmapTask(task.id)}
                    label={task.title}
                  />
                  <div
                    onClick={() => toggleRoadmapTask(task.id)}
                    style={{ flex: 1, cursor: 'pointer', fontSize: '13px' }}
                  >
                    <span style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--color-mist)' : 'var(--color-paper)' }}>
                      {task.title}
                    </span>
                    {task.description && (
                      <div className="card-subtext" style={{ fontSize: '12px' }}>{task.description}</div>
                    )}
                  </div>
                  {task.estimateMinutes && (
                    <span className="font-mono tab-num" style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
                      {task.estimateMinutes}m
                    </span>
                  )}
                  <Badge category={task.category}>{task.category}</Badge>

                  {task.isCustom && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn" style={{ padding: '4px 8px' }} onClick={() => startEdit(task)} title="Edit task">
                        <Edit3 size={13} />
                      </button>
                      {confirmDeleteId === task.id ? (
                        <>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '4px 8px' }}
                            onClick={() => {
                              deleteCustomRoadmapTask(task.id);
                              setConfirmDeleteId(null);
                            }}
                          >
                            Confirm
                          </button>
                          <button className="btn" style={{ padding: '4px 8px' }} onClick={() => setConfirmDeleteId(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn"
                          style={{ padding: '4px 8px', color: 'var(--color-fog)' }}
                          onClick={() => setConfirmDeleteId(task.id)}
                          title="Delete task"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="card-subtext" style={{ padding: '16px 0', textAlign: 'center' }}>
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'No tasks match your selected filter criteria.'
              : 'Nothing scheduled for this day. You can add custom study tasks below or rest.'}
          </p>
        )}
      </div>

      {/* Quick Add Custom Task Card */}
      <div className="linear-card">
        <h2>Add Custom Task</h2>
        <form onSubmit={handleAddTask} style={{ marginTop: '14px' }}>
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div>
              <div className="card-label">Task Title *</div>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                placeholder="e.g. Build counter component in React"
                style={{ marginTop: '4px' }}
                required
              />
            </div>
            <div>
              <div className="card-label">Description (optional)</div>
              <input
                type="text"
                value={customDesc}
                onChange={e => setCustomDesc(e.target.value)}
                placeholder="Additional notes or acceptance criteria"
                style={{ marginTop: '4px' }}
              />
            </div>
            <div>
              <div className="card-label">Category</div>
              <select
                value={customCat}
                onChange={e => setCustomCat(e.target.value as any)}
                style={{ marginTop: '4px' }}
              >
                <option value="Learn">Learn</option>
                <option value="Practise">Practise</option>
                <option value="Build">Build</option>
                <option value="Test">Test</option>
                <option value="Review">Review</option>
              </select>
            </div>
            <div>
              <div className="card-label">Estimated Minutes</div>
              <input
                type="number"
                min="0"
                value={customMinutes}
                onChange={e => setCustomMinutes(e.target.value)}
                placeholder="e.g. 45"
                style={{ marginTop: '4px' }}
              />
            </div>
          </div>
          <button type="submit" className="btn" style={{ marginTop: '14px' }}>
            <Plus size={14} /> Add Task
          </button>
        </form>
      </div>

      {/* Study Blocks & Daily Reflection Card */}
      <div className="linear-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2>Study Blocks & Daily Reflection</h2>
          <span className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
            {studyBlockEntry.checkedBlocks.filter(Boolean).length}/5 blocks completed
          </span>
        </div>

        {currentBlock.startWeek >= 13 && currentBlock.startWeek <= 19 && (
          <p className="card-subtext" style={{ marginBottom: '12px' }}>
            Main learning time can shift toward AI / RAG foundations during these weeks.
          </p>
        )}

        {/* 5 Blocks */}
        <div>
          {STUDY_BLOCK_DEFINITIONS.map((blk, idx) => {
            const isChecked = !!studyBlockEntry.checkedBlocks[idx];
            return (
              <div key={idx} className="task-row">
                <Checkbox
                  checked={isChecked}
                  onChange={() => toggleStudyBlock(dayKey, idx)}
                  label={getStudyBlockName(selectedBlockId, idx)}
                />
                <span
                  onClick={() => toggleStudyBlock(dayKey, idx)}
                  style={{ flex: 1, cursor: 'pointer', fontSize: '13px', color: isChecked ? 'var(--color-mist)' : 'var(--color-paper)' }}
                >
                  {getStudyBlockName(selectedBlockId, idx)}
                </span>
                <span className="font-mono tab-num" style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
                  {blk.minutes}m
                </span>
              </div>
            );
          })}
        </div>

        {/* Study Hours & Reflection Notes */}
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '16px' }}>
          <div>
            <div className="card-label">Hours Studied Today (Daily Target: {state.settings.dailyTargetHours} hrs)</div>
            <input
              type="number"
              step="0.25"
              min="0"
              value={studyBlockEntry.hoursStudied}
              onChange={e => setStudyHours(dayKey, e.target.value)}
              placeholder="e.g. 5.5"
              style={{ marginTop: '4px' }}
            />
          </div>
          <div>
            <div className="card-label">Daily Notes & Reflections</div>
            <textarea
              value={studyBlockEntry.notes}
              onChange={e => setStudyNotes(dayKey, e.target.value)}
              placeholder="What worked well, key breakthroughs or roadblocks today..."
              style={{ marginTop: '4px' }}
            />
          </div>
        </div>
      </div>

      {/* Lesson Detail Modal */}
      {selectedJSLessonModal && (
        <JSLessonDetailModal
          lesson={selectedJSLessonModal}
          onClose={() => setSelectedJSLessonModal(null)}
        />
      )}
    </div>
  );
};
