import React, { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { AntDesign, FontAwesome, Feather } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false); 

  // --- 1. CẤU HÌNH GOOGLE ---
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '303478048848-d8kc4enb1nf20da99if7o5v0l30e046u.apps.googleusercontent.com', 
    redirectUri: 'https://auth.expo.io/@phuong415/Fadotis',
    androidClientId: '303478048848-d8kc4enb1nf20da99if7o5v0l30e046u.apps.googleusercontent.com',
    iosClientId: '303478048848-d8kc4enb1nf20da99if7o5v0l30e046u.apps.googleusercontent.com',
  });

  // --- 2. CẤU HÌNH FACEBOOK ---
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: '2231242510744345', 
    redirectUri: 'https://auth.expo.io/@phuong415/Fadotis', 
  });

  // Lắng nghe kết quả Facebook
  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      console.log("Facebook Token từ Register:", authentication.accessToken);
      Alert.alert('Thành công', 'Đã đăng ký bằng Facebook thành công!');
    }
  }, [fbResponse]);

  // Lắng nghe kết quả Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log("Đăng nhập Google thành công từ Register! Token:", authentication.accessToken);
      Alert.alert('Tuyệt vời!', 'Đã đăng ký bằng Google thành công!');
    }
  }, [response]);

  const handleRegister = async () => {
    if (password !== rePassword) {
      Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp!');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Thành công', 'Đăng ký thành công!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Lỗi', data.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>FADOTIS</Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} autoCapitalize="none" />
        
        {/* Khung chứa Mật khẩu */}
        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={22} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Khung chứa Nhập lại Mật khẩu */}
        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Re-password" 
            value={rePassword} 
            onChangeText={setRePassword} 
            secureTextEntry={!showRePassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowRePassword(!showRePassword)}>
            <Feather name={showRePassword ? "eye" : "eye-off"} size={22} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>or</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => promptAsync()} 
          disabled={!request}
        >
          <AntDesign name="google" size={30} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => fbPromptAsync()} 
          disabled={!fbRequest}
        >
          <FontAwesome name="facebook-f" size={30} color="#4267B2" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <AntDesign name="instagram" size={30} color="#C13584" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 30 },
  logoText: { fontSize: 40, fontWeight: '900', marginBottom: 50, color: '#000', fontFamily: 'serif' },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: { height: 50, borderColor: '#5ABCB9', borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, fontWeight: 'bold' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderColor: '#5ABCB9', borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, height: 50 },
  passwordInput: { flex: 1, fontSize: 16, fontWeight: 'bold', height: '100%' },
  primaryButton: { backgroundColor: '#5ABCB9', width: '100%', height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linksContainer: { flexDirection: 'row', justifyContent: 'flex-start', width: '100%', marginBottom: 30 },
  linkText: { color: '#888', textDecorationLine: 'underline', fontSize: 14, fontWeight: 'bold' },
  orText: { color: '#888', marginBottom: 20 },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', width: '60%', gap: 20 },
  iconButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center' },
});