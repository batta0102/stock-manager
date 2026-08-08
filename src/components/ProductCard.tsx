import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getStockStatus, Product } from '../types/product';
import { colors, radii, spacing, typography } from '../theme/theme';
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
      <Text style={styles.category}>
        {product.category} · {product.reference}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.quantity}>
          Quantité : <Text style={styles.quantityValue}>{product.quantity}</Text>
        </Text>
        <Text style={styles.threshold}>Seuil : {product.alertThreshold}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 44,
  },
  cardPressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  category: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantity: {
    ...typography.body,
    color: colors.textMuted,
  },
  quantityValue: {
    color: colors.text,
    fontWeight: '600',
  },
  threshold: {
    ...typography.body,
    color: colors.textMuted,
  },
});
