import React from 'react';
import { colors, borderRadius, shadows, transitions } from '../../theme';

/**
 * Card component for containing content with elevation and styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.variant='default'] - Card variant (default, outlined, elevated)
 * @param {boolean} [props.hoverable=false] - Whether card has hover effect
 * @param {Object} [props.style] - Additional inline styles
 * @param {Function} [props.onClick] - Click handler
 */
const Card = ({
  children,
  variant = 'default',
  hoverable = false,
  style = {},
  onClick,
  ...rest
}) => {
  // Base styles
  const baseStyle = {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.medium,
    padding: '1.5rem',
    transition: `all ${transitions.duration.standard}ms ${transitions.easing.easeInOut}`,
    width: '100%',
    boxSizing: 'border-box',
  };

  // Variant styles
  const variantStyles = {
    default: {
      boxShadow: shadows.medium,
      borderWidth: '0px',
      borderStyle: 'none',
      borderColor: 'transparent',
    },
    outlined: {
      boxShadow: 'none',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.grey[300],
    },
    elevated: {
      boxShadow: shadows.large,
      borderWidth: '0px',
      borderStyle: 'none',
      borderColor: 'transparent',
    },
  };

  // Hover effect
  const hoverStyle = hoverable
    ? {
        transform: 'translateY(-4px)',
        boxShadow: shadows.xl,
      }
    : {};

  // Combine styles
  const cardStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseOver={(e) => {
        if (hoverable) {
          Object.entries(hoverStyle).forEach(([key, value]) => {
            e.currentTarget.style[key] = value;
          });
        }
      }}
      onMouseOut={(e) => {
        if (hoverable) {
          Object.entries(hoverStyle).forEach(([key]) => {
            e.currentTarget.style[key] = cardStyle[key] || '';
          });
        }
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;