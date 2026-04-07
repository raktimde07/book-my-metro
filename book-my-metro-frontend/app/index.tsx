import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import apiClient from '../api/client';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  // 1. We use React State to hold the data the user types
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 2. The function that will eventually talk to oour Node backend
  const handleLogin = async () => {

    // 1. Reset error message on new attempt
    setErrorMessage('');

    console.log("Attempting to login with", email);

    // 2. Mandatory Constraints Check
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill out all mandatory fields.');
      return; // This stops the function from running the API call!
    }
    try{
        // This automatically prepends our EXPO_PUBLIC_API_URL.
        const response = await apiClient.post('/users/login', {
            email: email,
            password: password,
        });

      // The backend should send back a JWT token on success
      console.log("✅ Login Success! Data received:", response.data);

      // Store the token securely for future API calls
      await SecureStore.setItemAsync('userToken', response.data.token);

      console.log("Token stored securely. Navigating to main app...");
      
      // Navigate the user into the main app 
      router.replace('/');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            setErrorMessage(error.response?.data?.message || 'Login failed.');
            console.log("Axios Error:", error.response);
        } else {
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.log("Unexpected Error:", error);
        }
    }
};

  // 3. The UI Blueprint (Declarative rendering)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Book My Metro</Text>
        <Text style={styles.subText}>Sign in to manage your tickets</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email Address *"
          value={email}
          onChangeText={setEmail} // Updates the email state as they type
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          value={password}
          onChangeText={setPassword} // Updates the password state
          secureTextEntry={true} // Hides the password characters
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/register')}>
          <Text style={styles.linkText}>Don't have an account? Register here.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 4. The Styles (React Native uses a Flexbox-based styling system)
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
    backgroundColor: '#007bff', // A nice Metro blue
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