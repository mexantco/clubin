import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Avatar, Divider, TouchableRipple } from "react-native-paper";
import { chats as dummyChats } from "../../seeds/DummyData";
import { useState } from "react";
import { mainShadow } from "../../components/ui/ShadowStyles";
import "../../firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {getUserDataById} from '../../utils/user'


const People = ({ navigation,people }) => {
    const uData = useSelector((state) => state.user.userData);
  if(people.uid==uData.uid){return false}
  
  // console.log(uData.name);
  return (
    <>
      <View>
        <TouchableRipple
          onPress={()=>{navigation.navigate('User', {people})}}
          rippleColor="#a6a6a652"
        >
          <View style={styles.innerChatCard}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Avatar.Image size={60} source={{ uri: people.photos[0] }} />
              <View style={{ marginStart: 10, flexDirection:'row' }}>
                <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", alignSelf:'center' }}>
                   {people.name}
                </Text>
                
              </View>
            </View>
            {/* <Text style={{ color: "#aeaeae", fontFamily: "Inter_500Medium" }}>
              1 Day ago
            </Text> */}
          </View>
        </TouchableRipple>
      </View>
      <Divider />
    </>
  );
};

const Users = ({navigation}) => {
  
  const [people, setUsers] = useState();
  const uData = useSelector((state) => state.user.userData);
  useEffect(()=>{
    const asFn= async ()=>{
    const db = getFirestore();
    const q = query(
    collection(db, "users")
    // ,where("users", "array-contains", uData.uid)
    );
const querySnapshot = await getDocs(q);
let users = [];
await querySnapshot.forEach(async (doc) => {
//   let user;
//   if(uData.uid!=doc.data().users[1]){
// let  user = await getUserDataById(doc.data())
//  else{
//   user = await getUserDataById(doc.data().users[0])
//  }
// //  console.log(user);
 let document = doc.data();
// document.name = user.name;
// document.id = user.uid;
// console.log(document);
users.push(document);
  
  // console.log(doc.data())
  // console.log(chats3);
setUsers(users);
});


    }

    asFn();
  },[])
  
  // const [chats, setChats] = useState(dummyChats);
  // console.log(chats2);
  return (
    <View
      style={{
        ...mainShadow,
        flex: 1,
        backgroundColor: "white",
        marginTop: 30,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        overflow: "hidden",
      }}
    >
      <FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={people}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => <People people={item} navigation={navigation} />}
      />
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  outerChatCard: {
    backgroundColor: "white",
    borderRadius: 24,
  },
  innerChatCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    padding: 20,
  },
});
