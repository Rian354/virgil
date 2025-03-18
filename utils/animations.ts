import { Animated, Easing } from 'react-native';

export const fadeIn = (animatedValue: Animated.Value, duration = 300) => {
  Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    useNativeDriver: true,
    easing: Easing.ease,
  }).start();
};

export const fadeOut = (animatedValue: Animated.Value, duration = 300) => {
  Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    useNativeDriver: true,
    easing: Easing.ease,
  }).start();
};

export const slideUp = (animatedValue: Animated.Value, duration = 300) => {
  Animated.spring(animatedValue, {
    toValue: 0,
    useNativeDriver: true,
    damping: 20,
    stiffness: 90,
  }).start();
};

export const scaleIn = (animatedValue: Animated.Value, duration = 300) => {
  Animated.spring(animatedValue, {
    toValue: 1,
    useNativeDriver: true,
    damping: 15,
    stiffness: 100,
  }).start();
};

export const pressAnimation = (animatedValue: Animated.Value) => {
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.ease,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.ease,
    }),
  ]).start();
};

export const staggeredFadeIn = (
  animatedValues: Animated.Value[],
  delay = 50,
  duration = 300,
) => {
  const animations = animatedValues.map((value, index) =>
    Animated.timing(value, {
      toValue: 1,
      duration,
      delay: index * delay,
      useNativeDriver: true,
      easing: Easing.ease,
    }),
  );
  Animated.stagger(delay, animations).start();
};

export const createSharedElementTransition = (
  animatedValue: Animated.Value,
  duration = 300,
) => {
  return {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
}; 