import React from 'react';

/**
 * Container component for layout with responsive width
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} [props.maxWidth='lg'] - Maximum width (sm, md, lg, xl, none)
 * @param {boolean} [props.disableGutters=false] - Whether to disable side padding
 * @param {Object} [props.style] - Additional inline styles
 */
const Container = ({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  style = {},
  ...rest
}) => {
  // Max width values
  const maxWidthValues = {
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
    none: 'none',
  };

  // Container style
  const containerStyle = {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
    paddingLeft: disableGutters ? 0 : '1rem',
    paddingRight: disableGutters ? 0 : '1rem',
    maxWidth: maxWidthValues[maxWidth] || maxWidth,
    ...style,
  };

  return (
    <div style={containerStyle} {...rest}>
      {children}
    </div>
  );
};

export default Container;