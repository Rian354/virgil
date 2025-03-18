import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Surface } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getColors } from '@/theme/colors';

interface AnimatedListItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  index?: number;
}

export function AnimatedListItem({ children, style, onPress, index = 0 }: AnimatedListItemProps) {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  useEffect(() => {
    const delay = index * 100;
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const animatedStyle = {
    transform: [
      { translateY },
      { scale },
    ],
    opacity,
  };

  const content = (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <Surface style={[styles.surface, { backgroundColor: colors.background.paper }]} elevation={0}>
        {children}
      </Surface>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  pressable: {
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.9,
  },
  surface: {
    borderRadius: 12,
    overflow: 'hidden',
  },
}); 