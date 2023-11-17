import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Chat from "../screens/auth/Chat";
import User from "../screens/auth/User";
import Profile from "../screens/auth/Profile";
import MainScreen from "../screens/auth/MainScreen";
import { Avatar } from "react-native-paper";
import TextInput from "../components/ui/TextInput";
import { AntDesign } from "@expo/vector-icons";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
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

const Stack = createStackNavigator();
const AuthenticationNavigation = () => {
  const userData = useSelector((state) => state.user.userData);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const firestore = getFirestore();
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
  }, [auth]);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          header: (props) => (
            <View
              style={{
                marginHorizontal: 20,
                paddingTop: 20,
                height: 180,
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
                  Messages
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                 <TouchableOpacity
                 onPress={()=>{navigation.navigate('Profile')}}>
                  <Avatar.Image
                    size={38}
                    source={{
                      uri: userData?.photos
                        ? userData.photos[0]
                        : "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg",
                    }}
                    style={{ marginEnd: 10 }}
                  />
                  </TouchableOpacity>
                  <IconButton
                    icon="logout"
                    size={25}
                    onPress={() => signOut(getAuth())}
                  />
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <TextInput
                  mode="flat"
                  label="Search connections"
                  icon={<AntDesign name="search1" size={24} color="grey" />}
                  style={{ borderRadius: 20, flex: 1 }}
                />
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="Profile" component={Profile} />

    </Stack.Navigator>
  );
};

export default AuthenticationNavigation;

const styles = StyleSheet.create({});
