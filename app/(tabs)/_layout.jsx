import CustomDrawerContent from "@/components/CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveBackgroundColor: '#5363df',
          drawerActiveTintColor: '#fff',
        }}
      >
        <Drawer.Screen 
          name="home" 
          options={{
            drawerLabel: 'Quản lý phòng',
            headerTitle: 'Quản lý phòng',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="tenants" 
          options={{
            drawerLabel: 'Quản lý người thuê',
            headerTitle: 'Quản lý người thuê',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="payments" 
          options={{
            drawerLabel: 'Thanh toán',
            headerTitle: 'Thanh toán',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="card-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="paymentHistory" 
          options={{
            drawerLabel: 'Lịch sử thanh toán',
            headerTitle: 'Lịch sử thanh toán',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="revenue" 
          options={{
            drawerLabel: 'Doanh thu',
            headerTitle: 'Thống kê doanh thu',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="profile" 
          options={{
            drawerLabel: 'Tài khoản',
            headerTitle: 'Thông tin tài khoản',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-line-outline" size={size} color={color} />
            ),
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
