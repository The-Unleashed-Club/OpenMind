import React, { useCallback } from "react";
import { View, StyleSheet, Text, Alert, KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import {
  auth,
  createUserWithEmailAndPassword,
} from "../firebase/firebase-utilities";
import Button_1 from "../components/button1";
import { setLoading } from "../state-managment/reducers";
import { useDispatch } from "react-redux";
import { db, collection, addDoc } from "../firebase/firebase-utilities";
import { TextInput } from "@/components/input/TextInput";
import { useForm, SubmitHandler } from "react-hook-form"

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
}

export const useSignupScreen = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
  } = useForm<SignupFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
    },
  })

  const onSignupFormSubmit: SubmitHandler<SignupFormData> = useCallback((data) => {
    const { name, email, password, rePassword } = data;

    if (password !== rePassword) {
      Alert.alert("Password Do not match, please try again");
    } else {
      dispatch(setLoading(true));
      try {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            const docRef = await addDoc(collection(db, "users"), {
              name: name,
              email: email,
              password: password,
            });
            console.log("Document written with ID: ", docRef.id);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      } catch (error) {
        console.error("Error", error);
        dispatch(setLoading(false));
      }
    }
  }, [])

  return {
    control,
    handleSubmit,
    onSignupFormSubmit
  }
}

export const SignupScreen = () => {
  const { control,
    handleSubmit,
    onSignupFormSubmit } = useSignupScreen();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.container1}>
            <Text style={styles.SignUpLabel}>SignUp</Text>
          </View>

          <View style={{ width: "100%" }}>
            <TextInput control={control} name="name" label={"Your Name"} rules={{
              required: {
                value: true,
                message: "Please enter your name",
              },
            }} />

            <TextInput control={control} name="email" label={"Your Email"} rules={{
              required: {
                value: true,
                message: "Please enter your email address",
              },
            }} />

            <TextInput control={control} name="password" label={"Enter Password"} rules={{
              required: {
                value: true,
                message: "Password is required",
              },
            }} />

            <TextInput control={control} name="rePassword" label={"Re-enter Password"} rules={{
              required: {
                value: true,
                message: "Please re-enter your password",
              },
            }} />
          </View>

          <View style={styles.container2}>
            <Button_1 title="SignUp" onPress={handleSubmit(onSignupFormSubmit)} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "10%",
    backgroundColor: "#ffffff",
  },
  container1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    top: "10%",
  },
  container2: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    bottom: "5%",
  },
  SignUpLabel: {
    fontSize: 50,
    marginBottom: 24,
    color: "#224957",
  },
  Button: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
});