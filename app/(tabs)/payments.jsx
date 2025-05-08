import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { db } from '../../config/firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

export default function PaymentScreen() {
  const [tenantId, setTenantId] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [tenants, setTenants] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Lắng nghe thay đổi real-time từ collection 'tenants'
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tenants'), (snapshot) => {
      const tenantList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTenants(tenantList);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectTenant = (tenant) => {
    setTenantId(tenant.id);
    setTenantName(tenant.name);
    setRoomNumber(tenant.roomNumber);
  };

  const handlePayment = async () => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Số tiền không hợp lệ', 'Vui lòng nhập số tiền hợp lệ.');
      return;
    }

    if (!tenantId || !tenantName || !roomNumber) {
      Alert.alert('Thông tin không đầy đủ', 'Vui lòng chọn người thuê và phòng.');
      return;
    }

    try {
      await addDoc(collection(db, 'payments'), {
        tenantId,
        tenantName,
        roomNumber,
        amount: numericAmount,
        date,
        note,
      });
      Alert.alert('Thành công', 'Đã ghi nhận thanh toán.');

      setTenantId('');
      setTenantName('');
      setRoomNumber('');
      setAmount('');
      setDate(new Date());
      setNote('');
    } catch (err) {
      console.error('Lỗi ghi dữ liệu:', err);
      Alert.alert('Lỗi', 'Không thể lưu thanh toán.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo thanh toán</Text>

      <Text style={styles.label}>Chọn người thuê:</Text>
      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tenantButton,
              tenantId === item.id && styles.selectedTenant,
            ]}
            onPress={() => handleSelectTenant(item)}
          >
            <Text style={styles.tenantText}>
              {item.name} ({item.roomNumber})
            </Text>
          </TouchableOpacity>
        )}
        style={styles.tenantList}
      />

      <TextInput
        placeholder="Số tiền"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePicker}
      >
        <Text style={{ color: '#000' }}>
          Ngày thanh toán: {dayjs(date).format('DD/MM/YYYY')}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TextInput
        placeholder="Ghi chú (tuỳ chọn)"
        value={note}
        onChangeText={setNote}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handlePayment}>
        <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    fontWeight: '600',
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tenantList: {
    maxHeight: 220,
    marginVertical: 10,
  },
  tenantButton: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#90caf9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTenant: {
    backgroundColor: '#a5d6a7',
    borderColor: '#66bb6a',
  },
  tenantText: {
    fontSize: 16,
    color: '#222',
  },
  datePicker: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButton: {
    marginTop: 16,
    backgroundColor: '#388e3c',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
