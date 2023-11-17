import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Chats from "./Chats";
import Maps from "./Map";
import Users from "./Users";
import NewChat from "../../screens/auth/NewChat";
const Tab = createMaterialTopTabNavigator();
const MainScreen = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderBottomStartRadius: 25,
          borderBottomEndRadius: 25,
          overflow: "hidden",
        },
      }}
    >
      <Tab.Screen name="Chats" component={Chats} />
      <Tab.Screen
        name="Users"
        component={Users}
        options={{ title: "Люди в клубе" }}
      />
      <Tab.Screen
        name="Map"
        component={Maps}
        options={{ title: "Клубы" }}
      />
     
    </Tab.Navigator>
  );
};

export default MainScreen;
