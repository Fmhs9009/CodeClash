// Modern theme configuration for CodeClash

export const colors = {
  primary: {
    main: '#4F46E5', // Indigo
    light: '#818CF8',
    dark: '#3730A3',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#10B981', // Emerald
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF'
  },
  background: {
    default: '#F9FAFB',
    paper: '#FFFFFF',
    dark: '#111827'
  },
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    disabled: '#9CA3AF',
    hint: '#6B7280'
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#B91C1C'
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706'
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB'
  },
  success: {
    main: '#10B981',
    light: '#34D399',
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
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
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
  small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
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