import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface HoverEffectItem {
  title: string;
  description: string;
  link?: string;
  tag?: string;
  onClick?: () => void;
}

export const HoverEffect = ({
  items,
  className,
}: {
  items: HoverEffectItem[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn('kairo-hover-grid', className)}>
      {items.map((item, idx) => {
        const isClickable = Boolean(item.link || item.onClick);
        const Tag = item.link ? 'a' : 'div';
        const interactiveProps = item.link
          ? {
              href: item.link,
              target: item.link.startsWith('http') ? '_blank' : undefined,
              rel: item.link.startsWith('http') ? 'noopener noreferrer' : undefined,
            }
          : item.onClick
          ? {
              onClick: item.onClick,
              role: 'button',
              tabIndex: 0,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  item.onClick?.();
                }
              },
            }
          : {};

        return (
          <Tag
            key={item.title + idx}
            {...(interactiveProps as any)}
            className={cn('kairo-hover-card-wrapper', isClickable && 'clickable')}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(idx)}
            onBlur={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="kairo-hover-glider"
                  layoutId={shouldReduceMotion ? undefined : 'hoverBackground'}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.15 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              {item.tag && <span className="kairo-hover-tag">{item.tag}</span>}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </Tag>
        );
      })}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn('kairo-hover-card', className)}>
      <div className="kairo-hover-card-inner">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <h4 className={cn('kairo-hover-title', className)}>{children}</h4>;
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <p className={cn('kairo-hover-desc', className)}>{children}</p>;
};
