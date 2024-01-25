import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert, Modal } from "react-native";
import React, {useRef, useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/ui/Button";
import { mainShadow } from "../../components/ui/ShadowStyles";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useKeenSliderNative } from 'keen-slider/react-native';
import { useDispatch } from "react-redux";
import { setUserData } from '../../reducers/user';
import { getUserDataById } from "../../utils/user";
import AppSlider from '../../components/ui/appSlider'
import axios from 'react-native-axios';
import { BlurView } from 'expo-blur';
import * as Progress from 'react-native-progress';
import { Shadow } from "react-native-shadow-2";

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getFirestore,
  collection,
  query,
  where,
  updateDoc
} from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


const icon = ({name, press}) =>{
  return(
    <TouchableOpacity style={styles.chatBtn} onPress={press}>
           <Ionicons name={name}  style={{shadowColor:'white', shadowRadius:5, textShadowRadius:25, backgroundColor:'#d5cefb10', textShadowColor:'#d5cefb', width:'100%', height:'100%', verticalAlign:'middle', textAlign:'center'}} size={50} color={'#d5cefb'}/>
    </TouchableOpacity>
  )
}
const Profile = ({route}) => {
  const [prog, setProg]= useState(0);
  const [modal,setModal] = useState(false);
  const [loading,setLoading] = useState(false);
  const [refresh, setResfresh] = useState(false);
  const dispatch = useDispatch();
  const [sliderInstance, setSliderInstance] = useState(null);
  const userData = useSelector((state) => state.user.userData);

  //////////////////////////////
  const warn = ()=>{
    if(userData.photos.length==10){
      Alert.alert('Извините','нельзя добавлять больше 10 фото')
      return false
    }pickImageAsync()
  }
  let [fontsLoaded] = useFonts({
    'Gilroy-Light': require('../../fonts/Gilroy-Light.otf'),
    'Gilroy-ExtraBold': require('../../fonts/Gilroy-ExtraBold.otf'),

    'Gilroy-Semibold': require('../../fonts/Gilroy-Semibold.ttf'),
   });

   const uploadFile = async (fileUri, uData, urlApi) => {
    console.log(uData.photos.length)


   // Замените на ваш конечный пункт API

    try {

      const callback = uploadProgressData => {
        const progress =uploadProgressData.totalBytesSent/uploadProgressData.totalBytesExpectedToSend;
        setProg(progress);

      };

      const up =   FileSystem.createUploadTask(urlApi, fileUri,{
        httpMethod:'POST',
        headers:{
          uid:uData.uid
        },
        uploadType:FileSystem.FileSystemUploadType.MULTIPART,
        fieldName:'file'
       },
       callback
       );
      const resp = await up.uploadAsync()
       ///////////////upload to firebase

        const db = getFirestore();
        const docRef = doc(db, "users", uData.uid);
        const docSnap = await getDoc(docRef);
        await updateDoc(docRef, {
          photos: [
            resp.body.trim(),
            ...docSnap.data().photos,

          ]
        });

    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    }
  };

  // console.log(userData.photos.length)


  const [uri, setUri] = useState();

  const pickImageAsync = async () => {
    setModal(true)
    setLoading(true)
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect:[1,1],
      quality: 1,
    });

    if (!result.canceled) {
        // console.log(result);

      let uri = result.assets[0].uri;
      // setUri(uri)
      await uploadFile(uri, userData, 'https://bonus-back.store/upload_photo.php');



      let data = await getUserDataById(userData.uid);

      await dispatch(setUserData({ userData: data }))
      setModal(false);
      setLoading(false);
      setProg(0);
      setResfresh(!refresh);
      sliderInstance.moveToIdx(0);

    } else {

      setModal(false)
    }
  };
  const navigation = useNavigation();
//   const showSignupScreen = () => {
//     requestAnimationFrame(() => {
//       navigation.navigate("SignupScreen");
//     });
//   };


  return (

      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.topSection}>
        <Modal
        visible={modal}
        transparent={true}
        animationType='fade'

        >
            <BlurView intensity={50} tint='dark' style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            {loading?(<>
              <Progress.Bar height={2} width={250} borderRadius={2} useNativeDriver={true} color={'white'} animationType="spring" progress={prog} />

            </>):(<></>)}
            </BlurView>
        </Modal>{userData.photos.length!=0?(<><AppSlider
          itsMy={true}
          setInstance={setSliderInstance}
          userData={userData}
          /></>):(<><View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text style={{fontSize:30, color:'#ffffff', height:300}}>Добавьте фото</Text></View></>)}

         <View style={{justifyContent:'center', alignItems:'center'}}>
          <Text style={{textAlign:'center', fontFamily:'Gilroy-Semibold', color:'#f0f0f0', fontSize:20}}>{userData.name}</Text>
          <View style={{flexDirection:'row', flexWrap:'wrap',  width:'80%', justifyContent:'space-around'}}>
          <View>
          {icon({name:'cloud-upload-outline', press:()=>{warn()}})}
          {icon({name:'wine-outline', press:()=>{navigation.navigate('Orders')}})}
          </View>
          <View>
          {icon({name:'options-outline', press:()=>{navigation.navigate('Settings')}})}
          {icon({name:'log-out-outline', press:()=>{signOut(getAuth())}})}
          </View>
          </View>
          </View>
        </View>

      </SafeAreaView>

  );
};

export default Profile;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  chatBtn:{

    marginTop:10,
    backgroundColor:'#ffffff00',
    borderWidth:1,
    borderColor:'#d5cefb70',
    borderRadius:50,
    height:100,
    overflow:'hidden',
    width:100,
    alignItems:'center',
    justifyContent:'center'
  },
  topSection: {
      paddingTop:100,
     flexGrow: 1,
    // flexDirection:'column',
    // width: "100%",
    // height:'30%',
    // textAlign:'center'
    //  alignContent:'center',
    // justifyContent:'center'
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
