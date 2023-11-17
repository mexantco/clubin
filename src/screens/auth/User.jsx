import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/ui/Button";
import { mainShadow } from "../../components/ui/ShadowStyles";


const User = ({route}) => {
  const navigation = useNavigation();
//   const showSignupScreen = () => {
//     requestAnimationFrame(() => {
//       navigation.navigate("SignupScreen");
//     });
//   };
const userData = route.params.people;

  return (
    
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.topSection}>
          <Image width={'100%'} height={'100%'} resizeMode='cover' resizeMethod='scale' source={{uri: userData.photos[0] }}/>
          <Text>{userData.name}</Text>
          <TouchableOpacity style={styles.chatBtn} onPress={()=>{navigation.navigate('Chat',{userData})}}>
            <Text>Написать</Text>
          </TouchableOpacity>
        </View>
        
      </SafeAreaView>
    
  );
};

export default User;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  chatBtn:{
    marginTop:10,
    backgroundColor:'blue',
    height:50,
    width:150,
    alignItems:'center',
    justifyContent:'center'
  },
  topSection: {
    
    //  flex: 3,
    // flexDirection:'column',
    width: "100%",
    height:'30%',
    // textAlign:'center'
     alignItems:'center',
    justifyContent:'center'
  },
  imageContainers: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  image: {
    margin: 20,
    width: "40%",
    height: "40%",
  },
  bottomSection: {
    ...mainShadow,
    paddingHorizontal: 20,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    backgroundColor: "#fff",
    width: "100%",
    flex: 2,
    alignItems: "center",
  },
  bottomSectionContent: {
    padding: 30,
  },
});
