import React from 'react';
import Input from './Input';
import { colors, typography } from '../../theme';

/**
 * TextField component with label and error message
 * @param {Object} props - Component props
 * @param {string} [props.label] - Input label
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {boolean} [props.fullWidth=true] - Whether field should take full width
 * @param {Object} [props.style] - Additional inline styles for container
 * @param {Object} [props.inputStyle] - Additional inline styles for input
 */
const TextField = ({
  label,
  error,
  helperText,
  required = false,
  fullWidth = true,
  style = {},
  inputStyle = {},
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

  // Helper text style
  const helperTextStyle = {
    fontFamily: typography.fontFamily,
    fontSize: '0.75rem',
    color: error ? colors.error.main : colors.text.secondary,
    marginTop: '0.25rem',
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: colors.error.main }}> *</span>}
        </label>
      )}
      <Input
        fullWidth
        style={{
          borderColor: error ? colors.error.main : undefined,
          ...inputStyle,
        }}
        {...rest}
      />
      {(error || helperText) && (
        <div style={helperTextStyle}>{error || helperText}</div>
      )}
    </div>
  );
};

export default TextField;