import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase.js';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Đăng nhập thành công');
      router.replace('/(tabs)/home'); // Đưa người dùng tới trang Home sau khi đăng nhập thành công
    } catch (error) {
      alert('Đăng nhập thất bại: ' + error.message); // Hiển thị lỗi khi đăng nhập thất bại
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgotpassword');  // Đảm bảo rằng đường dẫn là đúng
  };
  
  return (
    <LinearGradient
      colors={['#A9D5D3', '#F8E0D5', '#F0C9B2']} // Gradient màu pastel nhẹ, tươi mát
      style={styles.container}
    >
      <Text style={styles.title}>Đăng nhập</Text>

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={24} color="#6F8E91" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={24} color="#6F8E91" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#6F8E91"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

 {/* Quên mật khẩu */}
<TouchableOpacity onPress={() => router.push('/forgotpassword')}>
  <Text style={styles.footerLink}>Quên mật khẩu?</Text>
</TouchableOpacity>


      <View style={styles.footer}>
        <Text style={styles.footerText}>Chưa có tài khoản?</Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.footerLink}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Họa tiết nền nhẹ nhàng */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 60,
    position: 'relative',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 50,
    color: '#3D4A56',
    fontFamily: 'Roboto',
    shadowColor: 'rgba(0, 0, 0, 0.1)', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#6F8E91',
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    height: 55,
    shadowColor: '#6F8E91',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    marginLeft: 10,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#3D4A56',
    fontFamily: 'Roboto',
  },
  button: {
    backgroundColor: '#6F8E91', // Đổi màu nút đăng nhập
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6F8E91',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#6F8E91',
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#3D4A56',
    fontFamily: 'Roboto',
  },
  footerLink: {
    fontSize: 16,
    color: '#6F8E91', 
    fontWeight: 'bold',
    marginLeft: 5,
    fontFamily: 'Roboto',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#ffffff80',
    zIndex: -1,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    left: -60,
    backgroundColor: '#A9D5D3',
  },
  circle2: {
    width: 250,
    height: 250,
    top: -80,
    right: -80,
    backgroundColor: '#F8E0D5',
  },
  circle3: {
    width: 180,
    height: 180,
    bottom: 100,
    left: -30,
    backgroundColor: '#F0C9B2',
  },
});
