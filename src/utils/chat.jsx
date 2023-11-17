import "../firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
export const getChatBetweenTwo = async (uid, uid2) => {
  const db = getFirestore();
  let arr = [uid, uid2];
  let arr2 = [uid2, uid]; 
  const q = query(
    collection(db, "chats")
    ,where("users", "in", [arr,arr2])
    
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0) {
    return querySnapshot.docs[0];
  } else {
    // If chat doesn't exist, create it.
    await addDoc(collection(db, "chats"), {
      messages: [],
      users: [uid, uid2],
    });
    // return getChatBetweenTwo(uid, uid2);
  }
};
