import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadows, spacing, typography } from '../theme/theme';
import { getStockStatus, Product } from '../types/product';
import StatusBadge from './StatusBadge';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const status = getStockStatus(product);

  return (
    <Pressable
      onPress={() => onPress(product)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <StatusBadge status={status} />
      </View>
      <Text style={styles.meta} numberOfLines={1}>
        {product.category} · Réf. {product.reference}
      </Text>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <Text style={styles.metric}>
          <Text style={styles.metricValue}>{product.quantity}</Text> en stock
        </Text>
        <View style={styles.metricDot} />
        <Text style={styles.metric}>seuil {product.alertThreshold}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    minHeight: 44,
    ...shadows.sm,
  },
  cardPressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: spacing.sm,
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
    flex: 1,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metric: {
    ...typography.caption,
    color: colors.textMuted,
  },
  metricValue: {
    ...typography.captionBold,
    color: colors.text,
  },
  metricDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textFaint,
    marginHorizontal: spacing.sm,
  },
});
