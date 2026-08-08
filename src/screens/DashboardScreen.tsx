import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatCard from '../components/StatCard';
import { DashboardScreenProps } from '../navigation/types';
import { useProductStore } from '../store/productStore';
import { colors, spacing, typography } from '../theme/theme';
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tableau de bord</Text>
        <View style={styles.statsRow}>
          <StatCard
            label="Produits"
            value={stats.total}
            onPress={() => navigation.navigate('Products', { filter: 'all' })}
          />
          <StatCard
            label="Rupture"
            value={stats.outOfStock}
            accentColor={colors.danger}
            onPress={() => navigation.navigate('Products', { filter: 'out' })}
          />
          <StatCard
            label="Stock faible"
            value={stats.lowStock}
            accentColor={colors.warning}
            onPress={() => navigation.navigate('Products', { filter: 'low' })}
          />
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
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
