import { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, get, set } from 'firebase/database';
import { MACHINERY as STATIC_MACHINERY } from '../data/machinery';

// Module-level cache for instant navigation
let cachedMachinery = null;

const buildFromStatic = () =>
  STATIC_MACHINERY.map(m => ({ ...m, id: String(m.id), stockQuantity: m.stockQuantity ?? 10 }));

// Convert RTDB object to array
const objToArray = (obj) => {
  if (!obj) return [];
  return Object.keys(obj).map(key => ({ ...obj[key], id: key }));
};

const loadFromRTDB = async () => {
  try {
    const snapshot = await get(ref(rtdb, 'machinery'));
    if (!snapshot.exists()) {
      // Seed the database with static data
      const seedData = {};
      STATIC_MACHINERY.forEach(m => {
        const key = `machine_${m.id}`;
        const { id, ...rest } = m;
        seedData[key] = { ...rest, stockQuantity: 10 };
      });
      await set(ref(rtdb, 'machinery'), seedData);
      return Object.keys(seedData).map(key => ({ ...seedData[key], id: key }));
    }
    return objToArray(snapshot.val());
  } catch (err) {
    console.warn('RTDB error, using static data:', err.message);
    return null;
  }
};

export const useMachinery = () => {
  const [machinery, setMachinery] = useState(cachedMachinery || buildFromStatic());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cachedMachinery) {
      setMachinery(cachedMachinery);
      return;
    }

    let cancelled = false;
    loadFromRTDB().then(data => {
      if (cancelled) return;
      if (data && data.length > 0) {
        cachedMachinery = data;
        setMachinery(data);
      } else {
        cachedMachinery = buildFromStatic();
        setMachinery(cachedMachinery);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const refetch = () => {
    cachedMachinery = null;
    setMachinery(buildFromStatic());
    setLoading(true);
    loadFromRTDB().then(data => {
      cachedMachinery = data && data.length > 0 ? data : buildFromStatic();
      setMachinery(cachedMachinery);
      setLoading(false);
    });
  };

  return { machinery, loading, refetch };
};
