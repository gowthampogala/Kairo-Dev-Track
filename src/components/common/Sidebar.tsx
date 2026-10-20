import React from 'react';
import {
  LayoutGrid,
  CheckSquare,
  Map,
  Folder,
  SlidersHorizontal,
  FileText,
  Settings,
  Sparkles,
  FileCode,
  Server,
  Network
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateRoadmapProgress } from '../../services/progress';
import { PHASES, ROADMAP_BLOCKS } from '../../data/curriculum';
import { TOTAL_ACADEMY_LESSONS } from '../../data/springFrameworkCurriculum';
import { TOTAL_AI_TOPICS } from '../../data/aiEngineeringCurriculum';
import { TOTAL_NETWORK_TOPICS } from '../../data/networkFundamentalsCurriculum';

export const Sidebar: React.FC = () => {
  const { state, activePage, setActivePage, currentPosition, mobileMenuOpen, setMobileMenuOpen } = useApp();
  const { percent } = calculateRoadmapProgress(state);

  const jsCompletedCount = Object.values(state.jsRoadmap || {}).filter(l => l?.completed).length;
  const springFrameworkCompletedCount = Object.values(state.springFrameworkRoadmap || {}).filter(l => l?.completed).length;
  const aiCompletedCount = Object.values(state.aiRoadmap || {}).filter(t => t?.completed).length;
  const networkCompletedCount = Object.values(state.networkRoadmap || {}).filter(t => t?.completed).length;

  const currentBlock = ROADMAP_BLOCKS[currentPosition.blockIndex];
  const currentPhaseTitle = PHASES[currentPosition.phaseIndex]?.title || 'Learning Roadmap';

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'daily', label: 'Daily Checklist', icon: CheckSquare },
    { id: 'js-roadmap', label: 'JS Roadmap', icon: FileCode, badge: `${jsCompletedCount}/41` },
    { id: 'spring-framework', label: 'Spring Framework', icon: Server, badge: `${springFrameworkCompletedCount}/${TOTAL_ACADEMY_LESSONS}` },
    { id: 'ai-roadmap', label: 'AI Engineering', icon: Sparkles, badge: `${aiCompletedCount}/${TOTAL_AI_TOPICS}` },
    { id: 'network-roadmap', label: 'Network Fundamentals', icon: Network, badge: `${networkCompletedCount}/${TOTAL_NETWORK_TOPICS}` },
    { id: 'roadmap', label: '20-Week Roadmap', icon: Map },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'workspace', label: 'Manage Workspace', icon: SlidersHorizontal },
    { id: 'reviews', label: 'Weekly Reviews', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <aside className={`app-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div
        className="logo"
        style={{
          color: 'var(--color-paper)',
          fontWeight: 510,
          fontSize: '14px',
          letterSpacing: '-0.012em',
          padding: '6px 10px 18px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
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
              background: 'var(--color-acid-lime)',
              borderRadius: '1.5px',
              boxShadow: '0 0 6px rgba(228, 242, 34, 0.6)'
            }}
          />
        </div>
        <span>KAIRO DEV TRACK</span>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                width: '100%',
                background: isActive ? 'var(--surface-active)' : 'transparent',
                border: 0,
                color: isActive ? 'var(--color-paper)' : 'var(--color-mist)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-buttons)',
                fontFamily: 'var(--font-inter)',
                fontSize: '13px',
                fontWeight: isActive ? 510 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'background 0.12s ease, color 0.12s ease'
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '6px',
                    bottom: '6px',
                    width: '2px',
                    borderRadius: '0 2px 2px 0',
                    background: 'var(--color-acid-lime)'
                  }}
                />
              )}
              <Icon size={16} strokeWidth={1.8} style={{ color: isActive ? 'var(--color-paper)' : 'var(--color-fog)' }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10.5px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(228, 242, 34, 0.15)' : 'var(--color-charcoal)',
                    color: isActive ? 'var(--color-acid-lime)' : 'var(--color-fog)',
                    border: '1px solid var(--color-graphite)'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Progress Widget */}
      <div
        className="sidebar-widget"
        style={{
          border: '1px solid var(--color-graphite)',
          borderRadius: 'var(--radius-buttons)',
          padding: '12px 14px',
          background: 'var(--color-obsidian)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="card-label">Phase {currentPosition.phaseIndex + 1} · Week {currentPosition.week}</div>
        <div style={{ color: 'var(--color-paper)', fontSize: '13px', fontWeight: 510, marginTop: '3px' }}>
          {currentPhaseTitle}
        </div>
        <div className="font-mono tab-num" style={{ fontSize: '12px', color: 'var(--color-fog)', marginTop: '6px' }}>
          {percent}% completed
        </div>
        <div className="linear-progress-bar" style={{ marginTop: '6px' }}>
          <div className="linear-progress-bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </aside>
  );
};
