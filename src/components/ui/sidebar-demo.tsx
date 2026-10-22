import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
  LayoutGrid,
  CheckSquare,
  FileCode,
  Server,
  Sparkles,
  Network,
  Map,
  Folder,
  SlidersHorizontal,
  FileText,
  Settings,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Overview');

  const links = [
    { label: 'Overview', icon: <LayoutGrid size={16} /> },
    { label: 'Daily Checklist', icon: <CheckSquare size={16} /> },
    { label: 'JS Roadmap', icon: <FileCode size={16} />, badge: '12/41' },
    { label: 'Spring Framework', icon: <Server size={16} />, badge: '8/34' },
    { label: 'AI Engineering', icon: <Sparkles size={16} />, badge: '5/20' },
    { label: 'Network Fundamentals', icon: <Network size={16} />, badge: '15/50' },
    { label: '20-Week Roadmap', icon: <Map size={16} /> },
    { label: 'Projects', icon: <Folder size={16} /> },
    { label: 'Manage Workspace', icon: <SlidersHorizontal size={16} /> },
    { label: 'Weekly Reviews', icon: <FileText size={16} /> },
    { label: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-xl border border-[var(--color-graphite)] bg-[var(--color-carbon)] md:flex-row',
        'h-[550px]'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-6 p-3">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-6 flex flex-col gap-1">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    ...link,
                    active: activeItem === link.label,
                    onClick: () => setActiveItem(link.label),
                  }}
                />
              ))}
            </div>
          </div>
          <div className="p-2 border-t border-[var(--color-graphite)]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--color-brand)] text-[var(--color-brand-contrast)] flex items-center justify-center text-xs font-bold">
                K
              </div>
              {open && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-[var(--color-paper)] font-medium"
                >
                  KAIRO Student
                </motion.div>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 p-6 flex-col gap-4 overflow-y-auto">
        <h3 className="text-lg font-medium text-[var(--color-paper)]">
          {activeItem} View (Demo Canvas)
        </h3>
        <p className="text-xs text-[var(--color-fog)]">
          Hover over the sidebar on the left to see the smooth expanding interaction.
        </p>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <div className="flex items-center gap-2.5 py-1 px-1">
      <div className="w-4 h-4 rounded bg-[var(--color-charcoal)] border border-[var(--color-graphite)] flex items-center justify-center shrink-0">
        <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[var(--color-brand)] shadow-[0_0_6px_rgba(228,242,34,0.6)]" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-xs tracking-tight text-[var(--color-paper)] whitespace-pre"
      >
        KAIRO DEV TRACK
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="w-4 h-4 rounded bg-[var(--color-charcoal)] border border-[var(--color-graphite)] flex items-center justify-center shrink-0">
        <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[var(--color-brand)] shadow-[0_0_6px_rgba(228,242,34,0.6)]" />
      </div>
    </div>
  );
};
