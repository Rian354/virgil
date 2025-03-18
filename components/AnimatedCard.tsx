import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Surface } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getColors } from '@/theme/colors';
import { scaleIn, pressAnimation } from '@/utils/animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  delay?: number;
}

export function AnimatedCard({ children, style, onPress, delay = 0 }: AnimatedCardProps) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  useEffect(() => {
    scaleIn(scale, opacity, delay);
  }, [delay]);

  const content = (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ scale }],
        },
        style,
      ]}
    >
      <Surface style={[styles.surface, { backgroundColor: colors.background.paper }]} elevation={0}>
        {children}
      </Surface>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={() => pressAnimation(scale, 0.95)}
        onPressOut={() => pressAnimation(scale, 1)}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  surface: {
    borderRadius: 16,
    overflow: 'hidden',
  },
}); 