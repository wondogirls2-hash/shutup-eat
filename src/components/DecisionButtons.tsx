import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radius, spacing, thickBorder } from '../theme/layout';
import { triggerLightHaptic } from '../utils/haptics';

interface DecisionButtonsProps {
  onEat: () => void;
  onSkip: () => void;
}

export function DecisionButtons({ onEat, onSkip }: DecisionButtonsProps) {
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.button, thickBorder, { backgroundColor: colors.success }]}
        onPressIn={triggerLightHaptic}
        onPress={onEat}
      >
        <Text style={[typography.button, styles.buttonText]}>⭕ 처먹는다</Text>
      </Pressable>
      <Pressable
        style={[styles.button, thickBorder, { backgroundColor: colors.danger }]}
        onPressIn={triggerLightHaptic}
        onPress={onSkip}
      >
        <Text style={[typography.button, styles.buttonText]}>❌ 안 먹어</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.textOnPrimary,
  },
});
