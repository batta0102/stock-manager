import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';
import { StockStatus } from '../types/product';

const STATUS_CONFIG: Record<StockStatus, { label: string; dot: string; background: string; text: string }> = {
  ok: { label: 'En stock', dot: colors.success, background: colors.successMuted, text: colors.success },
  low: { label: 'Stock faible', dot: colors.warning, background: colors.warningMuted, text: colors.warning },
  out: { label: 'Rupture', dot: colors.danger, background: colors.dangerMuted, text: colors.danger },
};

interface StatusBadgeProps {
  status: StockStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.container, { backgroundColor: config.background }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    ...typography.label,
    textTransform: 'uppercase',
  },
});
