import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import apiClient from '../api/client';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  // 1. We use React State to hold the data the user types
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For showing a loading spinner during API calls
  const [isCheckingVault, setIsCheckingVault] = useState(true); // state to handle the initial boot check

  // The Auto-Login Logic
  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          console.log("🔓 Token found in vault! Bypassing login...");
          // If token exists, jump to home screen
          router.replace('./home'); 
        } else {
          // If no token, turn off the loading screen so they can log in
          setIsCheckingVault(false); 
        }
      } catch (error) {
        console.error("Error reading from secure store", error);
        setIsCheckingVault(false);
      }
    };

    checkLoginState();
  }, []); // The empty array ensures this only runs ONCE when the app opens

  // 2. The function that will eventually talk to our Node backend
  const handleLogin = async () => {

    // 1. Reset error message on new attempt
    setErrorMessage('');

    console.log("Attempting to login with", email);

    // 2. Mandatory Constraints Check
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill out all mandatory fields.');
      return; // This stops the function from running the API call!
    }

    setIsLoading(true); // Start loading spinner

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
      router.replace('./home');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // 2. Catch Timeout or Network Errors specifically
        if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
          setErrorMessage('Network error. Please check your Wi-Fi connection and make sure the server is running.');
        } else {
          setErrorMessage(error.response?.data?.message || 'Invalid credentials.');
        }
        console.error("Login Failed:", error.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }finally {
        setIsLoading(false); // Stop loading spinner
    }
};

// Show a loading screen while we're checking the vault for an existing token
if (isCheckingVault) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

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

        <TouchableOpacity 
          style={[styles.button, isLoading && { backgroundColor: '#a0c4ff' }]} // Make it lighter if loading
          onPress={handleLogin}
          disabled={isLoading} // Physically prevents double-clicking
        >
          {isLoading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText}>Login</Text>)}
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