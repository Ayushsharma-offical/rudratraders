import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query } from 'firebase/firestore';
import { MACHINERY as STATIC_MACHINERY } from '../data/machinery';

// Module-level cache — persists across page navigations (zero reload time)
let cachedMachinery = null;
let fetchPromise = null;

const buildFromStatic = () =>
  STATIC_MACHINERY.map(m => ({ ...m, id: String(m.id), stockQuantity: m.stockQuantity ?? 10 }));

const loadFromFirestore = async () => {
  try {
    const snap = await getDocs(query(collection(db, 'machinery')));
    if (snap.empty) {
      // Seed Firestore with static data
      const promises = STATIC_MACHINERY.map(({ id, ...rest }) =>
        addDoc(collection(db, 'machinery'), { ...rest, stockQuantity: 10 })
      );
      const refs = await Promise.all(promises);
      return refs.map((r, i) => ({ ...STATIC_MACHINERY[i], id: r.id, stockQuantity: 10 }));
    }
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn('Firestore unavailable, using static data:', err.message);
    return null; // null = use static
  }
};

export const useMachinery = () => {
  // Always start with static data for instant display
  const [machinery, setMachinery] = useState(cachedMachinery || buildFromStatic());
  const [loading, setLoading] = useState(!cachedMachinery);

  useEffect(() => {
    if (cachedMachinery) {
      setMachinery(cachedMachinery);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = loadFromFirestore();
    }

    fetchPromise.then(data => {
      if (data) {
        cachedMachinery = data;
        setMachinery(data);
      } else {
        // Firestore failed - use static, still functional
        cachedMachinery = buildFromStatic();
        setMachinery(cachedMachinery);
      }
      setLoading(false);
    });
  }, []);

  const refetch = () => {
    cachedMachinery = null;
    fetchPromise = null;
    const fresh = buildFromStatic();
    setMachinery(fresh);
    setLoading(true);

    fetchPromise = loadFromFirestore();
    fetchPromise.then(data => {
      cachedMachinery = data || buildFromStatic();
      setMachinery(cachedMachinery);
      setLoading(false);
    });
  };

  return { machinery, loading, refetch };
};
