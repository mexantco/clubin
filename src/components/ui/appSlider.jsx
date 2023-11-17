import { View, Text, Image, TouchableOpacity, Alert, Modal } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useKeenSliderNative } from 'keen-slider/react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { useDispatch } from "react-redux";
import { setUserData } from '../../reducers/user';
import { getUserDataById } from "../../utils/user";
import axios from 'axios';
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
const AppSlider = ({userData, setInstance, itsMY}) => {
    const [loading, setLoading] = useState(false);
    const [delUri, setDelUri]= useState('');
    const [modal, setModal] = useState(false);
    const [action, setAction] = useState('');
    const [refresh, setRefresh] = useState(false);
    const dispatch = useDispatch();
    const openModal = (uri)=>{
        setModal(true)
        setDelUri(uri);
    }
    const [currentSlide, setCurrentSlide] = useState(0);
    const slider = useKeenSliderNative({
        slides:{ number: userData.photos.length, perView: 1, spacing: 0 },
        initial:0,
        
        loop: true,
        slidesPerView: 1,
        slideChanged(s) {
          setCurrentSlide(s.track.details.rel);
        },
      })
      useEffect(()=>{
        setInstance(slider);
      },[])
      const shiftPhoto= async(photo)=>{
        setAction('Переносим в начало');
        setModal(true);
        setLoading(true);
        let arr = userData.photos.filter(item=>item!=userData.photos[currentSlide])
        arr.unshift(photo)
        console.log(arr)
        //////////////////////////// delete from firebase
        const db = getFirestore();
        const docRef = doc(db, "users", userData.uid);
        const docSnap = await getDoc(docRef);
        await setDoc(docSnap.ref, {
          photos: arr,
          uid: userData.uid,
          name:userData.name
        });
        /////////////////////////
        let data = await getUserDataById(userData.uid);
        
        await dispatch(setUserData({ userData: data }))
        setRefresh(!refresh);
        slider.moveToIdx(0);
      }
      ////////////////////////////////////////////
      const unlinkPhoto = async(uri)=>{
        setAction('Удаляем')
        if(userData.photos.length==1){
            setLoading(false);
        Alert.alert('Извините','нельзя удалять последнее фото'); 
        return false}
        
        const response = await axios.get('https://bonus-back.store/delete_photo.php?uri='+uri.replace('https://bonus-back.store/', ''))
        if(response.data=='ok'){
            let newPhotos = userData.photos.filter((item=>item!==uri))
            
//////////////////////////// delete from firebase
            const db = getFirestore();
      const docRef = doc(db, "users", userData.uid);
      const docSnap = await getDoc(docRef);
      await setDoc(docSnap.ref, {
        photos: newPhotos,
        uid: userData.uid,
        name:userData.name
      });
      /////////////////////////
      let data = await getUserDataById(userData.uid);
      
      await dispatch(setUserData({ userData: data }))
      setRefresh(!refresh);
      slider.moveToIdx(0);
        }
      }

      
    //   slider.moveToIdx(0);
  return (
    <View style={{ overflow:'visible'}}>
        <Modal
        visible={modal}
        transparent={true}
        animationType='fade'
        
        >
            <BlurView intensity={50} tint='dark' style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                {loading?(
                <>
                    {/* <Progress.CircleSnail  size={100} strokeCap='round' color={'white'} thickness={1}  indeterminate={true} /> */}
                    <Progress.Circle  size={100} strokeCap='round' color={'white'} showsText={true} thickness={1}  indeterminate={true} ><View style={{  position:'absolute', left:0, top:0, height:100, width:100, justifyContent:'center',alignItems:'center'}}><Text style={{color:'white', textAlign:'center'}}>{action}</Text></View></Progress.Circle>
                    <View style={{height:100, width:100, borderRadius:50,opacity:0, backgroundColor:'#ffffff80', justifyContent:'center',marginTop:-10}}></View>
                </>):(
                <>
                <TouchableOpacity onPress={async ()=>{setLoading(true); await unlinkPhoto(delUri); setModal(false); setLoading(false)}}>
                <View style={{height:100, width:100, borderRadius:50, backgroundColor:'#ffffff90', justifyContent:'center'}}>
                    <Text style={{alignSelf:'center'}}>Удалить?</Text>
                </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setModal(false)}}>
                <View style={{height:100, width:100, borderRadius:50, backgroundColor:'#ffffff80', justifyContent:'center',marginTop:-10}}>
                    <Text style={{alignSelf:'center'}}>Нет</Text>
                </View>
                </TouchableOpacity>
                </>)}
                
            </BlurView>
        </Modal>
      <View
           {...slider.containerProps}
          style={{ height:'57%', overflow:'visible'}}
          > 
            <TouchableOpacity 
            style={{position:'absolute', top:15, right:55, zIndex: 5,}} 
            onPress={async()=>{await shiftPhoto(userData.photos[currentSlide]); setLoading(false); setModal(false)}}>
             <MaterialCommunityIcons name="numeric-1-box-multiple" size={30}  color={currentSlide==0?"#0f14e5b5":"#ffffff99"} />
            </TouchableOpacity>
            <TouchableOpacity
            style={{position:'absolute', top:15, right:15, zIndex: 5,}}
            onPress={()=>{
                
                openModal(userData.photos[currentSlide]);
            }}
            >
            <FontAwesome
             name="remove"
             size={30}
             color="#ffffff99"
             
             />
             </TouchableOpacity>
                  
              {userData.photos.map((item, idx)=>(
                <View
                  key={idx}
                  {...slider.slidesProps[idx]}
                  >
                    <Image
                  resizeMethod='resize'
                  resizeMode='contain'
                   style={{aspectRatio:1/1, width:'100%'}}
                //   width={400}
                //   height={400}
                  source={{uri: item}}
                  />
                  </View>
                  ))}

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal:'auto', bottom:10, left:0, right:0, position:'absolute' }}>
        {userData.photos.map((item, idx) => (
          <View
            key={idx}
            style={{
                borderWidth:1,
                borderColor:'#ffffff4f',
                flex:1,
              width: 10,
              height: 4,
              backgroundColor: idx === currentSlide ?'#ffffff8a' : 'transparent',
              margin: 3,
              borderRadius: 5,
            }}
          />
        ))}
      </View>
    </View>
  )
}

export default AppSlider