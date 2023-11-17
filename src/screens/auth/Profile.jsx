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
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getFirestore,
  collection,
  query,
  where,
} from "firebase/firestore";


const Profile = ({route}) => {
  const [prog, setProg]= useState(0);
  const [modal,setModal] = useState(false);
  const [loading,setLoading] = useState(false);
  const [refresh, setResfresh] = useState(false);
  const dispatch = useDispatch();
  const [sliderInstance, setSliderInstance] = useState(null);
  const userData = useSelector((state) => state.user.userData);
  
  //////////////////////////////
  const uploadFile = async (fileUri, uData) => {
    console.log(uData.photos.length)
    // const dispatch = useDispatch();
  
    const apiUrl = 'https://bonus-back.store/upload_photo.php'; // Замените на ваш конечный пункт API
  
    try {
      // Прочитайте файл в формате base64
      // const base64 = await FileSystem.readAsStringAsync(fileUri, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });
      const callback = uploadProgressData => {
        const progress =uploadProgressData.totalBytesSent/uploadProgressData.totalBytesExpectedToSend;
        setProg(progress);
        
      };
    
      const up =   FileSystem.createUploadTask(apiUrl, fileUri,{
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
        await setDoc(docSnap.ref, {
          photos: [
            resp.body.trim(),
            ...docSnap.data().photos,
            
          ],
          uid: uData.uid,
          name:uData.name
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
      await uploadFile(uri, userData);
      
      
      
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
        </Modal>
          <AppSlider
          itsMy={true}
          setInstance={setSliderInstance}
          userData={userData}
          />
         <View style={{justifyContent:'center', flex:1, alignItems:'center'}}>
          <Text>{userData.name}</Text>
          <TouchableOpacity style={styles.chatBtn} onPress={()=>{
           
            if(userData.photos.length==10){
              Alert.alert('Извините','нельзя добавлять больше 10 фото')
              return false
            }pickImageAsync()}}>
            <Text>Добавить фото</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatBtn} onPress={()=>{}}>
            <Text>Подписка</Text>
          </TouchableOpacity>
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
    backgroundColor:'blue',
    height:50,
    width:150,
    alignItems:'center',
    justifyContent:'center'
  },
  topSection: {
    
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
