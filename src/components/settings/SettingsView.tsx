import React, { useState } from 'react';
import { Download, Upload, AlertTriangle, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROADMAP_BLOCKS, formatWeekLabel } from '../../data/curriculum';

export const SettingsView: React.FC = () => {
  const { state, updateSettings, currentPosition, exportBackup, importBackup, resetAllProgress } = useApp();

  const [importJsonText, setImportJsonText] = useState('');
  const [importFeedback, setImportFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentBlock = ROADMAP_BLOCKS[currentPosition.blockIndex];

  const handleTextImport = () => {
    if (!importJsonText.trim()) return;
    const res = importBackup(importJsonText);
    setImportFeedback(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      if (content) {
        const res = importBackup(content);
        setImportFeedback(res);
        setImportJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleCopyCurrentJson = () => {
    const jsonStr = JSON.stringify(state, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1>Settings & Data Management</h1>
        <p className="card-subtext">
          Configure study preferences, sync calendar timelines, and manage local storage backups.
        </p>
      </div>

      {/* Preferences Card */}
      <div className="linear-card">
        <h2>Schedule & Preferences</h2>
        <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: '14px' }}>
          <div>
            <div className="card-label">Roadmap Start Date</div>
            <input
              type="date"
              value={state.settings.startDate}
              onChange={e => updateSettings({ startDate: e.target.value })}
              style={{ marginTop: '4px' }}
            />
          </div>
          <div>
            <div className="card-label">Daily Target Study Hours</div>
            <input
              type="number"
              step="0.5"
              min="1"
              max="16"
              value={state.settings.dailyTargetHours}
              onChange={e => updateSettings({ dailyTargetHours: parseFloat(e.target.value) || 6 })}
              style={{ marginTop: '4px' }}
            />
          </div>
          <div>
            <div className="card-label">Color Theme</div>
            <select
              value={state.settings.theme}
              onChange={e => updateSettings({ theme: e.target.value as any })}
              style={{ marginTop: '4px' }}
            >
              <option value="dark">Dark Midnight (Default)</option>
              <option value="light">Light Mode</option>
            </select>
          </div>
        </div>

        <p className="card-subtext" style={{ marginTop: '12px', fontSize: '13px' }}>
          Based on your start date ({state.settings.startDate}), your current position is{' '}
          <b style={{ color: 'var(--color-paper)' }}>Week {currentPosition.week}</b> ({formatWeekLabel(currentBlock)}, Day {currentPosition.dayInBlock}).
        </p>
      </div>

      {/* Export & Import Backup Card */}
      <div className="linear-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} style={{ color: 'var(--color-pulse-green)' }} />
          <h2>Persistence, Export & Import</h2>
        </div>
        <p className="card-subtext" style={{ marginTop: '4px' }}>
          Your tasks and roadmap progress live in this browser’s local storage. Export a JSON backup periodically to transfer progress across machines.
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0' }}>
          <button className="btn btn-primary" onClick={exportBackup}>
            <Download size={14} /> Download Backup (.json)
          </button>
          <button className="btn" onClick={handleCopyCurrentJson}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied JSON!' : 'Copy JSON'}
          </button>
          <label className="btn" style={{ cursor: 'pointer' }}>
            <Upload size={14} /> Upload Backup File
            <input type="file" accept=".json,application/json" onChange={handleFileUpload} hidden />
          </label>
        </div>

        <div>
          <div className="card-label">Backup JSON Raw Data / Restore</div>
          <textarea
            rows={5}
            className="font-mono"
            style={{ fontSize: '12px', marginTop: '4px' }}
            value={importJsonText}
            onChange={e => setImportJsonText(e.target.value)}
            placeholder="Paste exported backup JSON here to restore…"
          />
        </div>

        {importJsonText && (
          <button className="btn" style={{ marginTop: '10px' }} onClick={handleTextImport}>
            Apply Backup from Text Box
          </button>
        )}

        {importFeedback && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              background: importFeedback.success ? 'rgba(39, 166, 68, 0.1)' : 'rgba(235, 87, 87, 0.1)',
              color: importFeedback.success ? 'var(--color-pulse-green)' : 'var(--color-coral-red)',
              border: `1px solid ${importFeedback.success ? 'rgba(39, 166, 68, 0.3)' : 'rgba(235, 87, 87, 0.3)'}`
            }}
          >
            {importFeedback.message}
          </div>
        )}
      </div>

      {/* Destructive Reset Progress Card */}
      <div className="linear-card" style={{ borderColor: 'rgba(235, 87, 87, 0.2)' }}>
        <h2 style={{ color: 'var(--color-coral-red)' }}>Reset All Progress</h2>
        <p className="card-subtext">
          Permanently clear all completed checkboxes, daily study logs, custom tasks, project changes, and retrospectives in this browser.
        </p>

        {showResetConfirm ? (
          <div style={{ marginTop: '14px', padding: '14px', background: 'var(--color-obsidian)', borderRadius: '6px', border: '1px solid rgba(235, 87, 87, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-coral-red)', fontWeight: 510 }}>
              <AlertTriangle size={16} />
              Are you sure? This cannot be undone unless you export a backup first.
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  exportBackup();
                  resetAllProgress();
                  setShowResetConfirm(false);
                }}
              >
                Download Safety Backup & Reset
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  resetAllProgress();
                  setShowResetConfirm(false);
                }}
              >
                Erase Everything Without Backup
              </button>
              <button className="btn" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn btn-danger"
            style={{ marginTop: '14px' }}
            onClick={() => setShowResetConfirm(true)}
          >
            Reset Progress…
          </button>
        )}
      </div>
    </div>
  );
};
