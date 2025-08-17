import React from 'react';
import { colors, typography as themeTypography } from '../../theme';

/**
 * Typography component for consistent text styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text content
 * @param {string} [props.variant='body1'] - Typography variant (h1-h6, body1, body2, subtitle1, subtitle2, caption)
 * @param {string} [props.color='primary'] - Text color (primary, secondary, error, warning, info, success)
 * @param {string} [props.align='left'] - Text alignment
 * @param {boolean} [props.gutterBottom=false] - Whether to add bottom margin
 * @param {Object} [props.style] - Additional inline styles
 */
const Typography = ({
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  gutterBottom = false,
  style = {},
  ...rest
}) => {
  // Map variant to HTML element
  const variantMapping = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'span',
  };

  // Variant styles
  const variantStyles = {
    h1: {
      fontSize: themeTypography.h1.fontSize,
      fontWeight: themeTypography.h1.fontWeight,
      lineHeight: themeTypography.h1.lineHeight,
      marginBottom: '0.5em',
    },
    h2: {
      fontSize: themeTypography.h2.fontSize,
      fontWeight: themeTypography.h2.fontWeight,
      lineHeight: themeTypography.h2.lineHeight,
      marginBottom: '0.5em',
    },
    h3: {
      fontSize: themeTypography.h3.fontSize,
      fontWeight: themeTypography.h3.fontWeight,
      lineHeight: themeTypography.h3.lineHeight,
      marginBottom: '0.5em',
    },
    h4: {
      fontSize: themeTypography.h4.fontSize,
      fontWeight: themeTypography.h4.fontWeight,
      lineHeight: themeTypography.h4.lineHeight,
      marginBottom: '0.5em',
    },
    h5: {
      fontSize: themeTypography.h5.fontSize,
      fontWeight: themeTypography.h5.fontWeight,
      lineHeight: themeTypography.h5.lineHeight,
      marginBottom: '0.5em',
    },
    h6: {
      fontSize: themeTypography.h6.fontSize,
      fontWeight: themeTypography.h6.fontWeight,
      lineHeight: themeTypography.h6.lineHeight,
      marginBottom: '0.5em',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: themeTypography.fontWeightMedium,
      lineHeight: 1.4,
      marginBottom: '0.35em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: themeTypography.fontWeightMedium,
      lineHeight: 1.4,
      marginBottom: '0.35em',
    },
    body1: {
      fontSize: themeTypography.body1.fontSize,
      fontWeight: themeTypography.fontWeightRegular,
      lineHeight: themeTypography.body1.lineHeight,
      marginBottom: '0.35em',
    },
    body2: {
      fontSize: themeTypography.body2.fontSize,
      fontWeight: themeTypography.fontWeightRegular,
      lineHeight: themeTypography.body2.lineHeight,
      marginBottom: '0.35em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: themeTypography.fontWeightRegular,
      lineHeight: 1.4,
      marginBottom: '0.35em',
    },
  };

  // Color styles
  const colorStyles = {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    error: colors.error.main,
    warning: colors.warning.main,
    info: colors.info.main,
    success: colors.success.main,
  };

  // Combine styles
  const textStyle = {
    fontFamily: themeTypography.fontFamily,
    margin: 0,
    marginBottom: gutterBottom ? (variantStyles[variant].marginBottom || '0.35em') : 0,
    textAlign: align,
    color: colorStyles[color] || color, // Allow custom color strings
    ...variantStyles[variant],
    ...style,
  };

  const Component = variantMapping[variant] || 'p';

  return (
    <Component style={textStyle} {...rest}>
      {children}
    </Component>
  );
};

export default Typography;