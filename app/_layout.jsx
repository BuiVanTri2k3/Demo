import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import { ActivityIndicator, View, Text } from 'react-native';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    
    <Drawer
      screenOptions={{
        headerShown: false, // Hiện header (nếu muốn ẩn thì chỉnh false)
        drawerActiveTintColor: '#007AFF', // Màu item khi được chọn
        drawerLabelStyle: { fontFamily: 'outfit-medium', fontSize: 16 },
      }}
      
    >
      
      <Drawer.Screen name="manage-rooms" options={{ title: 'Quản lý phòng' }} />
      <Drawer.Screen name="manage-tenants" options={{ title: 'Quản lý người thuê phòng' }} />
      <Drawer.Screen name="calculate-rent" options={{ title: 'Tính tiền thuê' }} />
      <Drawer.Screen name="profile" options={{ title: 'Thông tin tài khoản' }} />
      <Drawer.Screen name="payment-history" options={{ title: 'Lịch sử thanh toán' }} />
      <Drawer.Screen name="revenue" options={{ title: 'Doanh thu' }} />
      <Drawer.Screen name="logout" options={{ title: 'Đăng xuất' }} />
    </Drawer>
  );
}
