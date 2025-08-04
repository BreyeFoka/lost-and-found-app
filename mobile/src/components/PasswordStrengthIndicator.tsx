import React from 'react';
import { View, Text } from 'react-native';
import { getPasswordStrength } from '../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showFeedback?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showFeedback = true,
}) => {
  const { score, feedback } = getPasswordStrength(password);
  
  const getStrengthColor = (score: number): string => {
    if (score <= 1) return 'bg-danger-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-success-500';
  };

  const getStrengthText = (score: number): string => {
    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  const getStrengthWidth = (score: number): number => {
    return Math.max(20, (score / 5) * 100);
  };

  if (!password) return null;

  return (
    <View className="mt-2">
      {/* Strength Bar */}
      <View className="flex-row items-center mb-2">
        <Text className="text-xs text-gray-600 mr-2">Password Strength:</Text>
        <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className={`h-full rounded-full transition-all duration-300 ${getStrengthColor(score)}`}
            style={{ width: `${getStrengthWidth(score)}%` }}
          />
        </View>
        <Text className={`text-xs ml-2 font-medium ${
          score <= 1 ? 'text-danger-600' : 
          score <= 3 ? 'text-yellow-600' : 
          'text-success-600'
        }`}>
          {getStrengthText(score)}
        </Text>
      </View>

      {/* Feedback */}
      {showFeedback && feedback.length > 0 && (
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          {feedback.map((item, index) => (
            <Text key={index} className="text-blue-700 text-xs mb-1">
              • {item}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default PasswordStrengthIndicator;
