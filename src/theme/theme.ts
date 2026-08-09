export const colors = {
  background: '#F7F7F9',
  surface: '#FFFFFF',
  surfaceAlt: '#EFF0F4',
  border: '#EBECF0',
  text: '#13151A',
  textMuted: '#83879C',
  textFaint: '#B3B6C0',
  primary: '#4F46E5',
  primaryDark: '#4038C7',
  primaryMuted: '#EEEDFC',
  success: '#15A163',
  successMuted: '#E6F8EE',
  warning: '#D3860A',
  warningMuted: '#FCF1DD',
  danger: '#DC3B3B',
  dangerMuted: '#FCE9E9',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 17, 23, 0.45)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
};

export const typography = {
  largeTitle: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.4 },
  title: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.2 },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 21 },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  captionBold: { fontSize: 13, fontWeight: '600' as const },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.5 },
};

export const shadows = {
  sm: {
    shadowColor: '#0F1117',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F1117',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const touchTarget = {
  minSize: 44,
};
