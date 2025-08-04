import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { validateRegisterForm } from '../../utils/validation';
import { RegisterStackNavigationProp } from '../../types';

interface Props {
  navigation: RegisterStackNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, state, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (state.error) clearError();
  };

  const handleRegister = async () => {
    // Validate form
    const errors = validateRegisterForm(formData);
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

    try {
      setIsLoading(true);
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        studentId: formData.studentId.trim(),
        phone: formData.phoneNumber.trim() || undefined,
      });
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
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
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary-600 rounded-full items-center justify-center mb-4">
              <Ionicons name="person-add" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-base text-gray-600 text-center">
              Join the Lost & Found community
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Name Fields */}
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">First Name</Text>
                <TextInput
                  className="bg-white px-4 py-3 rounded-lg border border-gray-300 text-base"
                  placeholder="John"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">Last Name</Text>
                <TextInput
                  className="bg-white px-4 py-3 rounded-lg border border-gray-300 text-base"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
              <TextInput
                className="bg-white px-4 py-3 rounded-lg border border-gray-300 text-base"
                placeholder="john.doe@university.edu"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Student ID */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Student ID</Text>
              <TextInput
                className="bg-white px-4 py-3 rounded-lg border border-gray-300 text-base"
                placeholder="STU123456"
                value={formData.studentId}
                onChangeText={(value) => handleInputChange('studentId', value)}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {/* Phone Number (Optional) */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</Text>
              <TextInput
                className="bg-white px-4 py-3 rounded-lg border border-gray-300 text-base"
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-white px-4 py-3 pr-12 rounded-lg border border-gray-300 text-base"
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
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

            {/* Confirm Password */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-white px-4 py-3 pr-12 rounded-lg border border-gray-300 text-base"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {state.error && (
              <View className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                <Text className="text-danger-700 text-sm text-center">{state.error}</Text>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              className={`py-4 rounded-lg items-center mt-6 ${
                isLoading || state.isLoading 
                  ? 'bg-gray-400' 
                  : 'bg-primary-600'
              }`}
              onPress={handleRegister}
              disabled={isLoading || state.isLoading}
            >
              <Text className="text-white text-base font-semibold">
                {isLoading || state.isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-base text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text className="text-base text-primary-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
