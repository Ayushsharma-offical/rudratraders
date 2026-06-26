import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query } from 'firebase/firestore';
import { MACHINERY as STATIC_MACHINERY } from '../data/machinery';

// Module-level cache so data persists across page navigations
let cachedMachinery = null;
let isFetching = false;
const listeners = [];

const notifyListeners = (data) => {
  listeners.forEach(fn => fn(data));
};

const seedDatabase = async () => {
  try {
    const entries = STATIC_MACHINERY.map(m => ({
      ...m,
      stockQuantity: 10,
      id: undefined,
    }));
    const promises = entries.map(m => {
      const { id, ...rest } = m;
      return addDoc(collection(db, 'machinery'), rest);
    });
    await Promise.all(promises);
    console.log('Database seeded successfully');
    return true;
  } catch (err) {
    console.error('Seeding failed:', err);
    return false;
  }
};

const fetchFromDB = async () => {
  if (isFetching) return;
  isFetching = true;
  try {
    const q = query(collection(db, 'machinery'));
    const snap = await getDocs(q);
    let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Auto-seed if Firestore is empty
    if (data.length === 0) {
      await seedDatabase();
      const snap2 = await getDocs(q);
      data = snap2.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    cachedMachinery = data;
    notifyListeners(data);
  } catch (err) {
    console.error('Error fetching machinery:', err);
    // Fallback to static data on error
    cachedMachinery = STATIC_MACHINERY.map(m => ({ ...m, id: String(m.id), stockQuantity: 10 }));
    notifyListeners(cachedMachinery);
  } finally {
    isFetching = false;
  }
};

export const useMachinery = () => {
  const [machinery, setMachinery] = useState(cachedMachinery || []);
  const [loading, setLoading] = useState(!cachedMachinery);

  useEffect(() => {
    if (cachedMachinery) {
      setMachinery(cachedMachinery);
      setLoading(false);
      return;
    }

    const handler = (data) => {
      setMachinery(data);
      setLoading(false);
    };
    listeners.push(handler);

    if (!isFetching) {
      fetchFromDB();
    }

    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const refetch = async () => {
    cachedMachinery = null;
    setLoading(true);
    await fetchFromDB();
    setMachinery(cachedMachinery || []);
    setLoading(false);
  };

  return { machinery, loading, refetch };
};
