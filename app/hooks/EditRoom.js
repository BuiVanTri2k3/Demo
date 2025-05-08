import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function EditRoom() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Yêu cầu quyền truy cập vào thư viện ảnh
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Ứng dụng không có quyền truy cập vào thư viện ảnh.');
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const roomDoc = await getDoc(doc(db, 'rooms', id));
        if (roomDoc.exists()) {
          const data = roomDoc.data();
          setName(data.name || '');
          setAddress(data.address || '');
          setDescription(data.description || '');
          setPrice(String(data.price) || '');
          setImageURL(data.imageURL || '');
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy thông tin phòng.');
          router.push('../'); // Điều hướng về trang home nếu không tìm thấy phòng
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin phòng:', error.message);
        Alert.alert('Lỗi', 'Không thể tải thông tin phòng. Vui lòng kiểm tra kết nối mạng.');
        router.push('../'); // Điều hướng về trang home nếu có lỗi
      }
    };

    if (id) {
      fetchRoomDetails();
    }
  }, [id, router]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpdateRoom = async () => {
    if (!name || !address || !description || !price) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
  
    if (isNaN(Number(price))) {
      Alert.alert('Lỗi', 'Giá phải là một số.');
      return;
    }
  
    setUploading(true);
    
    // Nếu người dùng chọn ảnh mới, dùng URL ảnh đó, nếu không giữ nguyên ảnh cũ
    const newImageURL = selectedImage || imageURL;
  
    try {
      await updateDoc(doc(db, 'rooms', id), {
        name: name,
        address: address,
        description: description,
        price: Number(price),
        imageURL: newImageURL, // Lưu URL ảnh vào Firestore
      });
  
      // Sau khi cập nhật, fetch lại dữ liệu để đảm bảo mọi thứ được cập nhật chính xác
      const roomDoc = await getDoc(doc(db, 'rooms', id));
      if (roomDoc.exists()) {
        const data = roomDoc.data();
        // Reset lại tất cả các state sau khi cập nhật thành công
        setName(data.name || '');
        setAddress(data.address || '');
        setDescription(data.description || '');
        setPrice(String(data.price) || '');
        setImageURL(data.imageURL || '');
      }
  
      setUploading(false);
      Alert.alert('Thành công', 'Thông tin phòng đã được cập nhật.', [
        { text: 'OK', onPress: () => router.push('../(tabs)/home') }, // Điều hướng về trang Home sau khi nhấn OK
      ]);
    } catch (error) {
      console.error('Lỗi khi cập nhật phòng:', error.message);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin phòng. Vui lòng kiểm tra quyền hoặc kết nối mạng.');
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('../(tabs)/home')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" style={styles.backIcon} />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          imageURL ? (
            <Image source={{ uri: imageURL }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={60} color="#888" />
              <Text style={{ color: '#888' }}>Chọn ảnh</Text>
            </View>
          )
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Tên phòng:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên phòng"
      />

      <Text style={styles.label}>Địa chỉ:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Nhập địa chỉ"
      />

      <Text style={styles.label}>Mô tả:</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Nhập mô tả"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Giá (VND):</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Nhập giá"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateRoom} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Đang cập nhật...' : 'Cập nhật phòng'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('../(tabs)/home')}>
        <Text style={styles.buttonText}>Hủy</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#006064',  // Màu nền đậm hơn cho nút quay lại
    padding: 10,
    borderRadius: 10,
  },
  backIcon: {
    marginRight: 10, // Khoảng cách giữa dấu quay lại và chữ
  },
  backText: {
    color: '#fff', // Màu chữ trắng
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#5363df',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  cancelButton: {
    backgroundColor: '#aaa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});
