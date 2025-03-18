import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";
import { useRouter } from "expo-router";
import { Button, TextInput, Surface } from "react-native-paper";
import { getColors } from "@/theme/colors";

const PlaceholderImage = require("@/assets/images/background-image.png");

const { width } = Dimensions.get('window');
const CARD_PADDING = width > 500 ? 48 : 24;

const loginValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background.default }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Surface style={[styles.card, { backgroundColor: colors.background.default }]} elevation={0}>
            <View style={styles.imageContainer}>
              <Surface style={[styles.imageWrapper, { backgroundColor: colors.background.default }]} elevation={0}>
                <Image 
                  source={PlaceholderImage}
                  style={styles.image}
                  resizeMode="contain"
                />
              </Surface>
            </View>
            <Text style={[styles.welcomeText, { color: colors.text.primary }]}>Welcome Back</Text>
            <Text style={[styles.subtitleText, { color: colors.text.secondary }]}>Sign in to continue</Text>

            <Formik 
              validationSchema={loginValidationSchema} 
              initialValues={{ email: "", password: "" }} 
              onSubmit={() => {
                dispatch(login());
                router.replace('/(tabs)');
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                <View style={styles.form}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      label="Email"
                      mode="outlined"
                      left={<TextInput.Icon icon="email-outline" />}
                      style={[styles.input, { backgroundColor: colors.background.paper }]}
                      outlineStyle={styles.inputOutline}
                      theme={{ 
                        colors: { 
                          primary: colors.primary.main,
                          text: colors.text.primary,
                          background: colors.background.paper,
                        } 
                      }}
                      keyboardType="email-address"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                    />
                    {errors.email && touched.email && (
                      <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>
                    )}
                  </View>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      label="Password"
                      mode="outlined"
                      secureTextEntry
                      left={<TextInput.Icon icon="lock-outline" />}
                      style={[styles.input, { backgroundColor: colors.background.paper }]}
                      outlineStyle={styles.inputOutline}
                      theme={{ 
                        colors: { 
                          primary: colors.primary.main,
                          text: colors.text.primary,
                          background: colors.background.paper,
                        } 
                      }}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                    />
                    {errors.password && touched.password && (
                      <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>
                    )}
                  </View>

                  <Button 
                    mode="contained" 
                    onPress={handleSubmit} 
                    style={[styles.button, { backgroundColor: colors.primary.main }]}
                    disabled={!isValid}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                  >
                    Sign In
                  </Button>

                  <View style={styles.linksContainer}>
                    <Button 
                      mode="text" 
                      onPress={() => navigation.navigate("Forget")}
                      textColor={colors.primary.main}
                      labelStyle={styles.linkButtonLabel}
                    >
                      Forgot Password?
                    </Button>
                    <Button 
                      mode="text" 
                      onPress={() => navigation.navigate("SignUp")}
                      textColor={colors.primary.main}
                      labelStyle={styles.linkButtonLabel}
                    >
                      Create Account
                    </Button>
                  </View>
                </View>
              )}
            </Formik>

            {/* Temporary Development Button */}
            <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.background.dark }}>
              <Button 
                mode="contained" 
                onPress={() => {
                  dispatch(login());
                  router.push('/(tabs)/virgil');
                }}
                style={[styles.button, { backgroundColor: colors.error }]}
                labelStyle={[styles.buttonLabel, { color: '#fff' }]}
              >
                DEV: Go to Virgil Tab
              </Button>
            </View>
          </Surface>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
    paddingHorizontal: 20,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    padding: CARD_PADDING,
    borderRadius: 0,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
    height: 140,
  },
  imageWrapper: {
    width: '85%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: Platform.OS === 'ios' ? '800' : '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  form: {
    gap: 24,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    marginTop: 8,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  linkButtonLabel: {
    fontSize: 14,
  },
}); 