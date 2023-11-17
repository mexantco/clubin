import { View, Text } from 'react-native'
import React from 'react'
import AppSlider from '../../components/ui/appSlider'
const Gallery = ({route}) => {
    const userData = route.params.userData;
    const itsMy = route.params.itsMy;
  return (
    <View style={{backgroundColor:'black', flex:1}}>
        <AppSlider
        
        />
    </View>
  )
}

export default Gallery