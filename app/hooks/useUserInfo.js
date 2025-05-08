// hooks/useUserInfo.js
import { useState, useEffect } from 'react';
import { auth, db } from '../../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function useUserInfo() {
  const [userName, setUserName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserName(data.displayName || '');
        setPhotoURL(data.photoURL || '');
        setEmail(data.email || user.email || '');
        setPhoneNumber(data.phoneNumber || '');
        setRole(data.role || '');
        setStatus(data.status || '');
      }
    }, (error) => {
      console.log('Error in realtime listener:', error);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  return { userName, photoURL, email, phoneNumber, role, status };
}
