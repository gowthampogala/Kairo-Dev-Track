import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface InteractiveHoverButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  id?: string;
}

/**
 * InteractiveHoverButton
 *
 * Default : yellow-lime (#DFFF00) background, dark text, right arrow.
 * Hover   : dark circle expands from the left side; label + arrow flip
 *           to yellow-lime. Arrow slides 3 px to the right.
 *
 * All styles live in theme.css (.kairo-ihb, .kairo-ihb__dot, etc.)
 * so they are loaded once and not injected on every render.
 */
export const InteractiveHoverButton: React.FC<InteractiveHoverButtonProps> = ({
  label,
  onClick,
  disabled = false,
  id,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      id={id}
      type="button"
      className={`kairo-ihb${hovered ? ' is-hovered' : ''}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Expanding dark circle */}
      <span className="kairo-ihb__dot" aria-hidden="true" />

      {/* Label + sliding arrow — sit above the dot */}
      <span className="kairo-ihb__content">
        <span>{label}</span>
        <span className="kairo-ihb__arrow">
          <ArrowRight size={12} strokeWidth={2.5} />
        </span>
      </span>
    </button>
  );
};

export default InteractiveHoverButton;
