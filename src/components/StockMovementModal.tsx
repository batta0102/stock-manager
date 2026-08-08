import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';

interface StockMovementModalProps {
  visible: boolean;
  direction: 'in' | 'out';
  currentQuantity: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function StockMovementModal({
  visible,
  direction,
  currentQuantity,
  onClose,
  onConfirm,
}: StockMovementModalProps) {
  const [value, setValue] = useState('');

  const parsed = Number.parseInt(value, 10);
  const exceedsStock = direction === 'out' && Number.isInteger(parsed) && parsed > currentQuantity;
  const isValid = value.trim().length > 0 && Number.isInteger(parsed) && parsed > 0 && !exceedsStock;

  const handleClose = () => {
    setValue('');
    onClose();
  };

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(parsed);
    setValue('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{direction === 'in' ? 'Entrée de stock' : 'Sortie de stock'}</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Quantité"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            style={styles.input}
            autoFocus
          />
          {value.trim().length > 0 && exceedsStock && (
            <Text style={styles.error}>La quantité dépasse le stock disponible ({currentQuantity}).</Text>
          )}
          {value.trim().length > 0 && !exceedsStock && !isValid && (
            <Text style={styles.error}>Saisissez un nombre entier positif.</Text>
          )}
          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.pressed]}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              disabled={!isValid}
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                !isValid && styles.confirmButtonDisabled,
                pressed && isValid && styles.pressed,
              ]}
            >
              <Text style={styles.confirmText}>Valider</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    minHeight: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.border,
  },
  confirmText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
