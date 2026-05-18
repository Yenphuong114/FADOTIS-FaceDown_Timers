import React, { useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { AntDesign, FontAwesome, Feather } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const API_URL = 'http://192.168.1.9:3000/api'; 

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Trạng thái ẩn/hiện mật khẩu

  // --- 1. CẤU HÌNH GOOGLE ---
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '303478048848-d8kc4enb1nf20da99if7o5v0l30e046u.apps.googleusercontent.com',
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
      console.log("Facebook Token:", authentication.accessToken);
      Alert.alert('Thành công', 'Đã kết nối tài khoản Facebook thành công!');
      navigation.navigate('Home');
    }
  }, [fbResponse]);

  // Lắng nghe kết quả Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log("Đăng nhập Google thành công! Token:", authentication.accessToken);
      Alert.alert('Tuyệt vời!', 'Đã kết nối tài khoản Google thành công!');
      navigation.navigate('Home');
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Thành công', 'Đăng nhập thành công!');
        navigation.navigate('Home');
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
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />
        
        {/* Khung chứa Mật khẩu + Icon Mắt */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={22} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>Forget Password?</Text>
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
  linksContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  linkText: { color: '#888', textDecorationLine: 'underline', fontSize: 14 },
  orText: { color: '#888', marginBottom: 20 },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', width: '60%', gap: 20 },
  iconButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center' },
});