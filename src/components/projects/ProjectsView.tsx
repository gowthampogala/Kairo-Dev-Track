import React, { useState } from 'react';
import { Plus, Sparkles, ExternalLink, GitBranch, CheckCircle2, MoreVertical, Trash2, Copy, Archive, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProjectProgress } from '../../services/progress';
import { Badge } from '../common/Badge';
import { Checkbox } from '../common/Checkbox';
import { Project, ProjectStatus } from '../../types';

export const ProjectsView: React.FC = () => {
  const {
    state,
    updateProject,
    toggleProjectTask,
    deleteProject,
    duplicateProject,
    archiveProject,
    restoreProject,
    setIsImporterOpen,
    selectedProjectId,
    setSelectedProjectId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // New Project simple modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTechs, setNewTechs] = useState('');

  const { createProject } = useApp();

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const projId = createProject({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom learning project',
      technologies: newTechs.split(',').map(s => s.trim()).filter(Boolean),
      sections: [{ id: `sec-0`, title: 'Core Milestones', order: 0 }],
      tasks: [
        {
          id: `task-${Date.now()}-0`,
          title: 'Initial architecture & project setup',
          category: 'Build',
          status: 'todo'
        }
      ]
    });

    setNewTitle('');
    setNewDesc('');
    setNewTechs('');
    setShowNewModal(false);
    setSelectedProjectId(projId);
  };

  const displayedProjects = state.projects.filter(p =>
    activeTab === 'archived' ? p.status === 'archived' : p.status !== 'archived'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Projects Portfolio</h1>
          <p className="card-subtext">
            Build and deploy end-to-end full-stack & AI capstone projects with tracked milestones, code repositories, and live links.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setIsImporterOpen(true)}>
            <Sparkles size={14} /> Create from Text
          </button>
          <button className="btn" onClick={() => setShowNewModal(true)}>
            <Plus size={14} /> New Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className={`pill-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Projects ({state.projects.filter(p => p.status !== 'archived').length})
        </button>
        <button
          className={`pill-tab ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          Archived ({state.projects.filter(p => p.status === 'archived').length})
        </button>
      </div>

      {/* Manual New Project Modal */}
      {showNewModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button className="btn" style={{ border: 0, padding: '4px' }} onClick={() => setShowNewModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateManual}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div className="card-label">Project Name *</div>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Distributed Task Queue"
                  />
                </div>
                <div>
                  <div className="card-label">Description</div>
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Brief architectural overview and project goals"
                  />
                </div>
                <div>
                  <div className="card-label">Technologies (comma separated)</div>
                  <input
                    type="text"
                    value={newTechs}
                    onChange={e => setNewTechs(e.target.value)}
                    placeholder="e.g. Java, Redis, Docker, Spring Boot"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setShowNewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        {displayedProjects.map(proj => {
          const prog = calculateProjectProgress(proj);
          const isSelected = selectedProjectId === proj.id;

          return (
            <div
              key={proj.id}
              className="linear-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: isSelected ? '1px solid var(--color-acid-lime)' : undefined
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '16px' }}>{proj.title}</h2>
                  {proj.isOriginal && (
                    <span className="badge" style={{ marginTop: '4px', fontSize: '10px' }}>
                      Core Curriculum Project
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <select
                    value={proj.status}
                    onChange={e => updateProject(proj.id, { status: e.target.value as ProjectStatus })}
                    style={{ width: 'auto', padding: '4px 24px 4px 8px', fontSize: '12px' }}
                  >
                    <option value="not_started">Not started</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <p className="card-subtext" style={{ fontSize: '13px' }}>
                {proj.description}
              </p>

              {/* Technologies Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {proj.technologies.map((tech, i) => (
                  <span key={i} className="font-mono" style={{ fontSize: '11px', color: 'var(--color-fog)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-graphite)' }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-fog)', fontFamily: 'var(--font-mono)' }}>
                  <span>Milestones</span>
                  <span className="tab-num">{prog.completed}/{prog.total} ({prog.percent}%)</span>
                </div>
                <div className="linear-progress-bar">
                  <div className="linear-progress-bar-fill" style={{ width: `${prog.percent}%` }} />
                </div>
              </div>

              {/* Tasks Checklist */}
              <div style={{ margin: '4px 0' }}>
                {proj.tasks.map(t => {
                  const isDone = t.status === 'done';
                  return (
                    <div key={t.id} className={`task-row ${isDone ? 'task-done' : ''}`} style={{ padding: '6px 4px' }}>
                      <Checkbox
                        checked={isDone}
                        onChange={() => toggleProjectTask(proj.id, t.id)}
                        label={t.title}
                      />
                      <span
                        onClick={() => toggleProjectTask(proj.id, t.id)}
                        style={{ flex: 1, cursor: 'pointer', fontSize: '13px', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--color-mist)' : 'var(--color-paper)' }}
                      >
                        {t.title}
                      </span>
                      <Badge category={t.category}>{t.category}</Badge>
                    </div>
                  );
                })}
              </div>

              {/* Repository & Live Links */}
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <div className="card-label">GitHub URL</div>
                  <input
                    type="url"
                    value={proj.githubUrl || ''}
                    onChange={e => updateProject(proj.id, { githubUrl: e.target.value })}
                    placeholder="https://github.com/…"
                    style={{ fontSize: '12px' }}
                  />
                </div>
                <div>
                  <div className="card-label">Live Deployment URL</div>
                  <input
                    type="url"
                    value={proj.liveUrl || ''}
                    onChange={e => updateProject(proj.id, { liveUrl: e.target.value })}
                    placeholder="https://…"
                    style={{ fontSize: '12px' }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="card-label">Notes & Lessons Learned</div>
                <textarea
                  value={proj.notes || ''}
                  onChange={e => updateProject(proj.id, { notes: e.target.value })}
                  placeholder="Key architectural breakthroughs, challenges, or interview takeaways…"
                  style={{ minHeight: '60px', fontSize: '12px', marginTop: '4px' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--color-graphite)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '4px 8px', fontSize: '12px' }}>
                      <GitBranch size={12} /> Repo
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '4px 8px', fontSize: '12px' }}>
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn" style={{ padding: '4px 8px' }} onClick={() => duplicateProject(proj.id)} title="Duplicate project">
                    <Copy size={13} />
                  </button>

                  {proj.status === 'archived' ? (
                    <button className="btn" style={{ padding: '4px 8px' }} onClick={() => restoreProject(proj.id)} title="Restore project">
                      <RotateCcw size={13} />
                    </button>
                  ) : (
                    <button className="btn" style={{ padding: '4px 8px' }} onClick={() => archiveProject(proj.id)} title="Archive project">
                      <Archive size={13} />
                    </button>
                  )}

                  {confirmDeleteId === proj.id ? (
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      onClick={() => {
                        deleteProject(proj.id);
                        setConfirmDeleteId(null);
                      }}
                    >
                      Confirm Delete
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px' }}
                      onClick={() => setConfirmDeleteId(proj.id)}
                      title="Delete project"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
