import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  CheckSquare,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Archive,
  RotateCcw,
  Search,
  Filter,
  Check,
  AlertTriangle,
  FolderPlus,
  ArrowUpDown,
  Edit2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Checkbox } from '../common/Checkbox';
import { Task, TaskCategory, Project, ProjectStatus } from '../../types';
import { PHASES, ROADMAP_BLOCKS, formatWeekLabel } from '../../data/curriculum';

export const WorkspaceView: React.FC = () => {
  const {
    state,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    archiveProject,
    restoreProject,
    toggleProjectTask,
    addProjectTask,
    updateProjectTask,
    deleteProjectTask,
    bulkUpdateTasks,
    bulkDeleteTasks,
    addCustomRoadmapPlan,
    setIsImporterOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'roadmap'>('projects');

  // Project deletion confirmation modal
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Selected project for Section & Subtask editing
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('Build');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  // Task Manager State
  const [taskSearch, setTaskSearch] = useState('');
  const [taskProjectFilter, setTaskProjectFilter] = useState('all');
  const [taskCatFilter, setTaskCatFilter] = useState('all');
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Custom Plan form state
  const [planTitle, setPlanTitle] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planWeekSpan, setPlanWeekSpan] = useState(1);
  const [planDeliverable, setPlanDeliverable] = useState('');
  const [planTopics, setPlanTopics] = useState('');

  // Gather all tasks across projects and custom roadmap
  const allProjectTasks: Array<Task & { projectName: string }> = [];
  state.projects.forEach(p => {
    p.tasks.forEach(t => {
      allProjectTasks.push({ ...t, projectName: p.title });
    });
  });

  const filteredProjectTasks = allProjectTasks.filter(t => {
    const matchesSearch =
      !taskSearch ||
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(taskSearch.toLowerCase()));

    const matchesProj = taskProjectFilter === 'all' || t.projectId === taskProjectFilter;
    const matchesCat = taskCatFilter === 'all' || t.category === taskCatFilter;
    const matchesStatus =
      taskStatusFilter === 'all' ||
      (taskStatusFilter === 'done' && t.status === 'done') ||
      (taskStatusFilter === 'todo' && t.status !== 'done');

    return matchesSearch && matchesProj && matchesCat && matchesStatus;
  });

  const handleSelectAllTasks = () => {
    if (selectedTaskIds.length === filteredProjectTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredProjectTasks.map(t => t.id));
    }
  };

  const handleToggleSelectTask = (id: string) => {
    setSelectedTaskIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkMarkDone = () => {
    bulkUpdateTasks(selectedTaskIds, { status: 'done', completedAt: new Date().toISOString().split('T')[0] });
    setSelectedTaskIds([]);
  };

  const handleBulkMarkTodo = () => {
    bulkUpdateTasks(selectedTaskIds, { status: 'todo', completedAt: undefined });
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    bulkDeleteTasks(selectedTaskIds);
    setSelectedTaskIds([]);
  };

  const handleAddCustomPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim()) return;

    const topicsArray = planTopics
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    addCustomRoadmapPlan(
      planTitle.trim(),
      planDesc.trim(),
      planWeekSpan,
      planDeliverable.trim() || 'Working implementation',
      topicsArray.length ? topicsArray : ['Core design & setup', 'Implementation & testing']
    );

    setPlanTitle('');
    setPlanDesc('');
    setPlanDeliverable('');
    setPlanTopics('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Manage Workspace</h1>
          <p className="card-subtext">
            Central command center to organize projects, sections, subtasks, bulk operations, and custom learning plans.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsImporterOpen(true)}>
          <Sparkles size={14} /> Create from Text
        </button>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-graphite)', paddingBottom: '12px' }}>
        <button
          className={`pill-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <Briefcase size={14} /> Projects ({state.projects.length})
        </button>
        <button
          className={`pill-tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare size={14} /> Tasks & Bulk Actions ({allProjectTasks.length})
        </button>
        <button
          className={`pill-tab ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          <Layers size={14} /> Custom Roadmap Plans ({(state.customRoadmapBlocks || []).length})
        </button>
      </div>

      {/* TAB 1: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Projects Table Card */}
          <div className="linear-card">
            <h2>All Workspace Projects</h2>
            <div style={{ marginTop: '14px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-graphite)', color: 'var(--color-fog)', fontFamily: 'var(--font-mono)' }}>
                    <th style={{ padding: '8px 10px' }}>Project Name</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                    <th style={{ padding: '8px 10px' }}>Sections</th>
                    <th style={{ padding: '8px 10px' }}>Tasks</th>
                    <th style={{ padding: '8px 10px' }}>Type</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.projects.map(proj => (
                    <tr key={proj.id} style={{ borderBottom: '1px solid var(--color-graphite)' }}>
                      <td style={{ padding: '10px' }}>
                        <b style={{ color: 'var(--color-paper)', fontWeight: 510 }}>{proj.title}</b>
                        <div className="card-subtext" style={{ fontSize: '12px' }}>
                          {proj.technologies.join(', ')}
                        </div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <select
                          value={proj.status}
                          onChange={e => updateProject(proj.id, { status: e.target.value as ProjectStatus })}
                          style={{ width: 'auto', padding: '3px 20px 3px 6px', fontSize: '12px' }}
                        >
                          <option value="not_started">Not started</option>
                          <option value="in_progress">In progress</option>
                          <option value="done">Done</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>
                        {proj.sections.length}
                      </td>
                      <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>
                        {proj.tasks.filter(t => t.status === 'done').length}/{proj.tasks.length}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {proj.isOriginal ? (
                          <span className="badge" style={{ fontSize: '10px' }}>Core</span>
                        ) : (
                          <Badge variant="lime">Custom</Badge>
                        )}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            onClick={() => {
                              setEditingProject(proj);
                              setSelectedSectionId(proj.sections[0]?.id || '');
                            }}
                            title="Manage Sections & Tasks"
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            className="btn"
                            style={{ padding: '4px 8px' }}
                            onClick={() => duplicateProject(proj.id)}
                            title="Duplicate Project"
                          >
                            <Copy size={13} />
                          </button>
                          {proj.status === 'archived' ? (
                            <button
                              className="btn"
                              style={{ padding: '4px 8px' }}
                              onClick={() => restoreProject(proj.id)}
                              title="Restore Project"
                            >
                              <RotateCcw size={13} />
                            </button>
                          ) : (
                            <button
                              className="btn"
                              style={{ padding: '4px 8px' }}
                              onClick={() => archiveProject(proj.id)}
                              title="Archive Project"
                            >
                              <Archive size={13} />
                            </button>
                          )}
                          <button
                            className="btn btn-danger"
                            style={{ padding: '4px 8px' }}
                            onClick={() => setProjectToDelete(proj)}
                            title="Delete Project"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Project Section & Subtask Drawer / Modal */}
          {editingProject && (
            <div className="modal-overlay">
              <div className="modal-container" style={{ maxWidth: '640px' }}>
                <div className="modal-header">
                  <div>
                    <h2>Manage Project: {editingProject.title}</h2>
                    <div className="card-subtext">Add sections, milestones, and individual tasks.</div>
                  </div>
                  <button className="btn" style={{ border: 0, padding: '4px' }} onClick={() => setEditingProject(null)}>
                    ×
                  </button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Current Sections & Tasks */}
                  {editingProject.sections.map(sec => {
                    const secTasks = editingProject.tasks.filter(t => t.sectionId === sec.id);
                    return (
                      <div key={sec.id} className="linear-card-obsidian">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <b style={{ color: 'var(--color-paper)', fontSize: '14px' }}>{sec.title}</b>
                          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
                            {secTasks.length} tasks
                          </span>
                        </div>
                        {secTasks.map(t => (
                          <div key={t.id} className="task-row" style={{ padding: '6px 4px' }}>
                            <Checkbox
                              checked={t.status === 'done'}
                              onChange={() => toggleProjectTask(editingProject.id, t.id)}
                              label={t.title}
                            />
                            <span style={{ flex: 1, fontSize: '13px', textDecoration: t.status === 'done' ? 'line-through' : 'none', color: t.status === 'done' ? 'var(--color-mist)' : 'var(--color-paper)' }}>
                              {t.title}
                            </span>
                            <Badge category={t.category}>{t.category}</Badge>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '2px 6px', border: 0 }}
                              onClick={() => deleteProjectTask(editingProject.id, t.id)}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {/* Add New Task Form */}
                  <div className="linear-card" style={{ padding: '14px' }}>
                    <div className="card-label">Add Task to Project</div>
                    <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr auto', marginTop: '6px' }}>
                      <input
                        type="text"
                        placeholder="Task title..."
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                      />
                      <select
                        value={newTaskCategory}
                        onChange={e => setNewTaskCategory(e.target.value as any)}
                        style={{ width: 'auto' }}
                      >
                        <option value="Build">Build</option>
                        <option value="Learn">Learn</option>
                        <option value="Practise">Practise</option>
                        <option value="Test">Test</option>
                        <option value="Review">Review</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: '10px' }}
                      onClick={() => {
                        if (!newTaskTitle.trim()) return;
                        const secId = editingProject.sections[0]?.id || 'sec-0';
                        addProjectTask(editingProject.id, secId, {
                          title: newTaskTitle.trim(),
                          category: newTaskCategory
                        });
                        setNewTaskTitle('');
                        // Refresh local reference
                        const refreshed = state.projects.find(p => p.id === editingProject.id);
                        if (refreshed) setEditingProject(refreshed);
                      }}
                    >
                      <Plus size={14} /> Add Task
                    </button>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={() => setEditingProject(null)}>
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Project Confirmation Modal */}
          {projectToDelete && (
            <div className="modal-overlay">
              <div className="modal-container" style={{ maxWidth: '480px' }}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-coral-red)' }}>
                    <AlertTriangle size={18} />
                    <h2>Confirm Project Deletion</h2>
                  </div>
                  <button className="btn" style={{ border: 0, padding: '4px' }} onClick={() => setProjectToDelete(null)}>
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <p style={{ color: 'var(--color-paper)', marginBottom: '8px', fontWeight: 510 }}>
                    Are you sure you want to permanently delete "{projectToDelete.title}"?
                  </p>
                  <p className="card-subtext" style={{ fontSize: '13px' }}>
                    This action will permanently erase:
                  </p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px', color: 'var(--color-fog)', fontSize: '13px', lineHeight: 1.6 }}>
                    <li>All {projectToDelete.sections.length} project sections</li>
                    <li>All {projectToDelete.tasks.length} associated tasks and milestone check states</li>
                    <li>Saved repository and live deployment links</li>
                    <li>Architecture notes and lessons learned</li>
                  </ul>
                </div>
                <div className="modal-footer">
                  <button className="btn" onClick={() => setProjectToDelete(null)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      deleteProject(projectToDelete.id);
                      setProjectToDelete(null);
                    }}
                  >
                    Yes, Permanently Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TASKS & BULK OPERATIONS */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--color-fog)' }} />
              <input
                type="text"
                placeholder="Search across all project tasks…"
                value={taskSearch}
                onChange={e => setTaskSearch(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </div>
            <select
              value={taskProjectFilter}
              onChange={e => setTaskProjectFilter(e.target.value)}
              style={{ flex: '1 1 140px' }}
            >
              <option value="all">All Projects</option>
              {state.projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <select
              value={taskCatFilter}
              onChange={e => setTaskCatFilter(e.target.value)}
              style={{ flex: '1 1 120px' }}
            >
              <option value="all">All Categories</option>
              <option value="Learn">Learn</option>
              <option value="Practise">Practise</option>
              <option value="Build">Build</option>
              <option value="Test">Test</option>
              <option value="Review">Review</option>
            </select>
            <select
              value={taskStatusFilter}
              onChange={e => setTaskStatusFilter(e.target.value)}
              style={{ flex: '1 1 120px' }}
            >
              <option value="all">All Statuses</option>
              <option value="todo">Incomplete</option>
              <option value="done">Completed</option>
            </select>
          </div>

          {/* Bulk Operations Toolbar */}
          {selectedTaskIds.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--color-obsidian)',
                border: '1px solid var(--color-graphite)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-buttons)',
                flexWrap: 'wrap'
              }}
            >
              <span className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-paper)' }}>
                {selectedTaskIds.length} tasks selected
              </span>
              <button className="btn" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={handleBulkMarkDone}>
                <Check size={12} /> Mark as Done
              </button>
              <button className="btn" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={handleBulkMarkTodo}>
                Mark as Incomplete
              </button>
              <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={handleBulkDelete}>
                <Trash2 size={12} /> Delete Selected
              </button>
            </div>
          )}

          {/* Master Task Table */}
          <div className="linear-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2>Master Task Register</h2>
              <span className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-fog)' }}>
                {filteredProjectTasks.length} tasks
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-graphite)', color: 'var(--color-fog)', fontFamily: 'var(--font-mono)' }}>
                    <th style={{ width: '32px', padding: '8px 4px' }}>
                      <Checkbox
                        checked={filteredProjectTasks.length > 0 && selectedTaskIds.length === filteredProjectTasks.length}
                        onChange={handleSelectAllTasks}
                        label="Select all tasks"
                      />
                    </th>
                    <th style={{ padding: '8px 10px' }}>Task Title</th>
                    <th style={{ padding: '8px 10px' }}>Category</th>
                    <th style={{ padding: '8px 10px' }}>Project</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjectTasks.map(t => {
                    const isSelected = selectedTaskIds.includes(t.id);
                    const isDone = t.status === 'done';
                    return (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--color-graphite)', background: isSelected ? 'var(--surface-active)' : undefined }}>
                        <td style={{ padding: '8px 4px' }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleToggleSelectTask(t.id)}
                            label={`Select ${t.title}`}
                          />
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ color: isDone ? 'var(--color-ash)' : 'var(--color-mist)', textDecoration: isDone ? 'line-through' : 'none' }}>
                            {t.title}
                          </span>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <Badge category={t.category}>{t.category}</Badge>
                        </td>
                        <td style={{ padding: '10px', fontSize: '12px', color: 'var(--color-fog)' }}>
                          {t.projectName}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span className="font-mono" style={{ fontSize: '12px', color: isDone ? 'var(--color-pulse-green)' : 'var(--color-fog)' }}>
                            {isDone ? '● Done' : '○ Todo'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM ROADMAP PLANS */}
      {activeTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Core Curriculum Notice */}
          <div className="linear-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Original 20-Week Curriculum</h2>
                <p className="card-subtext">The base 20-week curriculum is immutable and strictly preserved.</p>
              </div>
              <span className="badge badge-completed">Preserved & Active</span>
            </div>
          </div>

          {/* Add Custom Learning Plan Form */}
          <div className="linear-card">
            <h2>Add Custom Learning Plan / Phase</h2>
            <p className="card-subtext" style={{ marginBottom: '14px' }}>
              Extend your learning journey with custom advanced tracks (e.g. Kubernetes, System Design, Rust, Microservices).
            </p>

            <form onSubmit={handleAddCustomPlan}>
              <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <div>
                  <div className="card-label">Track / Phase Title *</div>
                  <input
                    type="text"
                    required
                    value={planTitle}
                    onChange={e => setPlanTitle(e.target.value)}
                    placeholder="e.g. Cloud-Native & Kubernetes Mastery"
                  />
                </div>
                <div>
                  <div className="card-label">Week Span</div>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={planWeekSpan}
                    onChange={e => setPlanWeekSpan(Number(e.target.value))}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="card-label">Milestone Deliverable</div>
                  <input
                    type="text"
                    value={planDeliverable}
                    onChange={e => setPlanDeliverable(e.target.value)}
                    placeholder="e.g. Deploy containerized microservice cluster with Helm charts"
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="card-label">Curriculum Topics (one per line)</div>
                  <textarea
                    rows={4}
                    value={planTopics}
                    onChange={e => setPlanTopics(e.target.value)}
                    placeholder="Docker multi-stage builds&#10;Kubernetes Pods, Services and Ingress&#10;ConfigMaps, Secrets, and Helm charts&#10;CI/CD automated deployment with GitHub Actions"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '14px' }}>
                <Plus size={14} /> Add Learning Plan
              </button>
            </form>
          </div>

          {/* List of Custom Plans */}
          {(state.customRoadmapBlocks || []).length > 0 && (
            <div className="linear-card">
              <h2>Active Custom Plans</h2>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(state.customRoadmapBlocks || []).map(b => (
                  <div key={b.id} className="linear-card-obsidian">
                    <b style={{ color: 'var(--color-paper)', fontSize: '14px' }}>{b.title}</b>
                    <p className="card-subtext" style={{ marginTop: '4px' }}>Deliverable: {b.deliverable}</p>
                    <div style={{ marginTop: '8px' }}>
                      {b.topics.map((t, idx) => (
                        <div key={idx} className="font-mono" style={{ fontSize: '12px', color: 'var(--color-mist)', padding: '2px 0' }}>
                          • {t}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
