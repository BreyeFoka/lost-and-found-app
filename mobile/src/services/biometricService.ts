import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: string;
}

class BiometricService {
  private static readonly BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
  private static readonly BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';

  // Check if biometric authentication is available
  static async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Biometric availability check failed:', error);
      return false;
    }
  }

  // Get supported biometric types
  static async getSupportedBiometrics(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Failed to get supported biometric types:', error);
      return [];
    }
  }

  // Authenticate with biometrics
  static async authenticate(reason: string = 'Please verify your identity'): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device'
        };
      }

      const supportedTypes = await this.getSupportedBiometrics();
      const biometricType = this.getBiometricTypeName(supportedTypes);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use PIN/Password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return {
          success: true,
          biometricType
        };
      } else {
        return {
          success: false,
          error: result.error || 'Authentication failed'
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Biometric authentication failed'
      };
    }
  }

  // Enable biometric authentication for the app
  static async enableBiometric(userCredentials: { email: string; password: string }): Promise<boolean> {
    try {
      const authResult = await this.authenticate('Enable biometric login for faster access');
      
      if (authResult.success) {
        // Store encrypted credentials
        await SecureStore.setItemAsync(
          this.BIOMETRIC_CREDENTIALS_KEY,
          JSON.stringify(userCredentials)
        );
        await SecureStore.setItemAsync(this.BIOMETRIC_ENABLED_KEY, 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to enable biometric:', error);
      return false;
    }
  }

  // Disable biometric authentication
  static async disableBiometric(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(this.BIOMETRIC_CREDENTIALS_KEY);
      await SecureStore.deleteItemAsync(this.BIOMETRIC_ENABLED_KEY);
      return true;
    } catch (error) {
      console.error('Failed to disable biometric:', error);
      return false;
    }
  }

  // Check if biometric is enabled for the app
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(this.BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Failed to check biometric status:', error);
      return false;
    }
  }

  // Get stored credentials for biometric login
  static async getBiometricCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const credentials = await SecureStore.getItemAsync(this.BIOMETRIC_CREDENTIALS_KEY);
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Failed to get biometric credentials:', error);
      return null;
    }
  }

  // Login with biometric authentication
  static async biometricLogin(): Promise<{ success: boolean; credentials?: { email: string; password: string }; error?: string }> {
    try {
      const isEnabled = await this.isBiometricEnabled();
      if (!isEnabled) {
        return {
          success: false,
          error: 'Biometric login is not enabled'
        };
      }

      const authResult = await this.authenticate('Use biometric to sign in');
      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error
        };
      }

      const credentials = await this.getBiometricCredentials();
      if (!credentials) {
        return {
          success: false,
          error: 'No stored credentials found'
        };
      }

      return {
        success: true,
        credentials
      };
    } catch (error) {
      console.error('Biometric login failed:', error);
      return {
        success: false,
        error: 'Biometric login failed'
      };
    }
  }

  // Get user-friendly biometric type name
  private static getBiometricTypeName(types: LocalAuthentication.AuthenticationType[]): string {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Fingerprint';
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris';
    }
    return 'Biometric';
  }

  // Show biometric setup prompt
  static async promptBiometricSetup(onEnable: () => void): Promise<void> {
    const isAvailable = await this.isAvailable();
    const isEnabled = await this.isBiometricEnabled();
    
    if (isAvailable && !isEnabled) {
      const supportedTypes = await this.getSupportedBiometrics();
      const biometricType = this.getBiometricTypeName(supportedTypes);
      
      Alert.alert(
        `Enable ${biometricType}`,
        `Would you like to enable ${biometricType} for faster and more secure login?`,
        [
          { text: 'Not Now', style: 'cancel' },
          { text: 'Enable', onPress: onEnable }
        ]
      );
    }
  }
}

export default BiometricService;
