import "../firebase/config";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
export const getUserDataById = async (userId) => {
  const firestore = getFirestore();
  const docRef = doc(firestore, "users", userId);
  const userData = await getDoc(docRef);
  if (userData) {
    return userData.data();
  } else {
    return false;
  }
};
export const getUserDataByName = async (username) => {
  const firestore = getFirestore();
  const q = query(
    collection(firestore, "users"),
    where("name", "==", username)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0) {
    return querySnapshot.docs[0].data();
  } else {
    return false;
  }
};
