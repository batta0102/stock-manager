import { useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../components/FormField';
import { ProductFormScreenProps } from '../navigation/types';
import { isReferenceTaken } from '../services/productService';
import { useProductStore } from '../store/productStore';
import { colors, radii, spacing, typography } from '../theme/theme';

type FormErrors = Partial<Record<'name' | 'reference' | 'category' | 'quantity' | 'alertThreshold', string>>;

export default function ProductFormScreen({ navigation, route }: ProductFormScreenProps) {
  const editingId = route.params?.productId;
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const editProduct = useProductStore((state) => state.editProduct);
  const editingProduct = editingId ? products.find((p) => p.id === editingId) : undefined;

  const [name, setName] = useState(editingProduct?.name ?? '');
  const [reference, setReference] = useState(editingProduct?.reference ?? '');
  const [description, setDescription] = useState(editingProduct?.description ?? '');
  const [category, setCategory] = useState(editingProduct?.category ?? '');
  const [quantity, setQuantity] = useState(editingProduct ? String(editingProduct.quantity) : '');
  const [alertThreshold, setAlertThreshold] = useState(
    editingProduct ? String(editingProduct.alertThreshold) : ''
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useLayoutEffect(() => {
    navigation.setOptions({ title: editingProduct ? 'Modifier le produit' : 'Nouveau produit' });
  }, [navigation, editingProduct]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) nextErrors.name = 'Le nom est requis.';

    if (!reference.trim()) {
      nextErrors.reference = 'La référence est requise.';
    } else if (isReferenceTaken(products, reference, editingProduct?.id)) {
      nextErrors.reference = 'Cette référence existe déjà.';
    }

    if (!category.trim()) nextErrors.category = 'La catégorie est requise.';

    const quantityValue = Number(quantity);
    if (quantity.trim().length === 0 || !Number.isInteger(quantityValue) || quantityValue < 0) {
      nextErrors.quantity = 'Entrez un entier positif ou nul.';
    }

    const thresholdValue = Number(alertThreshold);
    if (alertThreshold.trim().length === 0 || !Number.isInteger(thresholdValue) || thresholdValue < 0) {
      nextErrors.alertThreshold = 'Entrez un entier positif ou nul.';
    }

    return nextErrors;
  };

  const handleSubmit = () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const input = {
      name: name.trim(),
      reference: reference.trim(),
      description: description.trim(),
      category: category.trim(),
      quantity: Number(quantity),
      alertThreshold: Number(alertThreshold),
    };

    if (editingProduct) {
      editProduct(editingProduct.id, input);
    } else {
      addProduct(input);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <FormField
            label="Nom"
            value={name}
            onChangeText={setName}
            placeholder="Nom du produit"
            error={errors.name}
          />

          <FormField
            label="Référence"
            value={reference}
            onChangeText={setReference}
            placeholder="Ex : ALM-013"
            autoCapitalize="characters"
            error={errors.reference}
          />

          <FormField
            label="Catégorie"
            value={category}
            onChangeText={setCategory}
            placeholder="Ex : Alimentaire"
            error={errors.category}
          />

          <FormField
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Description (optionnelle)"
            multiline
            numberOfLines={3}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <FormField
                label="Quantité initiale"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="0"
                keyboardType="number-pad"
                error={errors.quantity}
              />
            </View>
            <View style={styles.rowItem}>
              <FormField
                label="Seuil d'alerte"
                value={alertThreshold}
                onChangeText={setAlertThreshold}
                placeholder="0"
                keyboardType="number-pad"
                error={errors.alertThreshold}
              />
            </View>
          </View>

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}
          >
            <Text style={styles.submitButtonText}>{editingProduct ? 'Mettre à jour' : 'Enregistrer'}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  submitButton: {
    minHeight: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
