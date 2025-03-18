import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { useRouter } from "expo-router";
import { Provider as PaperProvider, Button, TextInput } from "react-native-paper";
import { darkTheme, lightTheme } from "@/common/theme";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "@/components/ImageViewer";

const PlaceholderImage = require("@/assets/images/background-image.png");

const loginValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/chat");
    }
  }, [isLoggedIn]);

  // Image Picker
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("No image selected.");
    }
  };

  // Animated Theme Toggle
  const translateX = new Animated.Value(isDarkMode ? 20 : 0);
  const handleToggleTheme = () => {
    Animated.timing(translateX, {
      toValue: isDarkMode ? 0 : 20,
      duration: 200,
      useNativeDriver: true,
    }).start();
    dispatch(toggleTheme());
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "#fff" }]}>
      {/* Theme Toggle Button */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={handleToggleTheme} style={styles.switch}>
          <Animated.View style={[styles.toggleCircle, { transform: [{ translateX }] }, isDarkMode ? styles.darkToggle : styles.lightToggle]}>
            <Icon name={isDarkMode ? "moon" : "sunny"} size={16} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Logo / Image */}
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Login</Text>

        <Formik validationSchema={loginValidationSchema} initialValues={{ email: "", password: "" }} onSubmit={() => dispatch(login())}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <>
              {/* Email Input */}
              <TextInput
                label="Email"
                mode="outlined"
                left={<TextInput.Icon icon="email-outline" />}
                style={styles.input}
                theme={{ colors: { text: isDarkMode ? "#fff" : "#000", primary: isDarkMode ? "#bb86fc" : "#6200ee" } }}
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Password Input */}
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock-outline" />}
                style={styles.input}
                theme={{ colors: { text: isDarkMode ? "#fff" : "#000", primary: isDarkMode ? "#bb86fc" : "#6200ee" } }}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Forgot Password */}
              <TouchableOpacity onPress={() => navigation.navigate("Forget")}>
                <Text style={[styles.forgotPassword, { color: isDarkMode ? "#bbb" : "#555" }]}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={!isValid}>
                Login
              </Button>

              {/* Sign Up Redirect */}
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={[styles.signUp, { color: isDarkMode ? "#bbb" : "#555" }]}>
                  Don't have an account? <Text style={[styles.signUpLink, { color: isDarkMode ? "#bb86fc" : "#6200ee" }]}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <PaperProvider theme={useSelector((state: RootState) => state.theme.isDarkMode) ? darkTheme : lightTheme}>
      <LoginScreen />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  toggleContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  switch: {
    width: 50,
    height: 25,
    borderRadius: 15,
    backgroundColor: "#ccc",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  darkToggle: {
    backgroundColor: "#bb86fc",
  },
  lightToggle: {
    backgroundColor: "#6200ee",
  },
  imageContainer: {
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "transparent",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  forgotPassword: {
    fontSize: 14,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    marginVertical: 15,
  },
  signUp: {
    fontSize: 14,
  },
  signUpLink: {
    fontWeight: "bold",
  },
});
