import React, {useState, useEffect} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Chats from "./Chats";
import "../../firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { mainShadow } from "../../components/ui/ShadowStyles";
import { setClubs } from "../../reducers/clubs";
import Maps from "./Map";
import Users from "./Users";
import NewChat from "../../screens/auth/NewChat";
import { ImageBackground, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from 'expo-font';


const Tab = createBottomTabNavigator();
const MainScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    // 'AA-Neon': require('../../fonts/AA-Neon.ttf'),
    'canis-minor': require('../../fonts/canisminor.ttf'),
  });
  const [clubs, setClubss] = useState()
  const dispatch = useDispatch();
  const user = useSelector(state=>state.user.userData)
  useEffect(()=>{
    const asFn=async()=>{
      const db = getFirestore();
      const q = query(
          collection(db, "club")
        );
        const querySnapshot = await getDocs(q);
        let clubs = [];
        await querySnapshot.forEach(async (doc) => {

        let document = doc.data();
        document.id= doc.id;
        clubs.push(document);

        setClubss(clubs);
        });

        await dispatch(
          setClubs({clubs: clubs})
        )

    }
    asFn()
  },[])
  useEffect(()=>{console.log('loaded')},[fontsLoaded])

  return (

    <Tab.Navigator

      screenOptions={{
        swipeEnabled: false,

        tabBarStyle: {
          zIndex:2,
          height:80,
          borderTopWidth: 0,
          backgroundColor:'#ffffff00',
          elevation:0,
          borderWidth:0
        },
      }}
    >
      <Tab.Screen
      name="Chats"
       component={Chats}
        options={{
          tabBarButton:(focused)=><TouchableOpacity
          onPress={()=>{navigation.navigate('Chats')}}

          style={{flex:1, justifyContent:'center'}}>
            <ImageBackground source={require('../../../assets/TabBar.png')}
              style={{opacity:focused.accessibilityState.selected?0.6:0,  position:'absolute', left:-40, bottom:0,  width:'120%', height:'120%'}}>
                </ImageBackground>
                <Text style={{alignSelf:'center',fontFamily:'canis-minor', color:'#f0f0f0', fontSize:24, textShadowColor:'#ffffff', textShadowRadius:focused.accessibilityState.selected?10:0, width:'100%', textAlign:'center', lineHeight:80}}>
                  чаты
                  </Text>
                  </TouchableOpacity>,

          headerShown:false,
           title:'Чаты'}} />

      <Tab.Screen
        name="Map"
        initialParams={{user:user}}
        component={Maps}

        options={{
          //tabBarShowLabel:false,

          tabBarButton:(focused)=><TouchableOpacity
          onPress={()=>{navigation.navigate('Map')}}
          style={{flex:1, justifyContent:'center'}}>
          <ImageBackground source={require('../../../assets/TabBar.png')}
            style={{opacity:focused.accessibilityState.selected?0.6:0,  position:'absolute', left:-40, bottom:0,  width:'120%', height:'120%'}}>
              </ImageBackground>
              <Text style={{alignSelf:'center',fontFamily:'canis-minor', color:'#f0f0f0', fontSize:24, textShadowColor:'#ffffff', textShadowRadius:focused.accessibilityState.selected?10:0, width:'100%', textAlign:'center', lineHeight:80}}>
                клубы
                </Text>
                </TouchableOpacity>,
          headerShown:false,
          title: "Клубы" }}
      />

    </Tab.Navigator>

  );
};

export default MainScreen;
