import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LostItemsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lost Items</Text>
    </View>
  );
};

const FoundItemsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Found Items</Text>
    </View>
  );
};

const ChatRoomsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Rooms</Text>
    </View>
  );
};

const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
    </View>
  );
};

const AddItemScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Item</Text>
    </View>
  );
};

const ItemDetailsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Item Details</Text>
    </View>
  );
};

const ChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat</Text>
    </View>
  );
};

const EditProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export { 
  LostItemsScreen, 
  FoundItemsScreen, 
  ChatRoomsScreen, 
  ProfileScreen, 
  AddItemScreen, 
  ItemDetailsScreen, 
  ChatScreen, 
  EditProfileScreen 
};
