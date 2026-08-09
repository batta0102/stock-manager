import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadows, spacing, typography } from '../theme/theme';

type StatTone = 'primary' | 'danger' | 'warning';

const TONES: Record<StatTone, { color: string; muted: string }> = {
  primary: { color: colors.primary, muted: colors.primaryMuted },
  danger: { color: colors.danger, muted: colors.dangerMuted },
  warning: { color: colors.warning, muted: colors.warningMuted },
};

interface StatCardProps {
  label: string;
  value: number;
  icon: ComponentProps<typeof Ionicons>['name'];
  tone?: StatTone;
  onPress?: () => void;
}

export default function StatCard({ label, value, icon, tone = 'primary', onPress }: StatCardProps) {
  const { color, muted } = TONES[tone];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.card, pressed && onPress ? styles.pressed : null]}
    >
      <View style={[styles.iconWrap, { backgroundColor: muted }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 108,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    justifyContent: 'center',
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
