import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Restaurant } from '../types/food';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radius, spacing, thickBorder } from '../theme/layout';
import { triggerLightHaptic } from '../utils/haptics';

interface RestaurantListProps {
  restaurants: Restaurant[];
  loading: boolean;
  errorMessage?: string;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function RestaurantList({ restaurants, loading, errorMessage }: RestaurantListProps) {
  if (loading) {
    return (
      <View style={styles.messageBox}>
        <Text style={[typography.body, styles.messageText]}>
          근처에서 뒤지는 중... 좀 기다려봐.
        </Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.messageBox}>
        <Text style={[typography.body, styles.messageText]}>{errorMessage}</Text>
      </View>
    );
  }

  if (restaurants.length === 0) {
    return (
      <View style={styles.messageBox}>
        <Text style={[typography.body, styles.messageText]}>
          근처에 파는 곳이 없나 본데? 배달앱이나 뒤져봐.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      <Text style={[typography.title, styles.header]}>근처 식당, 잔말 말고 골라</Text>
      {restaurants.map((r) => (
        <Pressable
          key={r.id}
          style={[styles.item, thickBorder]}
          onPressIn={triggerLightHaptic}
          onPress={() => r.placeUrl && Linking.openURL(r.placeUrl)}
        >
          <View style={styles.itemHeader}>
            <Text style={[typography.body, styles.name]} numberOfLines={1}>
              {r.name}
            </Text>
            <Text style={[typography.caption, styles.distance]}>
              {formatDistance(r.distanceMeters)}
            </Text>
          </View>
          <Text style={[typography.caption, styles.address]} numberOfLines={1}>
            {r.address}
          </Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${r.score}%` }]} />
            </View>
            <Text style={[typography.caption, styles.scoreLabel]}>추천 강도 {r.score}%</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  messageBox: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  messageText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  list: {
    width: '100%',
    marginTop: spacing.md,
  },
  header: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: colors.textPrimary,
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  distance: {
    color: colors.accent,
  },
  address: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  scoreBarBg: {
    flex: 1,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  scoreLabel: {
    color: colors.textSecondary,
  },
});
