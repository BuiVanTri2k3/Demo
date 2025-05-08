import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function RevenueScreen() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsCol = collection(db, 'payments');
        const snapshot = await getDocs(paymentsCol);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPayments(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu payments:', error);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    const filtered = payments.filter(payment => {
      if (!payment.date?.toDate) return false;
      const month = payment.date.toDate().getMonth() + 1;
      return month === selectedMonth;
    });

    setFilteredPayments(filtered);

    const total = filtered.reduce((sum, p) => sum + (p.amount || 0), 0);
    setTotalRevenue(total);
  }, [payments, selectedMonth]);

  const renderItem = ({ item }) => {
    const date = item.date?.toDate?.().toLocaleDateString('vi-VN') ?? 'Không rõ ngày';
    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Text style={styles.room}>Phòng: {item.roomNumber}</Text>
          <Text style={styles.tenant}>Người thuê: {item.tenantName || 'Không rõ'}</Text>
          <Text style={styles.date}>Ngày: {date}</Text>
        </View>
        <Text style={styles.amount}>+ {item.amount.toLocaleString()} đ</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doanh thu tháng {selectedMonth}</Text>
      <Text style={styles.total}>Tổng: {totalRevenue.toLocaleString()} đ</Text>

      <Picker
        selectedValue={selectedMonth}
        onValueChange={(value) => setSelectedMonth(value)}
        style={styles.picker}
      >
        {[...Array(12)].map((_, index) => (
          <Picker.Item key={index + 1} label={`Tháng ${index + 1}`} value={index + 1} />
        ))}
      </Picker>

      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6f8',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d84315',
    textAlign: 'center',
    marginBottom: 12,
  },
  picker: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
  },
  room: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  tenant: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
    marginLeft: 10,
  },
});
