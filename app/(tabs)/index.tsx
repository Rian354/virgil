import React, { useState } from "react";
import { View, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { useRouter } from "expo-router";
import { Button, TextInput, Surface, Text, Card, Switch } from "react-native-paper";
import { getColors } from "@/theme/colors";
import { apiRequest } from "@/common/API";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const PlaceholderImage = require("@/assets/images/background-image.png");

const { width } = Dimensions.get("window");
const CARD_PADDING = width > 500 ? 48 : 24;

const loginValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const API_URL = "http://localhost:8000"; // Replace with your actual backend URL

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);
  const navigation = useNavigation();
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUserData = async (email: string, password: string) => {
    try {
      return await apiRequest("GET", `/login?email=${email}&password=${password}`);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetchUserData(email, password);
      if (response && response.token) {
        dispatch(login());
        router.replace("/chat");
      } else {
        setErrorMsg("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setErrorMsg("Login failed. Please check your credentials.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background.default, padding: 16 }}>
      <Card style={{ padding: CARD_PADDING, borderRadius: 16, elevation: 6, width: width > 500 ? 420 : "90%", backgroundColor: colors.background.paper }}>
        <Card.Content style={{ alignItems: "center" }}>
          <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)}>
            <Image source={PlaceholderImage} style={{ width: 120, height: 120 }} resizeMode="contain" />
          </Animated.View>
          <Text variant="headlineMedium" style={{ color: colors.text.primary, marginTop: 16 }}>Welcome Back</Text>
          <Text variant="bodyMedium" style={{ color: colors.text.secondary, marginBottom: 16 }}>Sign in to continue</Text>
          <Switch value={isDarkMode} onValueChange={() => dispatch(toggleTheme())} color={colors.primary.main} />
        </Card.Content>

        {errorMsg ? (
          <Text style={{ color: colors.error, textAlign: "center", marginBottom: 16 }}>{errorMsg}</Text>
        ) : null}

        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => handleLogin(values.email, values.password)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <Card.Content>
              <TextInput
                label="Email"
                mode="outlined"
                left={<TextInput.Icon icon="email-outline" />}
                value={values.email}
                onFocus={() => setErrorMsg("")}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                style={{ marginBottom: 8, backgroundColor: colors.surface }}
                theme={{ colors: { primary: colors.primary.main } }}
              />
              {errors.email && touched.email && <Text style={{ color: colors.error }}>{errors.email}</Text>}

              <TextInput
                label="Password"
                mode="outlined"
                left={<TextInput.Icon icon="lock-outline" />}
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                style={{ marginBottom: 8, backgroundColor: colors.surface }}
                theme={{ colors: { primary: colors.primary.main } }}
              />
              {errors.password && touched.password && <Text style={{ color: colors.error }}>{errors.password}</Text>}

              <Button mode="contained" onPress={handleSubmit} disabled={!isValid} style={{ marginTop: 16, backgroundColor: colors.primary.main, borderRadius: 8 }}>
                Sign In
              </Button>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
                <Button mode="text" onPress={() => navigation.navigate("Forget")} textColor={colors.primary.main}>Forgot Password?</Button>
                <Button mode="text" onPress={() => navigation.navigate("SignUp")} textColor={colors.primary.main}>Create Account</Button>
              </View>
            </Card.Content>
          )}
        </Formik>
      </Card>
    </View>
  );
}
