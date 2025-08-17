import React from 'react';
import { colors, typography, borderRadius, transitions } from '../../theme';

/**
 * Input component for text entry
 * @param {Object} props - Component props
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChange] - Change handler
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {boolean} [props.fullWidth=false] - Whether input should take full width
 * @param {boolean} [props.multiline=false] - Whether to render as textarea
 * @param {React.Ref} [props.inputRef] - Ref to the input/textarea element
 * @param {Object} [props.style] - Additional inline styles
 */
const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  fullWidth = false,
  style = {},
  inputRef,
  multiline,
  ...rest
}) => {
  // Base styles
  const baseStyle = {
    fontFamily: typography.fontFamily,
    fontSize: typography.body1.fontSize,
    color: colors.text.primary,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.medium,
    border: `1px solid ${colors.grey[300]}`,
    padding: '0.625rem 1rem',
    width: fullWidth ? '100%' : 'auto',
    boxSizing: 'border-box',
    outline: 'none',
    transition: `all ${transitions.duration.shorter}ms ${transitions.easing.easeInOut}`,
    opacity: disabled ? 0.7 : 1,
  };

  // Focus and hover styles
  const focusStyle = {
    borderColor: colors.primary.main,
    boxShadow: `0 0 0 3px ${colors.primary.light}40`,
  };

  const hoverStyle = {
    borderColor: colors.grey[400],
  };

  // Combine styles
  const inputStyle = {
    ...baseStyle,
    ...style,
  };

  // If multiline is true, render textarea instead of input
  if (multiline) {
    return (
      <textarea
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          ...inputStyle,
          resize: 'vertical',
          minHeight: '100px',
        }}
        onFocus={(e) => {
          if (!disabled) {
            Object.entries(focusStyle).forEach(([key, value]) => {
              e.currentTarget.style[key] = value;
            });
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            Object.entries(focusStyle).forEach(([key]) => {
              e.currentTarget.style[key] = inputStyle[key] || '';
            });
          }
        }}
        onMouseOver={(e) => {
          if (!disabled && !e.currentTarget.matches(':focus')) {
            Object.entries(hoverStyle).forEach(([key, value]) => {
              e.currentTarget.style[key] = value;
            });
          }
        }}
        onMouseOut={(e) => {
          if (!disabled && !e.currentTarget.matches(':focus')) {
            Object.entries(hoverStyle).forEach(([key]) => {
              e.currentTarget.style[key] = inputStyle[key] || '';
            });
          }
        }}
        {...rest}
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={inputStyle}
      onFocus={(e) => {
        if (!disabled) {
          Object.entries(focusStyle).forEach(([key, value]) => {
            e.currentTarget.style[key] = value;
          });
        }
      }}
      onBlur={(e) => {
        if (!disabled) {
          Object.entries(focusStyle).forEach(([key]) => {
            e.currentTarget.style[key] = inputStyle[key] || '';
          });
        }
      }}
      onMouseOver={(e) => {
        if (!disabled && !e.currentTarget.matches(':focus')) {
          Object.entries(hoverStyle).forEach(([key, value]) => {
            e.currentTarget.style[key] = value;
          });
        }
      }}
      onMouseOut={(e) => {
        if (!disabled && !e.currentTarget.matches(':focus')) {
          Object.entries(hoverStyle).forEach(([key]) => {
            e.currentTarget.style[key] = inputStyle[key] || '';
          });
        }
      }}
      {...rest}
    />
  );
};

export default Input;