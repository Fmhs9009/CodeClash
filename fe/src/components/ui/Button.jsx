import React from 'react';
import { colors, typography, borderRadius, shadows, transitions } from '../../theme';

/**
 * Button component with multiple variants
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, outlined, text)
 * @param {string} [props.size='medium'] - Button size (small, medium, large)
 * @param {boolean} [props.fullWidth=false] - Whether button should take full width
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.type='button'] - Button type attribute
 * @param {Object} [props.style] - Additional inline styles
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) => {
  // Base styles
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightMedium,
    borderRadius: borderRadius.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${transitions.duration.shorter}ms ${transitions.easing.easeInOut}`,
    border: 'none',
    outline: 'none',
    opacity: disabled ? 0.7 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  // Size styles
  const sizeStyles = {
    small: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
    },
    medium: {
      padding: '0.625rem 1.25rem',
      fontSize: '1rem',
    },
    large: {
      padding: '0.75rem 1.5rem',
      fontSize: '1.125rem',
    },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary.main,
      color: colors.primary.contrastText,
      boxShadow: shadows.small,
      '&:hover': {
        backgroundColor: colors.primary.dark,
        boxShadow: shadows.medium,
      },
    },
    secondary: {
      backgroundColor: colors.secondary.main,
      color: colors.secondary.contrastText,
      boxShadow: shadows.small,
      '&:hover': {
        backgroundColor: colors.secondary.dark,
        boxShadow: shadows.medium,
      },
    },
    outlined: {
      backgroundColor: 'transparent',
      color: colors.primary.main,
      border: `1px solid ${colors.primary.main}`,
      '&:hover': {
        backgroundColor: `${colors.primary.main}10`,
      },
    },
    text: {
      backgroundColor: 'transparent',
      color: colors.primary.main,
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: `${colors.primary.main}10`,
      },
    },
  };

  // Combine styles
  const buttonStyle = {
    ...baseStyle,
    ...sizeStyles[size],
    backgroundColor: variantStyles[variant]?.backgroundColor || 'transparent',
    color: variantStyles[variant]?.color || colors.text.primary,
    boxShadow: variantStyles[variant]?.boxShadow || 'none',
    border: variantStyles[variant]?.border || 'none',
    ...style,
  };

  // Hover effect
  const hoverStyle = disabled ? {} : variantStyles[variant]?.['&:hover'] || {};

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseOver={(e) => {
        if (!disabled && hoverStyle) {
          Object.entries(hoverStyle).forEach(([key, value]) => {
            e.currentTarget.style[key] = value;
          });
        }
      }}
      onMouseOut={(e) => {
        if (!disabled && hoverStyle) {
          Object.entries(hoverStyle).forEach(([key]) => {
            e.currentTarget.style[key] = buttonStyle[key] || '';
          });
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;