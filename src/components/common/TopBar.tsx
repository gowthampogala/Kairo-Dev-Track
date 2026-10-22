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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            background: 'var(--color-charcoal)',
            border: '1px solid var(--color-graphite)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              background: 'var(--color-brand)',
              borderRadius: '1.5px',
              boxShadow: '0 0 6px rgba(228, 242, 34, 0.6)'
            }}
          />
        </div>
        <span style={{ fontWeight: 510, letterSpacing: '-0.012em', fontSize: '14px' }}>
          KAIRO DEV TRACK
        </span>
      </div>
    </div>
  );
};
