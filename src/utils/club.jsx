import "../firebase/config";
import { collection, query, where, getDoc, addDoc, update, doc, updateDoc, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import { setClubs } from "../reducers/clubs";
import { useDispatch, useSelector } from "react-redux";

const db = getFirestore();
export const enterClub = async (uid, cid) => {
await updateDoc(doc(db, "users", uid),{club:cid});
}

export const exitClub = async (uid, cid) => {
  await updateDoc(doc(db, "users", uid),{club:''});

};

export const getClubDataById = async (cid) => {
  const firestore = getFirestore();
  const docRef = doc(firestore, "club", cid);
  const data = await getDoc(docRef);
  if (data) {
    return data.data();
  } else {
    return false;
  }
};

