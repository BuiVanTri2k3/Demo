import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  return (
    <LinearGradient
      colors={['#f0f8ff', '#e6e8f1']} // Gradient dịu nhẹ, hài hòa
      style={styles.container}
    >
      {/* Họa tiết nền với hiệu ứng mềm mại */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
      <View style={[styles.circle, styles.circle4]} />

      {/* Ảnh minh họa đẹp mắt */}
      <Image
        source={{ uri: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600' }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Card nội dung chính */}
      <BlurView intensity={95} tint="light" style={styles.blurCard}>
        <Text style={styles.title}>Chào mừng bạn đến với ứng dụng quản lý phòng trọ</Text>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Bắt đầu ngay</Text>
          </TouchableOpacity>
        </Link>
      </BlurView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: width * 0.9,
    height: width * 0.7,
    marginBottom: 15,
    borderRadius: 20,
    zIndex: 1,
    opacity: 0.85, // Mờ nhẹ để không gây phân tâm
  },
  blurCard: {
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Màu trắng trong suốt
    zIndex: 1,
    borderWidth: 3, // Viền màu vàng đậm
    borderColor: '#FF8C00', // Màu cam đậm tạo điểm nhấn
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  title: {
    fontSize: 24, // Kích thước chữ vừa phải
    fontWeight: '700', // Đậm
    color: '#2e3d49', // Màu xanh đậm thanh thoát
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1.5, // Khoảng cách giữa các chữ
    lineHeight: 32, // Khoảng cách giữa các dòng
    fontFamily: 'Roboto', // Font chữ dễ đọc
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#5e5c7f',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 24,
    fontFamily: 'Arial',
  },
  button: {
    backgroundColor: '#FF8C00', // Màu cam đậm dễ nhìn
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  buttonText: {
    color: '#ffffff', // Màu chữ trắng nổi bật
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1, // Tăng khoảng cách giữa các chữ cái
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#ffffff25',
  },
  circle1: {
    width: 180,
    height: 180,
    top: -50,
    left: -60,
    backgroundColor: '#ffcc99', // Họa tiết màu nhẹ nhàng
  },
  circle2: {
    width: 220,
    height: 220,
    top: -80,
    right: -90,
    backgroundColor: '#ffffff33',
  },
  circle3: {
    width: 150,
    height: 150,
    bottom: 150,
    left: -40,
    backgroundColor: '#e3f2fd', // Màu nhẹ nhàng, hài hòa
  },
  circle4: {
    width: 250,
    height: 250,
    bottom: -120,
    right: -100,
    backgroundColor: '#ffffff1a',
  },
});

export default WelcomeScreen;
