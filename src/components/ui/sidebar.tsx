import React, { useState, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarLinkItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.aside
      className={cn(
        'kairo-aceternity-desktop hidden md:flex md:flex-col shrink-0 sticky top-0 h-screen overflow-hidden',
        className
      )}
      animate={{
        width: animate ? (open ? '252px' : '64px') : '252px',
      }}
      transition={{
        duration: 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.aside>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        'kairo-aceternity-mobile md:hidden fixed top-0 left-0 right-0 h-[50px] z-40 flex items-center justify-between px-4',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#e4f222] shadow-[0_0_6px_rgba(228,242,34,0.6)]" />
        </div>
        <span className="font-semibold text-xs tracking-tight text-[var(--color-paper)]">
          KAIRO DEV TRACK
        </span>
      </div>

      <button
        type="button"
        aria-label="Toggle menu"
        className="p-1.5 rounded-md text-[var(--color-paper)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer border-0 bg-transparent"
        onClick={() => setOpen(!open)}
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="kairo-aceternity-drawer fixed inset-y-0 left-0 w-[280px] max-w-[85vw] z-50 flex flex-col justify-between p-4 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-graphite)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded bg-[var(--color-charcoal)] border border-[var(--color-graphite)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[var(--color-brand)] shadow-[0_0_6px_rgba(228,242,34,0.6)]" />
                  </div>
                  <span className="font-semibold text-sm tracking-tight text-[var(--color-paper)]">
                    KAIRO DEV TRACK
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="p-1.5 rounded-md text-[var(--color-fog)] hover:text-[var(--color-paper)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer border-0 bg-transparent"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-6 py-4">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: SidebarLinkItem;
  className?: string;
} & React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>) => {
  const { open, animate, setOpen } = useSidebar();
  const isActive = Boolean(link.active);

  const handleClick = (e: React.MouseEvent) => {
    link.onClick?.();
    // Close drawer on mobile upon selection
    if (window.innerWidth < 860) {
      setOpen(false);
    }
  };

  const Tag = link.href ? 'a' : 'button';

  const baseColor = isActive ? 'var(--color-paper)' : 'var(--color-mist)';

  return (
    <Tag
      {...(link.href ? { href: link.href } : { type: 'button' })}
      onClick={handleClick}
      title={!open ? link.label : undefined}
      className={cn(
        'kairo-sidebar-link group flex items-center w-full transition-all relative rounded-[6px] border-0 cursor-pointer text-left',
        isActive ? 'active' : '',
        className
      )}
      style={{
        padding: open ? '8px 10px' : '8px 0',
        justifyContent: open ? 'flex-start' : 'center',
        background: isActive ? 'var(--surface-active)' : 'transparent',
        color: baseColor,
      }}
      {...(props as any)}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: '6px',
            bottom: '6px',
            width: '2.5px',
            borderRadius: '0 2px 2px 0',
            background: 'var(--color-brand)',
          }}
        />
      )}

      {/* Icon */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: open ? '20px' : '100%',
          color: isActive ? 'var(--color-paper)' : 'var(--color-fog)',
          transition: 'color 0.12s ease',
        }}
      >
        {link.icon}
      </span>

      {/* Animated Label */}
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15 }}
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '13px',
          whiteSpace: 'pre',
          display: 'inline-block',
          marginLeft: '10px',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontWeight: isActive ? 510 : 400,
          color: isActive ? 'var(--color-paper)' : 'var(--color-mist)',
        }}
      >
        {link.label}
      </motion.span>

      {/* Progress Badge */}
      {link.badge && (
        <motion.span
          animate={{
            display: animate ? (open ? 'inline-flex' : 'none') : 'inline-flex',
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          transition={{ duration: 0.15 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '10px',
            flexShrink: 0,
            marginLeft: 'auto',
            border: '1px solid var(--color-graphite)',
            background: isActive ? 'var(--color-brand-subtle)' : 'var(--color-charcoal)',
            color: isActive ? 'var(--color-brand-text)' : 'var(--color-fog)',
          }}
        >
          {link.badge}
        </motion.span>
      )}
    </Tag>
  );
};
