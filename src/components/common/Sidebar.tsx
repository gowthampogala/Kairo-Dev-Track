import React, { useState, useEffect } from 'react';
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
  Network,
  Pin,
  PinOff,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateRoadmapProgress } from '../../services/progress';
import { PHASES, ROADMAP_BLOCKS } from '../../data/curriculum';
import { TOTAL_ACADEMY_LESSONS } from '../../data/springFrameworkCurriculum';
import { TOTAL_AI_TOPICS } from '../../data/aiEngineeringCurriculum';
import { TOTAL_NETWORK_TOPICS } from '../../data/networkFundamentalsCurriculum';
import {
  Sidebar as AceternitySidebar,
  SidebarBody,
  SidebarLink,
  useSidebar
} from '../ui/sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const {
    state,
    activePage,
    setActivePage,
    currentPosition,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useApp();

  const { percent } = calculateRoadmapProgress(state);

  // Dynamic progress counts
  const jsCompletedCount = Object.values(state.jsRoadmap || {}).filter(l => l?.completed).length;
  const springFrameworkCompletedCount = Object.values(state.springFrameworkRoadmap || {}).filter(l => l?.completed).length;
  const aiCompletedCount = Object.values(state.aiRoadmap || {}).filter(t => t?.completed).length;
  const networkCompletedCount = Object.values(state.networkRoadmap || {}).filter(t => t?.completed).length;

  const currentBlock = ROADMAP_BLOCKS[currentPosition.blockIndex];
  const currentPhaseTitle = PHASES[currentPosition.phaseIndex]?.title || 'Learning Roadmap';

  // Desktop Hover vs Pinned state persistence
  const [isPinned, setIsPinned] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kairo_sidebar_pinned') === 'true';
    } catch {
      return false;
    }
  });

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const isOpen = isPinned || isHovered;

  // Sync layout CSS variable with open state (pinned OR hovered)
  useEffect(() => {
    try {
      localStorage.setItem('kairo_sidebar_pinned', String(isPinned));
    } catch {
      // ignore
    }
    document.documentElement.style.setProperty(
      '--sidebar-current-width',
      isOpen ? '252px' : '64px'
    );
  }, [isPinned, isHovered, isOpen]);

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinned(!isPinned);
  };

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
    <>
      {/* ========================================================
          DESKTOP SIDEBAR (Aceternity UI Animated Rail + Flyout)
          ======================================================== */}
      <AceternitySidebar open={isOpen} setOpen={setIsHovered} animate={true}>
        <motion.aside
          className={cn(
            'kairo-aceternity-desktop hidden md:flex md:flex-col shrink-0',
            isOpen && 'is-open'
          )}
          animate={{
            width: isOpen ? '252px' : '64px',
          }}
          transition={{
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1],
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Top Brand Header */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--color-graphite)] min-h-[40px]">
            <div
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-2.5 cursor-pointer select-none overflow-hidden"
              style={{ padding: isOpen ? '2px 4px' : '2px 14px' }}
              title="KAIRO DEV TRACK"
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  background: 'var(--color-charcoal)',
                  border: '1px solid var(--color-graphite)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
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

              <motion.span
                animate={{
                  display: isOpen ? 'inline-block' : 'none',
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-[13px] tracking-tight text-[var(--color-paper)] whitespace-pre"
              >
                KAIRO DEV TRACK
              </motion.span>
            </div>

            {/* Desktop Pin/Unpin Toggle */}
            {isOpen && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={togglePin}
                title={isPinned ? 'Unpin sidebar (hover-to-expand)' : 'Pin sidebar permanently'}
                className="p-1 rounded text-[var(--color-fog)] hover:text-[var(--color-paper)] hover:bg-[var(--surface-hover)] border-0 bg-transparent cursor-pointer transition-colors"
                style={{ marginRight: '2px' }}
              >
                {isPinned ? <Pin size={14} className="text-[var(--color-brand)]" /> : <PinOff size={14} />}
              </motion.button>
            )}
          </div>

          {/* 11 Navigation Items */}
          <nav className="flex flex-col gap-1 flex-1 overflow-x-hidden overflow-y-auto pr-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <SidebarLink
                  key={item.id}
                  link={{
                    label: item.label,
                    icon: <Icon size={16} strokeWidth={1.8} />,
                    badge: item.badge,
                    active: isActive,
                    onClick: () => handleNavClick(item.id),
                  }}
                />
              );
            })}
          </nav>

          {/* Bottom Roadmap Progress Card */}
          <div className="pt-3 mt-2 border-t border-[var(--color-graphite)] overflow-hidden">
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18 }}
                className="sidebar-widget"
                style={{
                  border: '1px solid var(--color-graphite)',
                  borderRadius: 'var(--radius-buttons)',
                  padding: '10px 12px',
                  background: 'var(--color-obsidian)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div className="card-label" style={{ fontSize: '10.5px' }}>
                  Phase {currentPosition.phaseIndex + 1} · Week {currentPosition.week}
                </div>
                <div
                  style={{
                    color: 'var(--color-paper)',
                    fontSize: '12px',
                    fontWeight: 510,
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {currentPhaseTitle}
                </div>
                <div
                  className="font-mono tab-num"
                  style={{ fontSize: '11px', color: 'var(--color-fog)', marginTop: '4px' }}
                >
                  {percent}% completed
                </div>
                <div className="linear-progress-bar" style={{ marginTop: '5px', height: '3px' }}>
                  <div className="linear-progress-bar-fill" style={{ width: `${percent}%` }} />
                </div>
              </motion.div>
            ) : (
              <div
                title={`Phase ${currentPosition.phaseIndex + 1} (${percent}% completed)`}
                className="flex flex-col items-center justify-center py-2 px-1 rounded hover:bg-[var(--surface-hover)] cursor-pointer"
                onClick={() => setIsPinned(true)}
              >
                <span
                  className="font-mono tab-num text-[10px] font-semibold"
                  style={{ color: 'var(--color-brand)' }}
                >
                  {percent}%
                </span>
                <div
                  className="linear-progress-bar"
                  style={{ width: '32px', height: '2.5px', marginTop: '3px' }}
                >
                  <div className="linear-progress-bar-fill" style={{ width: `${percent}%` }} />
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      </AceternitySidebar>

      {/* ========================================================
          MOBILE SIDEBAR DRAWER (Aceternity UI Responsive Drawer)
          ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="kairo-aceternity-drawer fixed inset-y-0 left-0 w-[280px] max-w-[85vw] z-50 flex flex-col justify-between p-4 shadow-2xl md:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-graphite)]">
                  <div
                    className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => handleNavClick('overview')}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
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
                    <span className="font-semibold text-sm tracking-tight text-[var(--color-paper)]">
                      KAIRO DEV TRACK
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label="Close menu"
                    className="p-1.5 rounded-md text-[var(--color-fog)] hover:text-[var(--color-paper)] hover:bg-[var(--surface-hover)] border-0 bg-transparent cursor-pointer transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Mobile Navigation List */}
                <nav className="flex flex-col gap-1 py-4">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={cn(
                          'kairo-sidebar-link group flex items-center w-full px-3 py-2.5 rounded-[6px] border-0 text-left cursor-pointer transition-all relative',
                          isActive
                            ? 'active text-[var(--color-paper)] font-medium'
                            : 'text-[var(--color-mist)] hover:text-[var(--color-paper)] hover:bg-[var(--surface-hover)]'
                        )}
                        style={{
                          background: isActive ? 'var(--surface-active)' : 'transparent',
                        }}
                      >
                        {isActive && (
                          <span
                            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-[2px]"
                            style={{ background: 'var(--color-brand)' }}
                          />
                        )}
                        <span
                          className="mr-3"
                          style={{
                            color: isActive ? 'var(--color-paper)' : 'var(--color-fog)',
                          }}
                        >
                          <Icon size={17} strokeWidth={1.8} />
                        </span>
                        <span className="text-[13.5px] flex-1 font-[var(--font-inter)]">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className="font-mono text-[10.5px] px-2 py-0.5 rounded-[10px] border ml-auto"
                            style={{
                              background: isActive ? 'var(--color-brand-subtle)' : 'var(--color-charcoal)',
                              color: isActive ? 'var(--color-brand-text)' : 'var(--color-fog)',
                              borderColor: 'var(--color-graphite)',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Bottom Roadmap Widget */}
              <div
                className="sidebar-widget mt-4"
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
