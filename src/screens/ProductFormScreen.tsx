import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductFormScreenProps } from '../navigation/types';
import { isReferenceTaken } from '../services/productService';
import { useProductStore } from '../store/productStore';
import { colors, radii, spacing, typography } from '../theme/theme';

type FormErrors = Partial<Record<'name' | 'reference' | 'category' | 'quantity' | 'alertThreshold', string>>;

export default function ProductFormScreen({ navigation }: ProductFormScreenProps) {
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);

  const [name, setName] = useState('');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) nextErrors.name = 'Le nom est requis.';

    if (!reference.trim()) {
      nextErrors.reference = 'La référence est requise.';
    } else if (isReferenceTaken(products, reference)) {
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

    addProduct({
      name: name.trim(),
      reference: reference.trim(),
      description: description.trim(),
      category: category.trim(),
      quantity: Number(quantity),
      alertThreshold: Number(alertThreshold),
    });
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
          <View style={styles.field}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nom du produit"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Référence</Text>
            <TextInput
              value={reference}
              onChangeText={setReference}
              placeholder="Ex : ALM-013"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              style={[styles.input, errors.reference && styles.inputError]}
            />
            {errors.reference && <Text style={styles.error}>{errors.reference}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Catégorie</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="Ex : Alimentaire"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, errors.category && styles.inputError]}
            />
            {errors.category && <Text style={styles.error}>{errors.category}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Description (optionnelle)"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.rowItem]}>
              <Text style={styles.label}>Quantité initiale</Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                style={[styles.input, errors.quantity && styles.inputError]}
              />
              {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}
            </View>
            <View style={[styles.field, styles.rowItem]}>
              <Text style={styles.label}>Seuil d'alerte</Text>
              <TextInput
                value={alertThreshold}
                onChangeText={setAlertThreshold}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                style={[styles.input, errors.alertThreshold && styles.inputError]}
              />
              {errors.alertThreshold && <Text style={styles.error}>{errors.alertThreshold}</Text>}
            </View>
          </View>

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}
          >
            <Text style={styles.submitButtonText}>Enregistrer</Text>
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
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    ...typography.body,
    color: colors.text,
  },
  textArea: {
    minHeight: 88,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
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
