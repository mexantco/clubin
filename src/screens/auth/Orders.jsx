import { StyleSheet, Text, View, FlatList, ImageBackground } from "react-native";
import React from "react";
import { Avatar, Divider, TouchableRipple } from "react-native-paper";
import { chats as dummyChats } from "../../seeds/DummyData";
import { useState } from "react";
import { mainShadow } from "../../components/ui/ShadowStyles";
import "../../firebase/config";
import { collection, query, where, getDocs, addDoc, onSnapshot  } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {getUserDataById} from '../../utils/user'
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";


const statuses = {
    0:'Передан в бар',
    1:'В работе',
    2:'Готов к выдаче',
    3:'Получен',
}
const People = ({ navigation,people, index }) => {
    const uData = useSelector((state) => state.user.userData);
   if(people.uid==uData.uid){return false}

   let [fontsLoaded] = useFonts({
    'Gilroy-Light': require('../../fonts/Gilroy-Light.otf'),
    'Gilroy-ExtraBold': require('../../fonts/Gilroy-ExtraBold.otf'),
    'Gilroy-Regular': require('../../fonts/Gilroy-Regular.ttf'),
    'Gilroy-Semibold': require('../../fonts/Gilroy-Semibold.ttf'),
   });
  // console.log(uData.name);
  return (
    <>
      <View style={{backgroundColor:!index % 2 === 0?'#ffffff20':'#ffffff00'}}>
        <TouchableRipple
          onPress={()=>{}}
          rippleColor="#a6a6a652"
        >
          <View style={styles.innerChatCard}>
            <View style={{ flex: 1, flexDirection: "row" }}>

              <View style={{ width:'90%', marginStart: 10, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <Text style={{ fontSize: 16, fontFamily: "Gilroy-Regular", alignSelf:'center', color:'#ffffff' }}>
                   {people.name}
                </Text>
                <Text style={{ color:'#ffffff', fontFamily: "Gilroy-Regular"}}>{statuses[people.status]}</Text>
              </View>
            </View>
            {/* <Text style={{ color: "#aeaeae", fontFamily: "Inter_500Medium" }}>
              {index}
            </Text> */}
          </View>
        </TouchableRipple>
      </View>
      </>
  );
};

const Orders = ({navigation, route}) => {


  const [people, setUsers] = useState();
  console.log(people)
  const uData = useSelector((state) => state.user.userData);
  useEffect(()=>{
    const asFn= async ()=>{
    const db = getFirestore();
    const q = query(
    collection(db, "orders")
    ,where("from", "==", uData.uid)
    );
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {

        let users = [];
        await querySnapshot.forEach(async (doc) => {

 let document = doc.data();

users.push(document);

// console.log(users)

});
setUsers(users);
      });





    }

    asFn();
  },[])

  // const [chats, setChats] = useState(dummyChats);
  // console.log(chats2);
  return (
    <ImageBackground
    source={require("../../../assets/wallBright.jpg")}
     style={{flex:1}}>
    <View

      style={{
        marginHorizontal:15,
        ...mainShadow,
        flex: 1,
        backgroundColor: "#ffffff10",
        elevation:0,
        marginTop: 30,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        overflow: "hidden",
      }}
    >
       <LinearGradient
      colors={['#f9f9f9', '#bbbbff60','#bbbbff20','#bbbbff10','#ffffff00','#ffffff00','#ffffff00','#ffffff00']}
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
      {uData.club!=''?(<><FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={people}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => <People people={item} index={index+1} navigation={navigation} />}
      /></>):(<><Text>Вы должны быть в клубе что бы посмотреть кто из пользователей тоже в клубе.</Text></>)}

    </View>
    </ImageBackground>
  );
};

export default Orders;

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
