import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getColors } from '@/theme/colors';

type Props = {
  label: string;
  theme?: 'primary' | 'secondary';
  onPress?: () => void;
  icon?: string;
};

export default function Button({ label, theme = 'primary', onPress, icon }: Props) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: theme === 'primary' ? colors.primary.main : colors.background.paper,
            borderColor: theme === 'primary' ? colors.primary.dark : colors.background.dark,
            borderWidth: 1,
          },
        ]}
        onPress={onPress}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={18}
            color={theme === 'primary' ? colors.background.paper : colors.text.primary}
            style={styles.buttonIcon}
          />
        )}
        <Text
          style={[
            styles.buttonLabel,
            {
              color: theme === 'primary' ? colors.background.paper : colors.text.primary,
            },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  button: {
    borderRadius: 12,
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
