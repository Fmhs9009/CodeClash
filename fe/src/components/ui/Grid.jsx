import React from 'react';

/**
 * Grid component for responsive layouts
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Grid content
 * @param {string} [props.container=false] - Whether this is a container grid
 * @param {string} [props.item=false] - Whether this is an item grid
 * @param {number} [props.spacing=0] - Grid spacing (0-10)
 * @param {number} [props.xs] - Grid size for extra small screens
 * @param {number} [props.sm] - Grid size for small screens
 * @param {number} [props.md] - Grid size for medium screens
 * @param {number} [props.lg] - Grid size for large screens
 * @param {number} [props.xl] - Grid size for extra large screens
 * @param {string} [props.justifyContent='flex-start'] - Justify content value
 * @param {string} [props.alignItems='stretch'] - Align items value
 * @param {Object} [props.style] - Additional inline styles
 */
const Grid = ({
  children,
  container = false,
  item = false,
  spacing = 0,
  xs,
  sm,
  md,
  lg,
  xl,
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  style = {},
  ...rest
}) => {
  // Calculate spacing in rem
  const spacingValue = spacing * 0.25; // 0.25rem per spacing unit

  // Container style
  const containerStyle = container
    ? {
        display: 'flex',
        flexWrap: 'wrap',
        boxSizing: 'border-box',
        margin: `-${spacingValue}rem`,
        width: `calc(100% + ${spacingValue * 2}rem)`,
        justifyContent,
        alignItems,
      }
    : {};

  // Item style
  const itemStyle = item
    ? {
        boxSizing: 'border-box',
        padding: `${spacingValue}rem`,
      }
    : {};

  // Responsive width calculation
  const getResponsiveWidth = (value) => {
    if (!value) return undefined;
    return `${(value / 12) * 100}%`;
  };

  // Media queries for responsive design
  const responsiveStyle = {
    flexBasis: getResponsiveWidth(xs),
    maxWidth: getResponsiveWidth(xs),
    '@media (min-width: 600px)': sm
      ? {
          flexBasis: getResponsiveWidth(sm),
          maxWidth: getResponsiveWidth(sm),
        }
      : {},
    '@media (min-width: 900px)': md
      ? {
          flexBasis: getResponsiveWidth(md),
          maxWidth: getResponsiveWidth(md),
        }
      : {},
    '@media (min-width: 1200px)': lg
      ? {
          flexBasis: getResponsiveWidth(lg),
          maxWidth: getResponsiveWidth(lg),
        }
      : {},
    '@media (min-width: 1536px)': xl
      ? {
          flexBasis: getResponsiveWidth(xl),
          maxWidth: getResponsiveWidth(xl),
        }
      : {},
  };

  // Since we can't use actual media queries with inline styles,
  // we'll implement a basic responsive approach using window.matchMedia in a useEffect
  const [breakpoint, setBreakpoint] = React.useState(getInitialBreakpoint());

  // Get initial breakpoint based on window width
  function getInitialBreakpoint() {
    if (typeof window === 'undefined') return 'xs';
    const width = window.innerWidth;
    if (width >= 1536) return 'xl';
    if (width >= 1200) return 'lg';
    if (width >= 900) return 'md';
    if (width >= 600) return 'sm';
    return 'xs';
  }

  // Update breakpoint on window resize
  React.useEffect(() => {
    function handleResize() {
      setBreakpoint(getInitialBreakpoint());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get width based on current breakpoint
  const getWidthForBreakpoint = () => {
    if (breakpoint === 'xl' && xl) return getResponsiveWidth(xl);
    if ((breakpoint === 'xl' || breakpoint === 'lg') && lg) return getResponsiveWidth(lg);
    if ((breakpoint === 'xl' || breakpoint === 'lg' || breakpoint === 'md') && md)
      return getResponsiveWidth(md);
    if ((breakpoint === 'xl' || breakpoint === 'lg' || breakpoint === 'md' || breakpoint === 'sm') && sm)
      return getResponsiveWidth(sm);
    if (xs) return getResponsiveWidth(xs);
    return undefined;
  };

  // Combine styles
  const gridStyle = {
    ...containerStyle,
    ...itemStyle,
    flexBasis: getWidthForBreakpoint(),
    maxWidth: getWidthForBreakpoint(),
    ...style,
  };

  return (
    <div style={gridStyle} {...rest}>
      {children}
    </div>
  );
};

export default Grid;