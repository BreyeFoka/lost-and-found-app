import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const LoadingScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <View className="w-20 h-20 bg-primary-600 rounded-full items-center justify-center mb-6">
          <Ionicons name="search" size={40} color="white" />
        </View>
        
        {/* App Name */}
        <Text className="text-2xl font-bold text-gray-900 mb-2">Lost & Found</Text>
        <Text className="text-base text-gray-600 mb-8 text-center">
          Connecting students to their lost items
        </Text>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
