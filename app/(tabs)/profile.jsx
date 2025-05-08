import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';  // Import useRouter
import { Picker } from '@react-native-picker/picker';  // Import Picker từ thư viện mới

export default function Profile() {
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('online');  // Default is online
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;
  const router = useRouter();  // Initialize useRouter

  useEffect(() => {
    if (!user) {
      // Nếu người dùng chưa đăng nhập, điều hướng đến màn hình đăng nhập
      if (!loading) {
        router.replace('/login');
      }
      return;
    }

    const fetchUser = async () => {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setDisplayName(data.displayName || '');
        setPhoneNumber(data.phoneNumber || '');
        setEmail(data.email || user.email || '');
        setRole(data.role || '');
        setStatus(data.status || 'online'); // Set status based on Firestore data
      } else {
        await setDoc(userRef, {
          displayName: '',
          phoneNumber: '',
          email: user.email || '',
          role: '',
          status: 'online', // Default status is online
          createdAt: serverTimestamp()
        });
        setEmail(user.email || '');
      }

      setLoading(false);
    };

    fetchUser();
  }, [user, router, loading]);  // Đảm bảo khi user thay đổi thì useEffect sẽ được chạy lại

  const handleSave = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
        role: role.trim(),  // Save the updated role
        status: status.trim(),  // Save the updated status
        updatedAt: serverTimestamp()
      });

      Alert.alert('Thành công', 'Thông tin đã được cập nhật.');
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>

      <Text style={styles.label}>Tên hiển thị</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Nhập tên hiển thị"
      />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <Text style={styles.readOnly}>{email}</Text>

      <Text style={styles.label}>Vai trò</Text>
      <TextInput
        style={styles.input}
        value={role}
        onChangeText={setRole}
        placeholder="Nhập vai trò"
      />

      <Text style={styles.label}>Trạng thái</Text>
      <Picker
        selectedValue={status}
        style={styles.picker}
        onValueChange={(itemValue) => setStatus(itemValue)}
      >
        <Picker.Item label="Online" value="online" />
        <Picker.Item label="Offline" value="offline" />
      </Picker>

      <Button title="Lưu thông tin" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  readOnly: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginBottom: 10,
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
  },
});
