import React from 'react';

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
  tabIndex?: number;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
  tabIndex = 0
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  return (
    <div
      className={`kairo-checkbox-container ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      onClick={handleClick}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : tabIndex}
      onKeyDown={handleKeyDown}
      id={id}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '10px', flex: 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <div
        className={`kairo-checkbox-box ${checked ? 'checked' : ''}`}
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          border: checked ? '1px solid var(--color-pulse-green)' : '1px solid var(--color-smoke)',
          backgroundColor: checked ? 'var(--color-pulse-green)' : 'var(--color-carbon)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
          marginTop: '2px',
          transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: checked ? '0 0 6px rgba(39, 166, 68, 0.35)' : 'none'
        }}
      >
        {checked && (
          <svg
            viewBox="0 0 14 14"
            style={{ width: '10px', height: '10px', stroke: '#ffffff', strokeWidth: 2.6, fill: 'none', display: 'block' }}
          >
            <polyline points="2.5 7.5 5.5 10.5 11.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {label && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              color: checked ? 'var(--color-fog)' : 'var(--color-paper)',
              textDecoration: checked ? 'line-through' : 'none',
              fontSize: '13px',
              lineHeight: 1.45,
              transition: 'color 0.15s ease, text-decoration 0.15s ease',
              display: 'inline-block'
            }}
          >
            {label}
          </span>
          {description && (
            <div style={{ color: 'var(--color-fog)', fontSize: '12px', marginTop: '2px' }}>
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
