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
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from 'expo-blur';


const Chat = ({ userData,navigation,chat, index }) => {
  const dispatch = useDispatch();
  const firestore = getFirestore();
  let [fontsLoaded] = useFonts({
   'Gilroy-Light': require('../../fonts/Gilroy-Light.otf'),
   'Gilroy-ExtraBold': require('../../fonts/Gilroy-ExtraBold.otf'),
  });
  // console.log(chat)
  // console.log(uData.name);
  return (
    <>
      <View
      style={{backgroundColor:index % 2 === 0?'#ffffff20':'#ffffff00', marginVertical:5}}
      >
        <TouchableRipple
          onPress={()=>{navigation.navigate('Chat', {userData, unr:chat.unr})}}
          rippleColor="#a6a6a652"
        >
          <View style={styles.innerChatCard}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Avatar.Image size={60} source={{ uri: userData.photo }} />
              <View style={{ marginStart: 10, flexGrow:1 }}>
                <Text style={{ color:'#f0f0f0' ,fontSize: 16, fontFamily: "Gilroy-ExtraBold" }}>
                   {chat.name}
                </Text>
                <Text
                  style={{
                    color: "#f0f0f0",
                    fontFamily: "Gilroy-Light",
                    marginTop: 10,
                  }}
                >
                  {chat.messages[(chat.messages.length-1)].text.substring(0, 20) + '...'}
                </Text>
              </View>
              <Text style={{alignSelf:'center'}}>{chat.unr>0?chat.unr:''}</Text>
            </View>
            {/* <Text style={{ color: "#aeaeae", fontFamily: "Inter_500Medium" }}>
              1 Day ago
            </Text> */}
          </View>
        </TouchableRipple>
      </View>
      </>
  );
};

const Chats = ({navigation}) => {

  const [chats2, setChats] = useState();
  const uData = useSelector((state) => state.user.userData);
  const chatssss = useSelector((state) => state.chats.chats);
   console.log(chatssss)
  useEffect(()=>{
    const asFn= async ()=>{
    const db = getFirestore();
    const q = query(
    collection(db, "chats"),
     where("users", "array-contains", uData.uid),
     where("messages", "!=", [])
    );
    //
const  unsubscribe = onSnapshot(q, (querySnapshot)=>{
  let chats3 = [];
  querySnapshot.forEach(async(doc)=>{

    let user;
    if(uData.uid!=doc.data().users[1]){
   user = await getUserDataById(doc.data().users[1])}
   else{
    user = await getUserDataById(doc.data().users[0])
   }
  //  console.log(user);
  let document = doc.data();
  let unRead = 0;
  document.messages.forEach(element => {
    if(element.unread==true&&element.sender_id==user.uid){unRead+=1}
  });
  document.unr = unRead;
  document.name = user.name;
  document.id = user.uid;
  document.photo = user.photos[0];
  // console.log(document);
  chats3.push(document);



  setChats(chats3);
  })
})



    }

    asFn();
  },[chatssss])

  // const [chats, setChats] = useState(dummyChats);
  //  console.log(chats2);
  return (

    <View

      style={{
        flex: 1,

        backgroundColor: "#ffffff00",
        marginTop: 30,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        overflow: "hidden",
      }}
    >
      <LinearGradient
      colors={['#f9f9f9', '#ffffff60','#ffffff20','#ffffff10','#ffffff00','#ffffff00','#ffffff00','#ffffff00']}
      style={{
        opacity:0.8,
        // ...mainShadow,
        position:'absolute',
        top:0,
        left:0,

        width:'100%',
        height:100,
        backgroundColor: "#ffffff00",

        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        overflow: "hidden",
      }}
    ></LinearGradient>
      <FlatList
        contentContainerStyle={{ paddingBottom: 30}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={chats2}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => <Chat chat={item} index={index} navigation={navigation} userData={{photo: item.photo, name: item.name, uid:item.id}}/>}
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
