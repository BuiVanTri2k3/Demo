import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase.js'; // Import cấu hình Firebase

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  // Giữ lại dấu mũi tên quay lại, nhưng ẩn toàn bộ chữ
  ForgotPasswordScreen.options = {
    headerShown: true, // Hiển thị header
    headerTitle: '',  // Ẩn tiêu đề
    headerBackTitleVisible: false, // Ẩn chữ ở nút quay lại
  };

  const handleResetPassword = async () => {
    try {
      // Gửi yêu cầu reset mật khẩu qua email
      await sendPasswordResetEmail(auth, email);
      alert('Đã gửi email reset mật khẩu. Vui lòng kiểm tra email của bạn!');
      router.replace('/login');  // Quay lại màn hình đăng nhập
    } catch (error) {
      // Xử lý lỗi
      if (error.code === 'auth/user-not-found') {
        alert('Không tìm thấy người dùng với email này!');
      } else {
        alert('Đã có lỗi xảy ra, vui lòng thử lại!');
      }
      console.error(error.message);  // In thông báo lỗi chi tiết ra console
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quên mật khẩu?</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#B0B0B0"  // Màu placeholder nhẹ nhàng
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/login')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Quay lại trang đăng nhập</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f7f9fc',  // Màu nền sáng, dễ nhìn
    paddingVertical: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    color: '#2C3E50',
    textShadowColor: '#BDC3C7',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 55,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#d1d1d6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#495057',
    paddingLeft: 10,
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#1ABC9C',  // Màu xanh lá biển nổi bật
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#16A085',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#1ABC9C',  // Màu xanh lá biển nổi bật
    fontSize: 16,
    fontWeight: '600',
  },
});
