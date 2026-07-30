import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface BigButtonProps {
  label: string;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

const PRESS_OFFSET = 6;

export function BigButton({
  label,
  onPress,
  size = 220,
  backgroundColor = colors.primary,
  textColor = colors.textPrimary,
  style,
  disabled,
}: BigButtonProps) {
  const shift = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number, scaleTo: number) => {
    Animated.parallel([
      Animated.spring(shift, { toValue, useNativeDriver: true, friction: 6, tension: 100 }),
      Animated.spring(scale, { toValue: scaleTo, useNativeDriver: true, friction: 6, tension: 100 }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.shadowBox,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale }],
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          transform: [{ translateX: shift }, { translateY: shift }],
        }}
      >
        <Pressable
          disabled={disabled}
          onPressIn={() => animateTo(PRESS_OFFSET, 0.97)}
          onPressOut={() => animateTo(0, 1)}
          onPress={onPress}
          style={[
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: disabled ? colors.chipInactiveBg : backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              typography.hero,
              styles.label,
              { color: disabled ? colors.textSecondary : textColor },
            ]}
          >
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: colors.border,
  },
  button: {
    borderWidth: 4,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  label: {
    textAlign: 'center',
  },
});
