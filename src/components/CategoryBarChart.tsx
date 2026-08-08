import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';

interface CategoryBarChartProps {
  data: { category: string; count: number }[];
}

export default function CategoryBarChart({ data }: CategoryBarChartProps) {
  const maxCount = Math.max(1, ...data.map((item) => item.count));

  return (
    <View>
      {data.map((item) => (
        <View key={item.category} style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>
            {item.category}
          </Text>
          <View style={styles.track}>
            <View style={[styles.bar, { width: `${(item.count / maxCount) * 100}%` }]} />
          </View>
          <Text style={styles.count}>{item.count}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.text,
    width: 96,
    marginRight: spacing.sm,
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
  },
  count: {
    ...typography.caption,
    color: colors.textMuted,
    width: 28,
    textAlign: 'right',
    marginLeft: spacing.sm,
  },
});
