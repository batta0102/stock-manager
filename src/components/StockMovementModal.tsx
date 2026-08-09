import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, shadows, spacing, typography } from '../theme/theme';

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
  const tone = direction === 'in' ? colors.success : colors.danger;
  const toneMuted = direction === 'in' ? colors.successMuted : colors.dangerMuted;

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
          <View style={styles.titleRow}>
            <View style={[styles.iconWrap, { backgroundColor: toneMuted }]}>
              <Ionicons
                name={direction === 'in' ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={20}
                color={tone}
              />
            </View>
            <View style={styles.titleText}>
              <Text style={styles.title}>{direction === 'in' ? 'Entrée de stock' : 'Sortie de stock'}</Text>
              <Text style={styles.subtitle}>Stock actuel : {currentQuantity}</Text>
            </View>
          </View>
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
                { backgroundColor: isValid ? tone : colors.surfaceAlt },
                pressed && isValid && styles.pressed,
              ]}
            >
              <Text style={[styles.confirmText, !isValid && styles.confirmTextDisabled]}>Valider</Text>
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
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titleText: {
    flex: 1,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  input: {
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1.5,
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
    opacity: 0.85,
  },
  cancelButton: {
    backgroundColor: colors.surfaceAlt,
  },
  cancelText: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  confirmText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  confirmTextDisabled: {
    color: colors.textFaint,
  },
});
