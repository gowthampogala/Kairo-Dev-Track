import React, { useState, useMemo } from 'react';
import { X, Upload, Check, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { SPRING_FRAMEWORK_MODULES, AcademyModule } from '../../data/springFrameworkCurriculum';

interface ImportVideoTitlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModuleId?: string;
  onImportSingleModule: (moduleId: string, titles: string[]) => void;
  onImportMultipleModules: (data: Record<string, string[]>) => void;
}

export const ImportVideoTitlesModal: React.FC<ImportVideoTitlesModalProps> = ({
  isOpen,
  onClose,
  defaultModuleId,
  onImportSingleModule,
  onImportMultipleModules
}) => {
  const [pastedText, setPastedText] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    defaultModuleId || SPRING_FRAMEWORK_MODULES[0].id
  );

  // Helper to match a line to a module title
  const findMatchingModule = (line: string): AcademyModule | undefined => {
    const clean = line.replace(/^(module\s*:?|#+|\d+[\.\)]|\s*-\s*)/i, '').trim().toLowerCase();
    return SPRING_FRAMEWORK_MODULES.find(m => {
      const mTitle = m.title.toLowerCase();
      return clean === mTitle || clean.includes(mTitle) || mTitle.includes(clean);
    });
  };

  // Clean a video title line
  const cleanTitleLine = (line: string): string => {
    return line
      .replace(/^(\d+[\.\)\-:]|\s*[\*\-•]\s*|\s*\[\d+\]\s*)/, '')
      .replace(/^video\s*\d+\s*[:\-]\s*/i, '')
      .trim();
  };

  // Parse text into either multi-module mapping or single module list
  const parseResult = useMemo(() => {
    if (!pastedText.trim()) {
      return { isMulti: false, singleTitles: [], multiMap: {} };
    }

    const lines = pastedText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const multiMap: Record<string, string[]> = {};
    let currentModuleId: string | null = null;
    let hasExplicitModuleHeaders = false;

    for (const line of lines) {
      // Check if line indicates a module header
      const lower = line.toLowerCase();
      const isHeaderPrefix = lower.startsWith('module:') || lower.startsWith('module ') || lower.startsWith('##');
      const matchedMod = findMatchingModule(line);

      if ((isHeaderPrefix && matchedMod) || matchedMod) {
        currentModuleId = matchedMod.id;
        hasExplicitModuleHeaders = true;
        if (!multiMap[currentModuleId]) {
          multiMap[currentModuleId] = [];
        }
        continue;
      }

      // Video title line
      const cleaned = cleanTitleLine(line);
      if (cleaned.length > 0) {
        if (currentModuleId) {
          if (!multiMap[currentModuleId]) multiMap[currentModuleId] = [];
          multiMap[currentModuleId].push(cleaned);
        }
      }
    }

    if (hasExplicitModuleHeaders && Object.keys(multiMap).length > 0) {
      return { isMulti: true, singleTitles: [], multiMap };
    }

    // Otherwise, parse as flat single module list
    const singleTitles = lines
      .map(cleanTitleLine)
      .filter(t => t.length > 0);

    return { isMulti: false, singleTitles, multiMap: {} };
  }, [pastedText]);

  if (!isOpen) return null;

  const handleConfirmImport = () => {
    if (parseResult.isMulti) {
      onImportMultipleModules(parseResult.multiMap);
    } else {
      if (parseResult.singleTitles.length > 0) {
        onImportSingleModule(selectedModuleId, parseResult.singleTitles);
      }
    }
    setPastedText('');
    onClose();
  };

  const totalParsedCount = parseResult.isMulti
    ? Object.values(parseResult.multiMap).reduce((acc, list) => acc + list.length, 0)
    : parseResult.singleTitles.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '640px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(228, 242, 34, 0.1)',
                border: '1px solid rgba(228, 242, 34, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-acid-lime)'
              }}
            >
              <Upload size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', color: 'var(--color-paper)', margin: 0 }}>
                Import Academy Video Titles
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--color-fog)', marginTop: '2px' }}>
                Paste numbered or bulleted video titles to replace placeholder names
              </div>
            </div>
          </div>
          <button className="btn" style={{ border: 0, padding: '4px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Instructions & Example */}
          <div
            style={{
              background: 'var(--color-obsidian)',
              border: '1px solid var(--color-graphite)',
              borderRadius: '6px',
              padding: '12px 14px',
              fontSize: '12.5px',
              color: 'var(--color-mist)',
              lineHeight: 1.45
            }}
          >
            <div style={{ fontWeight: 550, color: 'var(--color-paper)', marginBottom: '4px' }}>
              Supported Formats:
            </div>
            <div>
              • <strong>Single Module:</strong> Paste lines like <code>1. Introduction to Spring</code> and select the target module below.
            </div>
            <div>
              • <strong>Multi-Module:</strong> Paste with module titles like <code>Module: Inversion of control</code> followed by video titles.
            </div>
          </div>

          {/* Module Selector (shown if not multi-module detected) */}
          {!parseResult.isMulti && (
            <div>
              <div className="card-label" style={{ marginBottom: '6px' }}>
                Target Module
              </div>
              <select
                value={selectedModuleId}
                onChange={e => setSelectedModuleId(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--color-carbon)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-inputs)',
                  color: 'var(--color-paper)',
                  fontSize: '13px',
                  padding: '8px 10px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {SPRING_FRAMEWORK_MODULES.map(m => (
                  <option key={m.id} value={m.id}>
                    Module {m.moduleNumber}: {m.title} ({m.lessonsCount} lessons)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Textarea Input */}
          <div>
            <div className="card-label" style={{ marginBottom: '6px' }}>
              Paste Video Titles Here
            </div>
            <textarea
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              placeholder={`1. Introduction to Spring Framework\n2. Why Spring Framework is used\n3. Problems Spring Solves\n4. Spring Architecture\n5. Spring vs Spring Boot`}
              rows={7}
              style={{
                width: '100%',
                background: 'var(--color-carbon)',
                border: '1px solid var(--color-graphite)',
                borderRadius: 'var(--radius-inputs)',
                color: 'var(--color-paper)',
                fontSize: '13px',
                padding: '10px 12px',
                outline: 'none',
                lineHeight: 1.5,
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          {/* Live Preview Section */}
          {totalParsedCount > 0 && (
            <div
              style={{
                background: 'var(--color-obsidian)',
                border: '1px solid var(--color-graphite)',
                borderRadius: '6px',
                padding: '12px 14px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <span className="card-label">Import Preview</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--color-acid-lime)',
                    background: 'rgba(228, 242, 34, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(228, 242, 34, 0.2)'
                  }}
                >
                  {totalParsedCount} {totalParsedCount === 1 ? 'video' : 'videos'} detected
                </span>
              </div>

              <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {parseResult.isMulti ? (
                  Object.entries(parseResult.multiMap).map(([mId, titles]) => {
                    const mod = SPRING_FRAMEWORK_MODULES.find(m => m.id === mId);
                    return (
                      <div key={mId} style={{ marginBottom: '6px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-acid-lime)' }}>
                          {mod?.title || mId} ({titles.length} videos):
                        </div>
                        {titles.map((t, idx) => (
                          <div key={idx} style={{ fontSize: '12px', color: 'var(--color-mist)', paddingLeft: '12px' }}>
                            {idx + 1}. {t}
                          </div>
                        ))}
                      </div>
                    );
                  })
                ) : (
                  parseResult.singleTitles.map((t, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-mist)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span className="font-mono" style={{ color: 'var(--color-fog)', fontSize: '11px' }}>
                        #{idx + 1}
                      </span>
                      <span>{t}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={totalParsedCount === 0}
            onClick={handleConfirmImport}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Check size={14} />
            <span>Confirm & Import ({totalParsedCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
