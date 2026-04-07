import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {

  const handleLogout = async () => {
    // 1. Destroy the token in the vault
    await SecureStore.deleteItemAsync('metro_jwt');
    console.log("🚪 User logged out. Vault cleared.");
    
    // 2. Kick them back to the login screen
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Welcome to Book My Metro!</Text>
      <Text style={styles.subText}>You are successfully logged in.</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#dc3545', // A red logout button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});