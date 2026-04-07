import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import apiClient from '../api/client';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {

    // 1. Reset error message on new attempt
    setErrorMessage('');

    //console.log("Attempting to register:", name, phone, email, password);

    // 2. Mandatory Constraints Check
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setErrorMessage('Please fill out all mandatory fields.');
      return; // This stops the function from running the API call!
    }

    try {
      // This automatically prepends our EXPO_PUBLIC_API_URL.
      const response = await apiClient.post('/users/register', {
        name: name,
        phone: phone,
        email: email,
        password: password,
      });

      console.log("Registration Success:", response.data);
      router.replace('/'); 

    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || 'Registration failed.');
        console.log("Axios Error:", error.response);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        console.log("Unexpected Error:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Create Account</Text>
        <Text style={styles.subText}>Join Book My Metro today</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad" 
          autoCapitalize="none"
          maxLength={10} 
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* This button uses Expo Router to go back to the Login screen */}
        <TouchableOpacity style={styles.linkButton} onPress={() => router.back()}>
          <Text style={styles.linkText}>Already have an account? Login here.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745', // Using a green color to differentiate from login
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007bff',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
},
});