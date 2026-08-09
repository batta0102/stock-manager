import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryBarChart from '../components/CategoryBarChart';
import StatCard from '../components/StatCard';
import { DashboardScreenProps } from '../navigation/types';
import { useProductStore } from '../store/productStore';
import { colors, radii, shadows, spacing, typography } from '../theme/theme';
import { getStockStatus } from '../types/product';

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const products = useProductStore((state) => state.products);

  const stats = useMemo(() => {
    let outOfStock = 0;
    let lowStock = 0;
    for (const product of products) {
      const status = getStockStatus(product);
      if (status === 'out') outOfStock += 1;
      if (status === 'low') lowStock += 1;
    }
    return { total: products.length, outOfStock, lowStock };
  }, [products]);

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of products) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tableau de bord</Text>
        <Text style={styles.subtitle}>Vue d'ensemble de votre stock</Text>

        <View style={styles.statsRow}>
          <StatCard
            label="Produits"
            value={stats.total}
            icon="cube-outline"
            tone="primary"
            onPress={() => navigation.navigate('Products', { filter: 'all' })}
          />
          <StatCard
            label="Rupture"
            value={stats.outOfStock}
            icon="alert-circle-outline"
            tone="danger"
            onPress={() => navigation.navigate('Products', { filter: 'out' })}
          />
          <StatCard
            label="Stock faible"
            value={stats.lowStock}
            icon="trending-down-outline"
            tone="warning"
            onPress={() => navigation.navigate('Products', { filter: 'low' })}
          />
        </View>

        <Text style={styles.sectionTitle}>Répartition par catégorie</Text>
        <View style={styles.chartCard}>
          {categoryData.length > 0 ? (
            <CategoryBarChart data={categoryData} />
          ) : (
            <Text style={styles.emptyText}>Aucune donnée disponible.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  title: {
    ...typography.largeTitle,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
