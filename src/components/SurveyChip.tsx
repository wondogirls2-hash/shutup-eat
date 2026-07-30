import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radius } from '../theme/layout';

interface SurveyChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SurveyChip({ label, selected, onPress }: SurveyChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.chipActiveBg : colors.chipInactiveBg,
          borderColor: selected ? colors.chipActiveBorder : colors.chipInactiveBorder,
        },
      ]}
    >
      <Text
        style={[
          typography.body,
          { color: selected ? colors.textOnAccent : colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 2,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    marginBottom: 10,
  },
});
