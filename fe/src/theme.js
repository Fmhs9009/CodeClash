// theme.js - Enhanced consistent theme

export const colors = {
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#db2777',
    contrastText: '#FFFFFF'
  },
  background: {
    default: '#0f0f23',
    paper: '#1a1a2e',
    glass: 'rgba(255, 255, 255, 0.1)',
    dark: '#111827'
  },
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
    disabled: '#9CA3AF',
    hint: '#6B7280'
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626'
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706'
  },
  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb'
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669'
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px'
  },
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none'
  }
};

export const shadows = {
  small: '0 2px 8px rgba(0, 0, 0, 0.25)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.2)',
  large: '0 8px 32px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: {
    primary: '0 0 20px rgba(99, 102, 241, 0.5)',
    success: '0 0 20px rgba(16, 185, 129, 0.5)',
    error: '0 0 20px rgba(239, 68, 68, 0.5)'
  }
};

export const spacing = (factor) => `${0.25 * factor}rem`;

export const borderRadius = {
  small: '0.25rem',
  medium: '0.5rem',
  large: '1rem',
  full: '9999px'
};

export const transitions = {
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  },
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195
  }
};

// Common component styles
export const componentStyles = {
  button: {
    primary: {
      backgroundColor: colors.primary.main,
      color: colors.primary.contrastText,
      padding: '0.625rem 1.25rem',
      borderRadius: borderRadius.medium,
      fontWeight: typography.fontWeightMedium,
      boxShadow: shadows.small,
      transition: `all ${transitions.duration.shorter}ms ${transitions.easing.easeInOut}`,
      '&:hover': {
        backgroundColor: colors.primary.dark,
        boxShadow: shadows.medium
      }
    },
    secondary: {
      backgroundColor: colors.secondary.main,
      color: colors.secondary.contrastText,
      padding: '0.625rem 1.25rem',
      borderRadius: borderRadius.medium,
      fontWeight: typography.fontWeightMedium,
      boxShadow: shadows.small,
      transition: `all ${transitions.duration.shorter}ms ${transitions.easing.easeInOut}`,
      '&:hover': {
        backgroundColor: colors.secondary.dark,
        boxShadow: shadows.medium
      }
    },
    outlined: {
      backgroundColor: 'transparent',
      color: colors.primary.main,
      border: `1px solid ${colors.primary.main}`,
      padding: '0.625rem 1.25rem',
      borderRadius: borderRadius.medium,
      fontWeight: typography.fontWeightMedium,
      transition: `all ${transitions.duration.shorter}ms ${transitions.easing.easeInOut}`,
      '&:hover': {
        backgroundColor: colors.primary.light + '10',
        borderColor: colors.primary.dark
      }
    },
    text: {
      backgroundColor: 'transparent',
      color: colors.primary.main,
      padding: '0.625rem 1.25rem',
      borderRadius: borderRadius.medium,
      fontWeight: typography.fontWeightMedium,
      transition: `all ${transitions.duration.shorter}ms ${transitions.easing.easeInOut}`,
      '&:hover': {
        backgroundColor: colors.primary.light + '10'
      }
    }
  },
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.medium,
    boxShadow: shadows.medium,
    padding: spacing(4),
    transition: `all ${transitions.duration.standard}ms ${transitions.easing.easeInOut}`,
    '&:hover': {
      boxShadow: shadows.large
    }
  },
  input: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.medium,
    border: `1px solid ${colors.grey[300]}`,
    padding: '0.625rem 1rem',
    fontSize: typography.body1.fontSize,
    transition: `all ${transitions.duration.shorter}ms ${transitions.easing.easeInOut}`,
    '&:focus': {
      borderColor: colors.primary.main,
      boxShadow: `0 0 0 3px ${colors.primary.light}40`
    },
    '&:hover:not(:focus)': {
      borderColor: colors.grey[400]
    }
  },
  navbar: {
    backgroundColor: colors.background.paper,
    boxShadow: shadows.medium,
    padding: `${spacing(4)} ${spacing(6)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};

// Export default theme object
const theme = {
  colors,
  typography,
  shadows,
  spacing,
  borderRadius,
  transitions,
  componentStyles
};

export default theme;