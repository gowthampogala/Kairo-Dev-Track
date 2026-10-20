import React from 'react';
import { Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopBar: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen } = useApp();

  return (
    <div
      style={{
        display: 'none',
        position: 'fixed',
        top: 'env(safe-area-inset-top, 0px)',
        left: 0,
        right: 0,
        height: '50px',
        alignItems: 'center',
        gap: '12px',
        padding: '0 16px',
        background: 'var(--color-carbon)',
        borderBottom: '1px solid var(--color-graphite)',
        zIndex: 15,
        color: 'var(--color-paper)'
      }}
      className="mobile-header"
    >
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle Navigation Menu"
        style={{
          background: 'none',
          border: 0,
          color: 'var(--color-paper)',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <span style={{ fontWeight: 510, letterSpacing: '-0.012em', fontSize: '14px' }}>
        KAIRO DEV TRACK
      </span>
    </div>
  );
};
