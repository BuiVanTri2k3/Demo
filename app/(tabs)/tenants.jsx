import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { db } from '../../config/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

export default function TenantsScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [tenants, setTenants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const tenantsCollection = collection(db, 'tenants');

  useEffect(() => {
    const unsubscribe = onSnapshot(tenantsCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTenants(data);
    });
    return () => unsubscribe();
  }, []);

  const updateRoomStatus = async (roomNumber) => {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('name', '==', roomNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('Không tìm thấy phòng có tên:', roomNumber);
      return;
    }

    for (const roomDoc of querySnapshot.docs) {
      const roomData = roomDoc.data();
      if (roomData.status !== 'rented') {
        await updateDoc(roomDoc.ref, { status: 'rented' });
        console.log(`Phòng ${roomNumber} đã cập nhật thành rented.`);
      }
    }
  };

  const updateRoomStatusToAvailable = async (roomNumber) => {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('name', '==', roomNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('Không tìm thấy phòng có tên:', roomNumber);
      return;
    }

    for (const roomDoc of querySnapshot.docs) {
      const roomData = roomDoc.data();
      if (roomData.status !== 'available') {
        await updateDoc(roomDoc.ref, { status: 'available', tenantId: null });
        console.log(`Phòng ${roomNumber} đã cập nhật thành available.`);
      }
    }
  };

  const checkRoomExistence = async (roomNumber) => {
    const roomsRef = collection(db, 'rooms');
    const q = query(roomsRef, where('name', '==', roomNumber));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async () => {
    if (!name || !phone || !roomNumber || !startDate) {
      Alert.alert('Vui lòng nhập đầy đủ các trường bắt buộc.');
      return;
    }

    const roomExists = await checkRoomExistence(roomNumber);
    if (!roomExists) {
      Alert.alert('Phòng không tồn tại trong hệ thống.');
      return;
    }

    const tenantData = {
      name,
      phone,
      roomNumber,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      notes,
    };

    if (editingId) {
      const tenantDoc = doc(db, 'tenants', editingId);
      await updateDoc(tenantDoc, tenantData);
      setEditingId(null);
    } else {
      await addDoc(tenantsCollection, tenantData);
      await updateRoomStatus(roomNumber);
    }

    setName('');
    setPhone('');
    setRoomNumber('');
    setStartDate(new Date());
    setNotes('');
  };

  const handleEdit = (tenant) => {
    setName(tenant.name);
    setPhone(tenant.phone);
    setRoomNumber(tenant.roomNumber);
    setStartDate(dayjs(tenant.startDate).toDate());
    setNotes(tenant.notes || '');
    setEditingId(tenant.id);
  };

  const handleDelete = async (id, roomNumber) => {
    await deleteDoc(doc(db, 'tenants', id));
    await updateRoomStatusToAvailable(roomNumber);
  };

  const renderTenant = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>👤 {item.name}</Text>
      <Text>📞 {item.phone}</Text>
      <Text>🏠 Phòng: {item.roomNumber}</Text>
      <Text>📅 Ngày vào: {item.startDate}</Text>
      {item.notes ? <Text>📝 Ghi chú: {item.notes}</Text> : null}
      <View style={styles.actions}>
        <Button title="Sửa" onPress={() => handleEdit(item)} color="#4CAF50" />
        <Button title="Xoá" onPress={() => handleDelete(item.id, item.roomNumber)} color="red" />
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Quản lý người thuê</Text>

          <TextInput
            placeholder="Tên người thuê"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Số phòng"
            value={roomNumber}
            onChangeText={setRoomNumber}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
            <Text style={{ color: '#6200EE', fontWeight: 'bold' }}>
              Ngày bắt đầu thuê: {dayjs(startDate).format('DD/MM/YYYY')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}

          <TextInput
            placeholder="Ghi chú (tuỳ chọn)"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            multiline
          />

          <Button title={editingId ? 'Cập nhật' : 'Thêm'} onPress={handleSubmit} color="#6200EE" />
        </View>
      }
      data={tenants}
      keyExtractor={(item) => item.id}
      renderItem={renderTenant}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f0f0' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6200EE',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  datePicker: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
