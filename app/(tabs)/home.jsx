import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeRooms = onSnapshot(collection(db, 'rooms'), (querySnapshot) => {
      const roomsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomsData);
      setFilteredRooms(roomsData); // Set initial filtered rooms
    });

    const unsubscribeTenants = onSnapshot(collection(db, 'tenants'), (querySnapshot) => {
      const tenantsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTenants(tenantsData);
    });

    return () => {
      unsubscribeRooms();
      unsubscribeTenants();
    };
  }, []);

  const handleDeleteRoom = (roomId) => {
    Alert.alert(
      "Xác nhận xoá",
      "Bạn có chắc chắn muốn xoá phòng này?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'rooms', roomId));
              Alert.alert("Thành công", "Phòng đã được xoá.");
            } catch (error) {
              console.error("Lỗi khi xoá phòng:", error.message);
              Alert.alert("Lỗi", "Không thể xoá phòng. Vui lòng kiểm tra quyền hoặc kết nối mạng.");
            }
          }
        }
      ]
    );
  };

  const getRoomStatus = (room) => {
    const tenant = tenants.find(t => t.roomNumber === room.name);
    if (tenant) {
      return {
        status: 'Đã thuê',
        startDate: tenant.startDate,
        tenantName: tenant.name
      };
    }
    return { status: 'Còn trống', startDate: null, tenantName: null };
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    filterRooms(status);
  };

  const filterRooms = (status) => {
    let filtered = rooms;

    // Lọc theo trạng thái phòng
    if (status) {
      filtered = filtered.filter(room => {
        const roomStatus = getRoomStatus(room).status;
        return roomStatus === status;
      });
    }

    setFilteredRooms(filtered);
  };

  const renderItem = ({ item }) => {
    const roomStatus = getRoomStatus(item);

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imageURL }} style={styles.image} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>

        <Text style={[styles.status, { color: roomStatus.status === 'Đã thuê' ? '#e74c3c' : '#2ecc71' }]}>
          {roomStatus.status}
        </Text>

        {roomStatus.status === 'Đã thuê' && (
          <>
            <Text style={styles.tenant}>👤 Người thuê: {roomStatus.tenantName}</Text>
            <Text style={styles.date}>📅 Từ ngày: {roomStatus.startDate}</Text>
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push({ pathname: '../hooks/EditRoom', params: { id: item.id } })}
          >
            <Ionicons name="pencil" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteRoom(item.id)}
          >
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        <View style={styles.statusFilter}>
          <TouchableOpacity
            style={[styles.filterButton, selectedStatus === '' && styles.selectedFilterButton]}
            onPress={() => handleStatusFilter('')}
          >
            <Text style={styles.filterButtonText}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedStatus === 'Đã thuê' && styles.selectedFilterButton]}
            onPress={() => handleStatusFilter('Đã thuê')}
          >
            <Text style={styles.filterButtonText}>Đã thuê</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedStatus === 'Còn trống' && styles.selectedFilterButton]}
            onPress={() => handleStatusFilter('Còn trống')}
          >
            <Text style={styles.filterButtonText}>Còn trống</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('../hooks/AddRoom')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statusFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#dfe6e9',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFilterButton: {
    backgroundColor: '#0984e3',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    position: 'relative',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0984e3',
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tenant: {
    fontSize: 14,
    color: '#2d3436',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  editButton: {
    backgroundColor: '#6c5ce7',
    padding: 12,
    borderRadius: 50,
    elevation: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 50,
    elevation: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#fd79a8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
