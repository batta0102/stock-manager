import { useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBadge from '../components/StatusBadge';
import StockMovementModal from '../components/StockMovementModal';
import { ProductDetailScreenProps } from '../navigation/types';
import { useProductStore } from '../store/productStore';
import { colors, radii, spacing, typography } from '../theme/theme';
import { getStockStatus } from '../types/product';
import { formatDateTime } from '../utils/formatDate';

export default function ProductDetailScreen({ route, navigation }: ProductDetailScreenProps) {
  const { productId } = route.params;
  const product = useProductStore((state) => state.products.find((p) => p.id === productId));
  const removeProduct = useProductStore((state) => state.removeProduct);
  const stockIn = useProductStore((state) => state.stockIn);
  const stockOut = useProductStore((state) => state.stockOut);
  const [movementDirection, setMovementDirection] = useState<'in' | 'out' | null>(null);

  useLayoutEffect(() => {
    if (product) {
      navigation.setOptions({ title: product.name });
    }
  }, [navigation, product]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Text style={styles.missingText}>Produit introuvable.</Text>
      </SafeAreaView>
    );
  }

  const status = getStockStatus(product);

  const handleDelete = () => {
    removeProduct(product.id);
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('ProductForm', { productId: product.id });
  };

  const handleConfirmMovement = (amount: number) => {
    if (movementDirection === 'in') {
      stockIn(product.id, amount);
    } else if (movementDirection === 'out') {
      stockOut(product.id, amount);
    }
    setMovementDirection(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{product.name}</Text>
          <StatusBadge status={status} />
        </View>
        <Text style={styles.category}>{product.category}</Text>

        <View style={styles.card}>
          <InfoRow label="Référence" value={product.reference} />
          <InfoRow label="Description" value={product.description || 'Aucune description'} />
          <InfoRow label="Quantité" value={String(product.quantity)} />
          <InfoRow label="Seuil d'alerte" value={String(product.alertThreshold)} />
          <InfoRow label="Dernière mise à jour" value={formatDateTime(product.updatedAt)} last />
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => setMovementDirection('in')}
            style={({ pressed }) => [styles.actionButton, styles.stockInButton, pressed && styles.pressed]}
          >
            <Text style={styles.stockInButtonText}>Entrée (+)</Text>
          </Pressable>
          <Pressable
            onPress={() => setMovementDirection('out')}
            style={({ pressed }) => [styles.actionButton, styles.stockOutButton, pressed && styles.pressed]}
          >
            <Text style={styles.stockOutButtonText}>Sortie (−)</Text>
          </Pressable>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleEdit}
            style={({ pressed }) => [styles.actionButton, styles.editButton, pressed && styles.pressed]}
          >
            <Text style={styles.editButtonText}>Modifier</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && styles.pressed]}
          >
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </Pressable>
        </View>
      </ScrollView>
      <StockMovementModal
        visible={movementDirection !== null}
        direction={movementDirection ?? 'in'}
        onClose={() => setMovementDirection(null)}
        onConfirm={handleConfirmMovement}
      />
    </SafeAreaView>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  missingText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.title,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  category: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.bodyBold,
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  editButton: {
    backgroundColor: colors.primaryMuted,
  },
  editButtonText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.dangerMuted,
  },
  deleteButtonText: {
    ...typography.bodyBold,
    color: colors.danger,
  },
  stockInButton: {
    backgroundColor: colors.successMuted,
  },
  stockInButtonText: {
    ...typography.bodyBold,
    color: colors.success,
  },
  stockOutButton: {
    backgroundColor: colors.warningMuted,
  },
  stockOutButtonText: {
    ...typography.bodyBold,
    color: colors.warning,
  },
});
