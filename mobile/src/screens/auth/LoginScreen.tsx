import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { validateLoginForm } from '../../utils/validation';
import { LoginStackNavigationProp } from '../../types';
import BiometricService from '../../services/biometricService';

interface Props {
  navigation: LoginStackNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, state, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await BiometricService.isAvailable();
    const enabled = await BiometricService.isBiometricEnabled();
    setBiometricAvailable(available);
    setBiometricEnabled(enabled);
  };

  const handleLogin = async () => {
    // Clear any previous errors
    clearError();

    // Validate form
    const errors = validateLoginForm(email, password);
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

    try {
      setIsLoading(true);
      await login({ email: email.trim().toLowerCase(), password });
      
      // After successful login, prompt for biometric setup
      if (biometricAvailable && !biometricEnabled) {
        BiometricService.promptBiometricSetup(async () => {
          const enabled = await BiometricService.enableBiometric({
            email: email.trim().toLowerCase(),
            password
          });
          if (enabled) {
            setBiometricEnabled(true);
            Alert.alert('Success', 'Biometric login has been enabled!');
          }
        });
      }
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      const result = await BiometricService.biometricLogin();
      
      if (result.success && result.credentials) {
        await login(result.credentials);
      } else {
        Alert.alert('Authentication Failed', result.error || 'Biometric login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleInputChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    if (state.error) clearError();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-10">
            <View className="w-24 h-24 bg-primary-600 rounded-full items-center justify-center mb-6">
              <Ionicons name="search" size={48} color="white" />
            </View>
            <Text className="text-4xl font-bold text-gray-900 mb-2">Lost & Found</Text>
            <Text className="text-lg text-gray-600 text-center">
              Welcome back! Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-5">
            {/* Email */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
              <TextInput
                className="bg-white px-4 py-4 rounded-lg border border-gray-300 text-base"
                placeholder="Enter your email"
                value={email}
                onChangeText={(value) => handleInputChange(setEmail, value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
              />
            </View>

            {/* Password */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-white px-4 py-4 pr-12 rounded-lg border border-gray-300 text-base"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(value) => handleInputChange(setPassword, value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <TouchableOpacity
                  className="absolute right-3 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end">
              <Text className="text-sm text-primary-600 font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Error Message */}
            {state.error && (
              <View className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <View className="flex-row items-center">
                  <Ionicons name="alert-circle" size={20} color="#DC2626" />
                  <Text className="text-danger-700 text-sm ml-2 flex-1">{state.error}</Text>
                </View>
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              className={`py-4 rounded-lg items-center mt-6 ${
                isLoading || state.isLoading 
                  ? 'bg-gray-400' 
                  : 'bg-primary-600'
              }`}
              onPress={handleLogin}
              disabled={isLoading || state.isLoading}
            >
              <View className="flex-row items-center">
                {(isLoading || state.isLoading) && (
                  <View className="mr-2">
                    <Text className="text-white">⌛</Text>
                  </View>
                )}
                <Text className="text-white text-base font-semibold">
                  {isLoading || state.isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Biometric Login */}
          {biometricAvailable && biometricEnabled && (
            <View className="items-center mb-6">
              <TouchableOpacity
                className="bg-gray-100 border border-gray-300 py-4 px-6 rounded-full items-center justify-center"
                onPress={handleBiometricLogin}
                disabled={isLoading || state.isLoading}
              >
                <View className="flex-row items-center">
                  <Ionicons name="finger-print" size={24} color="#059669" />
                  <Text className="text-gray-700 text-base font-medium ml-2">
                    Use Biometric Login
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Register Link */}
          <View className="items-center">
            <Text className="text-base text-gray-600 mb-3">Don't have an account?</Text>
            <TouchableOpacity 
              className="bg-white border border-primary-600 py-3 px-8 rounded-lg"
              onPress={navigateToRegister}
            >
              <Text className="text-primary-600 text-base font-semibold">Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
