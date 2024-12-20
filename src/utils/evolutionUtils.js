import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const db = getFirestore();

const user = localStorage.getItem('firebaseId');

export const increaseEvolution = async (userId, incrementValue = 1) => {
  try {
    const userRef = doc(db, 'users', user);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentEvolution = userData.evolution || 0;
      await updateDoc(userRef, {
        evolution: currentEvolution + incrementValue,
      });
    } else {
    }
  } catch (error) {}
};

export const decreaseEvolution = async (userId, decrementValue = 1) => {
  try {
    const userRef = doc(db, 'users', user);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentEvolution = userData.evolution || 0;
      const newEvolution = currentEvolution - decrementValue;
      await updateDoc(userRef, {
        evolution: newEvolution >= 0 ? newEvolution : 0,
      });
    } else {
    }
  } catch (error) {}
};
