import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Avatar, Divider, TouchableRipple } from "react-native-paper";
import { chats as dummyChats } from "../../seeds/DummyData";
import { useState } from "react";
import { mainShadow } from "../../components/ui/ShadowStyles";
import "../../firebase/config";
import { collection, query, where, getDocs, addDoc, onSnapshot,getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {getUserDataById} from '../../utils/user'
import { setChats } from "../../reducers/chats";


const Chat = ({ userData,navigation,chat }) => {
  const dispatch = useDispatch();
  const firestore = getFirestore();
  console.log(chat)
  // console.log(uData.name);
  return (
    <>
      <View>
        <TouchableRipple
          onPress={()=>{navigation.navigate('Chat', {userData})}}
          rippleColor="#a6a6a652"
        >
          <View style={styles.innerChatCard}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Avatar.Image size={60} source={{ uri: 'https://avatars.mds.yandex.net/get-kino-vod-films-gallery/28788/47e2fd514411e18b76af786d7417062d/380x240' }} />
              <View style={{ marginStart: 10 }}>
                <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold" }}>
                   {chat.name}
                </Text>
                <Text
                  style={{
                    color: "#aeaeae",
                    fontFamily: "Inter_500Medium",
                    marginTop: 10,
                  }}
                >
                  {chat.messages[(chat.messages.length-1).text]}
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

const Chats = ({navigation}) => {
  
  const [chats2, setChats] = useState();
  const uData = useSelector((state) => state.user.userData);
  const chatssss = useSelector((state) => state.chats.chats);
  // console.log(chatssss)
  useEffect(()=>{
    const asFn= async ()=>{
    const db = getFirestore();
    const q = query(
    collection(db, "chats"),
     where("users", "array-contains", uData.uid),
     where("messages", "!=", [])
    );
    //
const querySnapshot = await getDocs(q);
let chats3 = [];
await querySnapshot.forEach(async (doc) => {
  let user;
  if(uData.uid!=doc.data().users[1]){
 user = await getUserDataById(doc.data().users[1])}
 else{
  user = await getUserDataById(doc.data().users[0])
 }
//  console.log(user);
let document = doc.data();
document.name = user.name;
document.id = user.uid;
// console.log(document);
chats3.push(document);
  
  
  
setChats(chats3);
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
        data={chats2}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => <Chat chat={item} navigation={navigation} userData={{name: item.name, uid:item.id}}/>}
      />
    </View>
  );
};

export default Chats;

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
