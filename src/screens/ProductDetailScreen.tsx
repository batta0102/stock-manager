import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

export default function ProductDetailScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Détail produit</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
});
