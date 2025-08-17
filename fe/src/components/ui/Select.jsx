import React from 'react';
import { colors, typography, borderRadius, transitions } from '../../theme';

/**
 * Select component for dropdown selection
 * @param {Object} props - Component props
 * @param {Array} props.options - Array of options [{value, label}]
 * @param {string} [props.label] - Select label
 * @param {string} [props.value] - Selected value
 * @param {Function} [props.onChange] - Change handler
 * @param {boolean} [props.disabled=false] - Whether select is disabled
 * @param {boolean} [props.fullWidth=false] - Whether select should take full width
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {Object} [props.style] - Additional inline styles for container
 * @param {Object} [props.selectStyle] - Additional inline styles for select
 */
const Select = ({
  options = [],
  label,
  value,
  onChange,
  disabled = false,
  fullWidth = false,
  error,
  helperText,
  required = false,
  style = {},
  selectStyle = {},
  ...rest
}) => {
  // Container style
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  // Label style
  const labelStyle = {
    fontFamily: typography.fontFamily,
    fontSize: typography.body2.fontSize,
    fontWeight: typography.fontWeightMedium,
    color: error ? colors.error.main : colors.text.primary,
    marginBottom: '0.375rem',
  };

  // Select style
  const baseSelectStyle = {
    fontFamily: typography.fontFamily,
    fontSize: typography.body1.fontSize,
    color: colors.text.primary,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.medium,
    border: `1px solid ${error ? colors.error.main : colors.grey[300]}`,
    padding: '0.625rem 1rem',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(
      colors.text.secondary
    )}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    backgroundSize: '1em',
    transition: `all ${transitions.duration.shorter}ms ${transitions.easing.easeInOut}`,
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...selectStyle,
  };

  // Helper text style
  const helperTextStyle = {
    fontFamily: typography.fontFamily,
    fontSize: '0.75rem',
    color: error ? colors.error.main : colors.text.secondary,
    marginTop: '0.25rem',
  };

  // Focus and hover styles
  const focusStyle = {
    borderColor: colors.primary.main,
    boxShadow: `0 0 0 3px ${colors.primary.light}40`,
  };

  const hoverStyle = {
    borderColor: colors.grey[400],
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: colors.error.main }}> *</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={baseSelectStyle}
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
              e.currentTarget.style[key] = baseSelectStyle[key] || '';
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
              e.currentTarget.style[key] = baseSelectStyle[key] || '';
            });
          }
        }}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <div style={helperTextStyle}>{error || helperText}</div>
      )}
    </div>
  );
};

export default Select;