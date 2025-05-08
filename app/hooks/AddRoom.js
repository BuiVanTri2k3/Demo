import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useRouter } from 'expo-router';

export default function AddRoom() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const [price, setPrice] = useState('');
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Bạn cần cấp quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageURL(result.assets[0].uri);
    }
  };

  const handleAddRoom = async () => {
    if (!name || !address || !description || !imageURL || !price) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await addDoc(collection(db, 'rooms'), {
        name,
        address,
        description,
        imageURL,
        price: parseFloat(price),
      });

      Alert.alert('Thành công', 'Phòng đã được thêm');

      // Reset form
      setName('');
      setAddress('');
      setDescription('');
      setImageURL(null);
      setPrice('');

      // 👉 Quay về trang Home sau khi thêm
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Phòng</Text>
      <TextInput
        placeholder="Tên phòng"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Địa chỉ"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textArea]}
        multiline
      />
      <TextInput
        placeholder="Giá"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Chọn ảnh</Text>
      </TouchableOpacity>

      {imageURL && <Image source={{ uri: imageURL }} style={styles.preview} />}

      <View style={styles.buttonContainer}>
        <Button title="Thêm phòng" onPress={handleAddRoom} color="#6200EE" />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Quay lại"
          onPress={() => router.replace('/(tabs)/home')}
          color="#9E9E9E"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#6200EE',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 10,
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  buttonContainer: {
    marginVertical: 10,
  },
});
