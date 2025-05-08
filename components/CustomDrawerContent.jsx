import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useUserInfo from '../app/hooks/useUserInfo';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function CustomDrawerContent(props) {
  const router = useRouter();
  const { userName, email, phoneNumber, role, status } = useUserInfo();
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() => {
    // Lấy ảnh ngẫu nhiên từ API
    fetch('https://randomuser.me/api/')
      .then((response) => response.json())
      .then((data) => {
        setPhotoURL(data.results[0].picture.large);  // Lấy ảnh lớn
      })
      .catch((error) => console.error('Error fetching image:', error));
  }, []);

  const handleLogout = async () => {
    try {
      // Đăng xuất Firebase
      await signOut(auth);
      
      // Xóa thông tin người dùng từ AsyncStorage nếu có
      await AsyncStorage.removeItem('userInfo');  // Xóa dữ liệu người dùng

      // Điều hướng về màn hình đăng nhập
      router.replace('/login');
    } catch (error) {
      console.log('Error during logout', error);
    }
  };

  const handleUserPress = () => {
    router.push('/(tabs)/profile');  // Điều hướng đến màn hình Profile để người dùng thay đổi ảnh
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={true}
        contentContainerStyle={{
          backgroundColor: '#f0f4ff',
          borderTopRightRadius: 30,
          borderBottomRightRadius: 30,
          flexGrow: 1,  // Đảm bảo phần còn lại sẽ chiếm toàn bộ không gian
        }}
      >
        <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
          {/* Hiển thị ảnh ngẫu nhiên */}
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.userImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={80} color="#007bff" />
          )}
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          <Text style={styles.userDetail}>SĐT: {phoneNumber || 'Chưa cập nhật'}</Text>
          <Text style={styles.userDetail}>Vai trò: {role || 'Chưa có'}</Text>
          <Text style={styles.userDetail}>Trạng thái: {status || 'Không rõ'}</Text>
        </TouchableOpacity>

        <DrawerItemList {...props} />

        {/* Nút Đăng xuất */}
        <View style={styles.logoutWrapper}>
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            icon={() => <Ionicons name="log-out-outline" size={20} color="#fff" />}  
            style={styles.logoutButton}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 15,
    color: '#95a5a6',
    marginTop: 4,
  },
  logoutWrapper: {
    marginTop: 'auto',  // Đẩy nút logout xuống cuối
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 8,   // Giảm chiều cao nút
    paddingHorizontal: 24,  // Giảm chiều rộng nút
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
});
