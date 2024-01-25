import { View, Text } from 'react-native'
import React from 'react'
import Users from "./Users";
import Bar from "./Bar";
import ClubInfo from "./ClubInfo"
import { useFonts } from 'expo-font';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();
const Club = ({route, navigation}) => {
  const [fontsLoaded] = useFonts({
    // 'AA-Neon': require('../../fonts/AA-Neon.ttf'),
    'canis-minor': require('../../fonts/canisminor.ttf'),
    'Gilroy-Light': require('../../fonts/Gilroy-Light.otf'),
    'Gilroy-ExtraBold': require('../../fonts/Gilroy-ExtraBold.otf'),
  });
  const club = route.params.club;
  console.log(club);
    return (
        <Tab.Navigator

          screenOptions={{
            tabBarActiveTintColor:'white',
            tabBarInactiveTintColor:'#f0f0f090',
            tabBarLabelStyle:{
              fontFamily:'Gilroy-Light'
            },
            tabBarStyle: {

              backgroundColor:'transparent',
              elevation:0,
              borderBottomStartRadius: 25,
              borderBottomEndRadius: 25,
              overflow: "hidden",
            },
          }}
        >
          <Tab.Screen
          name="ClubInfo"
          initialParams={{club:club}}
          component={ClubInfo}
          options={{

            title: "Главная" }}
          />

          <Tab.Screen
            initialParams={{clubName:club.name}}
            name="Users"
            component={Users}
            options={{
              title: "Люди в клубе: ",
           }}
          />
          <Tab.Screen
            initialParams={{clubId:club.cid, clubOwner:club.owner}}
            name="Bar"
            component={Bar}
            options={{
              title: "Бар",
           }}
          />

        </Tab.Navigator>
      );
}

export default Club