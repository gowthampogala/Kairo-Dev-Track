import React, { useState } from 'react';
import { X, FileText, Check, Trash2, Plus, Sparkles, ArrowRight, Eye, Code } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { parseMarkdownToProject } from '../../services/markdownParser';
import { ParsedImportPreview, TaskCategory } from '../../types';
import { Badge } from '../common/Badge';

export const PasteToProjectModal: React.FC = () => {
  const { isImporterOpen, setIsImporterOpen, importParsedProject, setSelectedProjectId, setActivePage } = useApp();

  const [rawText, setRawText] = useState<string>(
`# Java Collections Mastery

## Week 1: HashMap
- Understand hashing and buckets
- Learn hashCode() and equals()
- Practise frequency-counting problems
- Solve five interview questions

## Week 2: HashSet
- Understand uniqueness
- Learn add(), contains(), and remove()
- Solve longest consecutive sequence`
  );

  const [preview, setPreview] = useState<ParsedImportPreview | null>(null);
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isImporterOpen) return null;

  const handleParse = () => {
    if (!rawText.trim()) return;
    const parsed = parseMarkdownToProject(rawText);
    setPreview(parsed);
    setStep('preview');
  };

  const handleRemoveTask = (secIdx: number, taskIdx: number) => {
    if (!preview) return;
    const nextSections = [...preview.sections];
    nextSections[secIdx].tasks.splice(taskIdx, 1);
    setPreview({
      ...preview,
      sections: nextSections
    });
  };

  const handleUpdateTaskTitle = (secIdx: number, taskIdx: number, title: string) => {
    if (!preview) return;
    const nextSections = [...preview.sections];
    nextSections[secIdx].tasks[taskIdx].title = title;
    setPreview({ ...preview, sections: nextSections });
  };

  const handleUpdateTaskCategory = (secIdx: number, taskIdx: number, cat: TaskCategory) => {
    if (!preview) return;
    const nextSections = [...preview.sections];
    nextSections[secIdx].tasks[taskIdx].category = cat;
    setPreview({ ...preview, sections: nextSections });
  };

  const handleAddTaskToSection = (secIdx: number) => {
    if (!preview) return;
    const nextSections = [...preview.sections];
    nextSections[secIdx].tasks.push({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: 'New milestone task',
      category: 'Build',
      status: 'todo'
    });
    setPreview({ ...preview, sections: nextSections });
  };

  const handleConfirmImport = () => {
    if (!preview) return;
    const newProjectId = importParsedProject(preview);
    setSuccessToast(`Project "${preview.projectTitle}" created with success!`);
    
    setTimeout(() => {
      setIsImporterOpen(false);
      setSelectedProjectId(newProjectId);
      setActivePage('projects');
      setStep('input');
      setSuccessToast(null);
    }, 400);
  };

  const totalTasks = preview ? preview.sections.reduce((acc, s) => acc + s.tasks.length, 0) : 0;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-container" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} style={{ color: 'var(--color-acid-lime)' }} />
            <h2 id="modal-title">Paste-to-Project Importer</h2>
          </div>
          <button
            className="btn"
            style={{ border: 0, padding: '4px' }}
            onClick={() => setIsImporterOpen(false)}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {successToast ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-pulse-green)' }}>
              <Check size={32} style={{ margin: '0 auto 12px' }} />
              <h3>{successToast}</h3>
              <p className="card-subtext">Opening your new project now…</p>
            </div>
          ) : step === 'input' ? (
            <div>
              <p className="card-subtext" style={{ marginBottom: '12px' }}>
                Paste plain text, task notes, or Markdown with headings (<code className="font-mono">#</code>, <code className="font-mono">##</code>) and bullet lists (<code className="font-mono">-</code>, <code className="font-mono">*</code>, <code className="font-mono">- [ ]</code>). We will automatically generate sections and checkable tasks for your project.
              </p>

              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                rows={12}
                className="font-mono"
                style={{ fontSize: '13px', lineHeight: 1.6, height: '240px' }}
                placeholder="# My New Project&#10;&#10;## Section 1: Foundation&#10;- Setup development environment&#10;- Configure database connection"
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
                  Auto-detects categories: Learn, Practise, Build, Test, Review
                </span>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setRawText(
`# Full-Stack Next.js AI SaaS

## Phase 1: Authentication & Schema
- Setup Next.js 14 App Router and TypeScript
- Integrate Clerk or NextAuth authentication
- Design Prisma ORM database models in PostgreSQL
- Write schema migration scripts

## Phase 2: Core AI Engine
- Connect OpenAI API with streaming responses
- Implement document vector embeddings with Pinecone
- Add token usage quota limits and rate-limiting
- Test edge function responses under load

## Phase 3: Billing & Deployment
- Integrate Stripe subscription checkout webhook
- Deploy production build to Vercel
- Configure custom domain and SSL certificates`
                  )}
                >
                  <Sparkles size={13} /> Load SaaS Template
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Preview & Edit Screen */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant="lime">{preview?.sections.length} Sections</Badge>
                  <Badge variant="completed">{totalTasks} Checkable Tasks</Badge>
                </div>
                <button className="btn" onClick={() => setStep('input')}>
                  Edit Source Text
                </button>
              </div>

              {/* Editable Project Title & Description */}
              <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <div className="card-label">Project Title</div>
                  <input
                    type="text"
                    value={preview?.projectTitle || ''}
                    onChange={e => setPreview(prev => prev ? { ...prev, projectTitle: e.target.value } : null)}
                    style={{ fontWeight: 510, fontSize: '15px' }}
                  />
                </div>
                <div>
                  <div className="card-label">Project Description</div>
                  <input
                    type="text"
                    value={preview?.projectDescription || ''}
                    onChange={e => setPreview(prev => prev ? { ...prev, projectDescription: e.target.value } : null)}
                  />
                </div>
              </div>

              {/* Sections & Tasks Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {preview?.sections.map((sec, secIdx) => (
                  <div key={sec.id} className="linear-card-obsidian">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={e => {
                          const nextSec = [...preview.sections];
                          nextSec[secIdx].title = e.target.value;
                          setPreview({ ...preview, sections: nextSec });
                        }}
                        style={{ background: 'transparent', border: 0, fontWeight: 510, fontSize: '14px', color: 'var(--color-paper)', padding: 0 }}
                      />
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-fog)' }}>
                        {sec.tasks.length} tasks
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {sec.tasks.map((task, taskIdx) => (
                        <div
                          key={task.id}
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            background: 'var(--color-carbon)',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid var(--color-graphite)'
                          }}
                        >
                          <input
                            type="text"
                            value={task.title}
                            onChange={e => handleUpdateTaskTitle(secIdx, taskIdx, e.target.value)}
                            style={{ flex: 1, background: 'transparent', border: 0, padding: 0, color: 'var(--color-mist)', fontSize: '13px' }}
                          />
                          <select
                            value={task.category}
                            onChange={e => handleUpdateTaskCategory(secIdx, taskIdx, e.target.value as any)}
                            style={{ width: 'auto', padding: '3px 20px 3px 6px', fontSize: '11px' }}
                          >
                            <option value="Learn">Learn</option>
                            <option value="Practise">Practise</option>
                            <option value="Build">Build</option>
                            <option value="Test">Test</option>
                            <option value="Review">Review</option>
                          </select>
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ padding: '4px', border: 0 }}
                            onClick={() => handleRemoveTask(secIdx, taskIdx)}
                            title="Remove task from import"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn"
                      style={{ marginTop: '10px', fontSize: '12px', padding: '4px 8px' }}
                      onClick={() => handleAddTaskToSection(secIdx)}
                    >
                      <Plus size={12} /> Add Task
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!successToast && (
          <div className="modal-footer">
            <button className="btn" onClick={() => setIsImporterOpen(false)}>
              Cancel
            </button>
            {step === 'input' ? (
              <button className="btn btn-primary" onClick={handleParse}>
                Preview Project & Tasks <ArrowRight size={14} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleConfirmImport}>
                <Check size={14} /> Confirm & Create Project
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
