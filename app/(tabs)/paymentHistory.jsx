import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

export default function PaymentHistoryDetailScreen() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, orderBy('date', 'desc'));

    // Lắng nghe thay đổi real-time từ collection 'payments'
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const paymentsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const payment = doc.data();
          const tenantRef = collection(db, 'tenants');
          const tenantSnapshot = await getDocs(
            query(tenantRef, where('roomNumber', '==', payment.roomNumber))
          );

          let tenantName = '';
          if (!tenantSnapshot.empty) {
            tenantName = tenantSnapshot.docs[0].data().name;
          }

          // Log để kiểm tra dữ liệu trả về
          console.log('Payment Data:', payment);
          console.log('Tenant Data:', tenantName);

          return {
            id: doc.id,
            amount: payment.amount,
            date: payment.date,
            note: payment.note,
            roomNumber: payment.roomNumber,
            tenantName,
          };
        })
      );

      setPayments(paymentsData); // Cập nhật dữ liệu thanh toán
    });

    // Hủy lắng nghe khi component unmount
    return () => unsubscribe();
  }, []);

  const formatDate = (date) => {
    return dayjs(date.toDate()).locale('vi').format('DD/MM/YYYY');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.roomNumber}>Phòng {item.roomNumber}</Text>
        <Text style={styles.amount}>{item.amount.toLocaleString()} VND</Text>
      </View>
      <Text style={styles.label}>
        Ngày thanh toán: <Text style={styles.value}>{formatDate(item.date)}</Text>
      </Text>
      {item.note ? (
        <Text style={styles.label}>
          Ghi chú: <Text style={styles.value}>{item.note}</Text>
        </Text>
      ) : null}
      <Text style={styles.label}>
        Người thuê: <Text style={styles.value}>{item.tenantName || 'Không rõ'}</Text>
      </Text>
      <Text style={styles.paymentId}>Mã giao dịch: {item.id}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử thanh toán</Text>
      <FlatList
        data={payments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d84315',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  value: {
    fontWeight: '500',
    color: '#333',
  },
  paymentId: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
