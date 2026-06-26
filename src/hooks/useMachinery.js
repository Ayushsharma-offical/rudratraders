import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export const useMachinery = () => {
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'machinery'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMachinery(data);
    } catch (err) {
      console.error("Error fetching machinery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, []);

  return { machinery, loading, refetch: fetchMachinery };
};
