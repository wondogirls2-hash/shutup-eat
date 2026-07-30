import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FoodItem } from '../types/food';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { hardShadow, radius, spacing, thickBorder } from '../theme/layout';
import { LOCAL_FOOD_IMAGES } from '../data/localImages';

interface FoodCardProps {
  food: FoodItem;
  eatCount: number;
}

const MAX_VISIBLE_STARS = 5;

function StarCount({ count }: { count: number }) {
  if (count <= 0) {
    return (
      <View style={styles.starRow}>
        <Text style={[typography.caption, styles.starEmpty]}>☆ 처음 만나는 메뉴</Text>
      </View>
    );
  }

  const filled = Math.min(count, MAX_VISIBLE_STARS);
  const extra = count - filled;

  return (
    <View style={styles.starRow}>
      <Text style={styles.starText}>{'★'.repeat(filled)}</Text>
      <Text style={[typography.caption, styles.starLabel]}>
        {extra > 0 ? ` +${extra} ` : ' '}
        {count}번째 먹는 거다
      </Text>
    </View>
  );
}

export function FoodCard({ food, eatCount }: FoodCardProps) {
  const imageSource = LOCAL_FOOD_IMAGES[food.id] ?? { uri: food.imageUrl };

  return (
    <View style={[styles.card, thickBorder, hardShadow]}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.badge}>
        <Text style={[typography.caption, styles.badgeText]}>{food.category}</Text>
      </View>
      <View style={styles.body}>
        <Text style={[typography.hero, styles.name]} numberOfLines={1}>
          {food.name}
        </Text>
        <StarCount count={eatCount} />
        <Text style={[typography.body, styles.roast]}>"{food.roast}"</Text>
        <View style={styles.tagRow}>
          {food.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={[typography.caption, styles.tagText]}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceAlt,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.textOnAccent,
  },
  body: {
    padding: spacing.md,
  },
  name: {
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  starText: {
    color: colors.accent,
    fontSize: 16,
    letterSpacing: 2,
  },
  starLabel: {
    color: colors.textSecondary,
  },
  starEmpty: {
    color: colors.textSecondary,
  },
  roast: {
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: colors.textSecondary,
  },
});
