import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBadge from '../components/StatusBadge';
import StockMovementModal from '../components/StockMovementModal';
import { ProductDetailScreenProps } from '../navigation/types';
import { useProductStore } from '../store/productStore';
import { colors, radii, shadows, spacing, typography } from '../theme/theme';
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
    Alert.alert('Supprimer le produit', `Supprimer "${product.name}" ? Cette action est irréversible.`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          removeProduct(product.id);
          navigation.goBack();
        },
      },
    ]);
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

        <Text style={styles.sectionLabel}>Mouvement de stock</Text>
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => setMovementDirection('in')}
            style={({ pressed }) => [styles.filledButton, styles.stockInButton, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-up-circle-outline" size={18} color={colors.success} />
            <Text style={[styles.filledButtonText, { color: colors.success }]}>Entrée</Text>
          </Pressable>
          <Pressable
            onPress={() => setMovementDirection('out')}
            style={({ pressed }) => [styles.filledButton, styles.stockOutButton, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-down-circle-outline" size={18} color={colors.danger} />
            <Text style={[styles.filledButtonText, { color: colors.danger }]}>Sortie</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Gestion</Text>
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleEdit}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            <Ionicons name="create-outline" size={16} color={colors.textMuted} />
            <Text style={styles.outlineButtonText}>Modifier</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={[styles.outlineButtonText, { color: colors.danger }]}>Supprimer</Text>
          </Pressable>
        </View>
      </ScrollView>
      <StockMovementModal
        visible={movementDirection !== null}
        direction={movementDirection ?? 'in'}
        currentQuantity={product.quantity}
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
    gap: spacing.sm,
  },
  name: {
    ...typography.title,
    color: colors.text,
    flex: 1,
  },
  category: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  sectionLabel: {
    ...typography.label,
    textTransform: 'uppercase',
    color: colors.textFaint,
    marginBottom: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  pressed: {
    opacity: 0.75,
  },
  filledButton: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledButtonText: {
    ...typography.bodyBold,
  },
  stockInButton: {
    backgroundColor: colors.successMuted,
  },
  stockOutButton: {
    backgroundColor: colors.dangerMuted,
  },
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 44,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
});
