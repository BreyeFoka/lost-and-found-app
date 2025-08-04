import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

// Image picker utility
export const pickImage = async (allowMultiple = false): Promise<string[]> => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to add images.'
      );
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: allowMultiple,
      allowsEditing: !allowMultiple,
      aspect: [4, 3],
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled) {
      return result.assets.map(asset => asset.uri);
    }
    
    return [];
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to pick image. Please try again.');
    return [];
  }
};

// Camera utility
export const takePhoto = async (): Promise<string | null> => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your camera to take photos.'
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'Failed to take photo. Please try again.');
    return null;
  }
};

// Show image picker options
export const showImagePickerOptions = (): Promise<string[]> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const photo = await takePhoto();
            resolve(photo ? [photo] : []);
          },
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const images = await pickImage(true);
            resolve(images);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve([]),
        },
      ],
      { cancelable: true, onDismiss: () => resolve([]) }
    );
  });
};
