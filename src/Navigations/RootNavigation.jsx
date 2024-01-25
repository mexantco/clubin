import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import GuestNavigation from "./GuestNavigation";
import AuthenticationNavigation from "./AuthenticationNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import {auth} from '../../src/firebase/config'


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};
import { useDispatch } from "react-redux";
import { setUserData } from "../reducers/user";
import { View,Text, Image, ImageBackground } from "react-native";


const RootNavigation = () => {
  const [user, setUser] = useState(null);
  // const auth = getAuth();
  const firestore = getFirestore();
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      // console.log("USER IS STILL LOGGED IN: " , user);
      if (user) {

        const docRef = doc(firestore, "users", user.uid);

        const userData = await getDoc(docRef);
        console.log(userData.data());
        dispatch(
          setUserData({
            userData: { ...userData.data(), uid: user.uid },
          })
        );

        setUser(user);

      } else {
        dispatch(
          setUserData({
            userData: {},
          })
        );
        setUser({});
      }
    });
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme}>
        {user==null?<ImageBackground

source={require("../../assets/wallDark.jpg")}
style={{pointerEvents:'none',position:'absolute', zIndex:9, top:0, left:0, width:'100%', height:'100%', justifyContent:'center',alignItems:'center'}}
>
<Image
resizeMode="stretch"
resizeMethod="resize"
style={{pointerEvents:'none',height:90, width:250,position:'absolute', left:0, top:20}}
source={require("../../assets/neonDark.png")}
/>
<Text style={{color:'#f0f0f0'}}></Text>
</ImageBackground>:user?.uid ? <AuthenticationNavigation /> : <GuestNavigation />}

      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RootNavigation;
