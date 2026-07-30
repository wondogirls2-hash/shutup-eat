import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/layout';
import { SurveyChip } from '../components/SurveyChip';
import { BigButton } from '../components/BigButton';
import { AllergenTag, FoodCategory } from '../types/food';
import { UserPreferences } from '../types/survey';
import { savePreferences } from '../services/storage';
import { RootStackParamList } from '../navigation/types';

const ALLERGENS: AllergenTag[] = [
  '갑각류',
  '견과류',
  '유제품',
  '밀가루',
  '계란',
  '해산물',
  '돼지고기',
  '땅콩',
];

const CATEGORIES: FoodCategory[] = [
  '한식',
  '중식',
  '일식',
  '양식',
  '분식',
  '아시안',
  '야식',
  '디저트',
];

type Step = 0 | 1 | 2;

const STEP_COPY: Record<Step, { title: string; subtitle: string }> = {
  0: {
    title: '못 먹는 거\n미리 불어',
    subtitle: '알러지 있는 거 다 체크해. 나중에 딴소리하지 말고.',
  },
  1: {
    title: '싫어하는\n음식 종류는?',
    subtitle: '이것도 미리 걸러줄 테니까 솔직하게 골라.',
  },
  2: {
    title: '그럼 뭘\n좋아하긴 해?',
    subtitle: '선호하는 걸 고르면 그쪽으로 좀 더 밀어줄게.',
  },
};

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [allergies, setAllergies] = useState<AllergenTag[]>([]);
  const [dislikedCategories, setDislikedCategories] = useState<FoodCategory[]>([]);
  const [preferredCategories, setPreferredCategories] = useState<FoodCategory[]>([]);

  const toggle = <T,>(list: T[], setList: (v: T[]) => void, value: T) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const isLastStep = step === 2;

  const handleNext = async () => {
    if (!isLastStep) {
      setStep((s) => (s + 1) as Step);
      return;
    }

    const prefs: UserPreferences = {
      allergies,
      dislikedCategories,
      preferredCategories,
      completedOnboarding: true,
    };
    await savePreferences(prefs);
    navigation.replace('Main');
  };

  const copy = STEP_COPY[step];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressRow}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              { backgroundColor: i <= step ? colors.primary : colors.surfaceAlt },
            ]}
          />
        ))}
      </View>

      <Text style={[typography.hero, styles.title]}>{copy.title}</Text>
      <Text style={[typography.body, styles.subtitle]}>{copy.subtitle}</Text>

      <View style={styles.chipWrap}>
        {step === 0 &&
          ALLERGENS.map((a) => (
            <SurveyChip
              key={a}
              label={a}
              selected={allergies.includes(a)}
              onPress={() => toggle(allergies, setAllergies, a)}
            />
          ))}
        {step === 1 &&
          CATEGORIES.map((c) => (
            <SurveyChip
              key={c}
              label={c}
              selected={dislikedCategories.includes(c)}
              onPress={() => toggle(dislikedCategories, setDislikedCategories, c)}
            />
          ))}
        {step === 2 &&
          CATEGORIES.map((c) => (
            <SurveyChip
              key={c}
              label={c}
              selected={preferredCategories.includes(c)}
              onPress={() => toggle(preferredCategories, setPreferredCategories, c)}
            />
          ))}
      </View>

      <View style={styles.buttonArea}>
        <BigButton
          label={isLastStep ? '됐고\n시작해' : '다음'}
          onPress={handleNext}
          size={isLastStep ? 160 : 120}
          backgroundColor={isLastStep ? colors.primary : colors.accent}
          textColor={isLastStep ? colors.textPrimary : colors.textOnAccent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 40,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  buttonArea: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
});
