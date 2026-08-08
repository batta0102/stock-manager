import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';

interface StatCardProps {
  label: string;
  value: number;
  accentColor?: string;
  onPress?: () => void;
}

export default function StatCard({ label, value, accentColor = colors.primary, onPress }: StatCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.card, pressed && onPress ? styles.pressed : null]}
    >
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 88,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
