import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryChips from '../components/CategoryChips';
import ProductCard from '../components/ProductCard';
import { ProductsScreenProps } from '../navigation/types';
import { useProductStore } from '../store/productStore';
import { colors, radii, spacing, typography } from '../theme/theme';
import { getStockStatus, Product } from '../types/product';
import { useDebouncedValue } from '../utils/useDebouncedValue';

const STOCK_FILTER_LABELS: Record<'low' | 'out', string> = {
  low: 'Stock faible',
  out: 'Rupture de stock',
};

export default function ProductListScreen({ navigation, route }: ProductsScreenProps) {
  const products = useProductStore((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<'low' | 'out' | null>(null);
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    const filter = route.params?.filter;
    if (filter === 'low' || filter === 'out') {
      setStockFilter(filter);
    } else if (filter === 'all') {
      setStockFilter(null);
    }
  }, [route.params?.filter]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesStock = !stockFilter || getStockStatus(product) === stockFilter;
      const matchesQuery =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.reference.toLowerCase().includes(query);
      return matchesCategory && matchesStock && matchesQuery;
    });
  }, [products, debouncedQuery, selectedCategory, stockFilter]);

  const handlePressProduct = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation]
  );

  const handlePressAdd = useCallback(() => {
    navigation.navigate('ProductForm', undefined);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Produits</Text>
        <Pressable
          onPress={handlePressAdd}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          hitSlop={8}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </Pressable>
      </View>
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher par nom ou référence"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          autoCorrect={false}
        />
      </View>
      <CategoryChips categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      {stockFilter && (
        <View style={styles.filterBanner}>
          <Text style={styles.filterBannerText}>Filtre : {STOCK_FILTER_LABELS[stockFilter]}</Text>
          <Pressable
            onPress={() => setStockFilter(null)}
            style={styles.filterBannerClearButton}
            hitSlop={8}
          >
            <Text style={styles.filterBannerClear}>Réinitialiser</Text>
          </Pressable>
        </View>
      )}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} onPress={handlePressProduct} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {products.length === 0 ? 'Aucun produit pour le moment.' : 'Aucun résultat pour ces filtres.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    height: '100%',
  },
  filterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
  },
  filterBannerText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  filterBannerClearButton: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBannerClear: {
    ...typography.bodyBold,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  empty: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
