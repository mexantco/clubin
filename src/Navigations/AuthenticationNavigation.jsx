import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Chat from "../screens/auth/Chat";
import Club from "../screens/auth/Club";
import Staff from "../screens/auth/Staff";
import User from "../screens/auth/User";
import Orders from "../screens/auth/Orders";
import OrdersBar from "../screens/auth/OrdersBar";
import Settings from "../screens/auth/Settings";
import Users from "../screens/auth/Users";
import Profile from "../screens/auth/Profile";
import MainScreen from "../screens/auth/MainScreen";
import { Avatar } from "react-native-paper";
import TextInput from "../components/ui/TextInput";
import { AntDesign } from "@expo/vector-icons";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { mainShadow } from "../components/ui/ShadowStyles";
import ProfileSvg from "../../assets/ProfileSvg"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  onSnapshot,
  getFirestore,
  collection,
  query,
  where,
} from "firebase/firestore";
import { setChats } from "../reducers/chats";
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, StatusBar } from "react-native";
import  Animated, { Easing, Value, timing, Keyframe,useShared , useAnimatedStyle } from 'react-native-reanimated';
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";

const Stack = createStackNavigator();
const AuthenticationNavigation = () => {
  const [timerOut, setTimerout] = useState(true);
  const [timerOut2, setTimerout2] = useState(false);
  const userData = useSelector((state) => state.user.userData);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const firestore = getFirestore();

  const startAnimation = () => {
    timing(animatedValue, {
      toValue: 1,
      duration: 1000, // Длительность анимации в миллисекундах
      easing: Easing.inOut(Easing.ease),
    }).start();
  };
  const key2 = new Keyframe({
    0:{opacity:1, zIndex:1},
    82:{opacity:1, easing: Easing.exp, zIndex:1 },
    100:{opacity:0,  easing: Easing.exp, zIndex:-1},
  }).duration(2200);

  const key3 = new Keyframe({
    0:{zIndex:2},
    85:{ zIndex:2 },
    100:{zIndex:0},
  }).duration(2000);
  const keyframe = new Keyframe({
    0: {
      zIndex:2,
        opacity: 1
    },
    24.5: {
      opacity: 1
  },
    25: {
      opacity: 0,
      easing: Easing.exp,
  },
  // 26: {
  //   opacity: 1,
  //   // easing: Easing.exp,
// },
44.5: {
  opacity: 1
},
//     45: {
//         opacity: 0,
//         easing: Easing.exp,
//     },
//     47: {
//       opacity: 1,
//       easing: Easing.exp,
//   },
  49.7: {
    opacity: 1
},
  50: {
    opacity: 0,
    easing: Easing.exp,
},
60: {
  opacity: 1,
  // easing: Easing.exp,
},
70: {
  opacity: 0,
  easing: Easing.exp,
},
72: {
opacity: 1,
// easing: Easing.exp,
},
79.4: {
  opacity: 1
},
80: {
  opacity: 0,
  easing: Easing.exp,
},
82: {
opacity: 1,
zIndex:11,
// easing: Easing.exp,
},
    100: {
        opacity: 0,
        zIndex:-1,
        easing: Easing.exp,
    },
}).duration(2000);
  const auth = getAuth();
  useEffect(() => {
    if (auth?.currentUser) {
      const q = query(
        collection(firestore, "chats"),
        where("users", "array-contains", userData.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push(doc.data());
        });
        dispatch(
          setChats({
            chats: messages,
          })
        );
      });
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          unsubscribe();
        }
      });
    }
      // setTimeout(setTimerout2(true), 2100)
  }, [auth]);
  let [fontsLoaded] = useFonts({
    'Gilroy-Light': require('../fonts/Gilroy-Light.otf'),
    'Gilroy-ExtraBold': require('../fonts/Gilroy-ExtraBold.otf'),

    'Gilroy-Semibold': require('../fonts/Gilroy-Semibold.ttf'),
   });

  return (
    <ImageBackground
    source={require("../../assets/wallBright.jpg")}
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#000",
        paddingTop: 0,
        ...mainShadow,
      }}
    >
      <Animated.Image
      entering={key3}
      resizeMode="stretch"
      resizeMethod="resize"
      style={{height:90, width:250,position:'absolute',  left:0, top:20}}
      source={require("../../assets/neonBright.png")}
      />
      {!timerOut2?(<>
        <Animated.Image
        entering={key2}
      source={require("../../assets/wallDark.jpg")}
      style={{pointerEvents:'none', position:'absolute', top:0,  width:'100%', height:'100%'}}
    />
      </>):(<></>)}
      {true?(<>
        <Animated.View
          style={{pointerEvents:'none',position:'absolute', top:0, left:0, width:'100%', height:'100%'}}
          entering={keyframe}
        >
        <ImageBackground

        source={require("../../assets/wallDark.jpg")}
       style={{pointerEvents:'none',position:'absolute',  zIndex:12, top:0, left:0, width:'100%', height:'100%'}}
    >
      <Image
      resizeMode="stretch"
      resizeMethod="resize"
      style={{pointerEvents:'none',height:90,   width:250,position:'absolute', left:0, top:20}}
      source={require("../../assets/neonDark.png")}
      />
      </ImageBackground>
      </Animated.View>
      </>):(<></>)}
    <Stack.Navigator>
      {userData.role&&userData.role!=''?(<>
      <Stack.Screen name="OrdersBar" component={OrdersBar}
      options={{
        animationEnabled:false,
        title:'Заказы Бара',
        header:(props)=>(
          <BlurView intensity={30} tint="dark" style={{justifyContent:'center', alignItems:'center', backgroundColor:'#ffffff00', height:100}}><Text style={{fontSize:24, fontFamily:'Gilroy-Semibold',color:'#ffffff'}}>Заказы</Text></BlurView>
        )
      }}
      /></>):(<>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{

          header: (props) => (
            <View
              style={{
                backgroundColor:'transparent',
                marginHorizontal: 20,
                paddingTop: 20,
                height: 100,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    marginStart: 10,
                    fontSize: 20,
                    fontFamily: "Inter_500Medium",
                  }}
                >

                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                 <TouchableOpacity

                 onPress={()=>{navigation.navigate('Profile')}}>
                  <ProfileSvg/>
                  </TouchableOpacity>
                  {/* <IconButton
                    icon="logout"
                    size={25}
                    onPress={() => signOut(getAuth())}
                  /> */}
                </View>
              </View>
              {/* <View style={{ flex: 1, flexDirection: "row" }}>
                <TextInput
                  mode="flat"
                  label="Search connections"
                  icon={<AntDesign name="search1" size={24} color="grey" />}
                  style={{ borderRadius: 20, flex: 1 }}
                />
              </View> */}
            </View>
          ),
        }}
      />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="Orders" component={Orders}
      options={{
        animationEnabled:false,
        title:'Заказы',
        header:(props)=>(
          <BlurView intensity={30} tint="dark" style={{justifyContent:'center', alignItems:'center', backgroundColor:'#ffffff00', height:100}}><Text style={{fontSize:24, fontFamily:'Gilroy-Semibold',color:'#ffffff'}}>Заказы</Text></BlurView>
        )
      }}
      />
      <Stack.Screen name="Staff" component={Staff}
      options={{
        animationEnabled:false,
        header:(props)=>(
          <BlurView intensity={30} tint="dark" style={{justifyContent:'center', alignItems:'center', backgroundColor:'#ffffff00', height:100}}><Text style={{fontSize:24, fontFamily:'Gilroy-Semibold',color:'#ffffff'}}>Персонал клуба</Text></BlurView>
        )
      }}
      />
      <Stack.Screen name="Settings" component={Settings}
      options={{
        animationEnabled:false,
        header:(props)=>(
          <BlurView intensity={30} tint="dark" style={{justifyContent:'center', alignItems:'center', backgroundColor:'#ffffff00', height:100}}><Text style={{fontSize:24, fontFamily:'Gilroy-Semibold',color:'#ffffff'}}>Настройки профиля</Text></BlurView>
        )
      }}
      />
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
      <Stack.Screen
      options={{
        title:'',
        headerLeft: null,
        headerStyle:{
          backgroundColor:'transparent',
          elevation:0
        }
      }}
      name="Club" component={Club}/>
      </>)}

    </Stack.Navigator>
    </ImageBackground>
  );
};

export default AuthenticationNavigation;

const styles = StyleSheet.create({});
