import React, { useState } from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image, Alert} from 'react-native';
import ClockHeader from '../../Components/Atoms/ClockHeaders';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import CommonStyles from './style';
import AppText from '../../Components/Atoms/CustomText';
import LeftArr from '../../Assets/Images/PNG/left_arr.png';
import Separator from '../../Components/Atoms/Separator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {moderateScale} from '../../Helper/scaling';
import CommonTitleAndText from '../../Components/Atoms/CommonTitleAndText';
import ActionContainer from '../../Components/Atoms/ActionContainer';
import CreateNewHeader from '../../Components/Atoms/CreateNewHeader';
import AppTextInput from '../../Components/Atoms/AppTextInputs';
import { mediaGroupManagerService } from '../MediaPlayerGroups/MediaGroupApi';
import Loader from '../../Components/Organisms/CMS/Loader';

const EditMediaPlayerGroup = ({navigation,route}) => {
  const { mediaData } = route.params;
  console.log('route.params',route.params)
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);
  const [groupName,setGroupname] =   useState(mediaData?.deviceGroupName);
  const [isLoading, setIsLoading] = useState(false);


  const btnGetMPGroup=()=>{

    if(!groupName){
      alert("Please enter group name1");
      return false;
    }
    const succussCallBack = async (response) => {
      setIsLoading(false);
      console.log("delete response", response);
      if (response.code ==200) {
        Alert.alert('Success!', response.message, [
          {text: 'Okay', onPress: () => {
            navigation.goBack()
          }},
        ]);
      } else {
        if (response?.data?.length > 0) {
          alert(response?.data[0]?.message);
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };
    setIsLoading(true);
    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("campaignDeleteError", error);
      if(error?.response?.data){
        alert(error?.response?.data?.message);
      }
    };
   let postData={
    deviceGroupId:mediaData?.deviceGroupId,
    deviceGroupName: groupName
   }
   setIsLoading(true);

    mediaGroupManagerService.editMPGroup(
      postData,
      succussCallBack,
      failureCallBack
    );
  }

  return (
    <View style={Styles.mainContainer}>
      <Loader visible={isLoading}/>
      <ClockHeader />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Edit Media Player Group"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View style={Styles.headerItemStyle}>
            <Ionicons
              name={'checkmark-circle'}
              size={25}
              color={themeColor.darkGreen}
            />
            <AppText style={Styles.optionText}>Group Details</AppText>
          </View>
        </View>
        <View style={Styles.bodyRowContainer}>
          <AppTextInput
            containerStyle={Styles.playerIdentifier}
            value={groupName}
            placeHolderText="Enter group name*"
            placeholderTextColor={themeColor.placeHolder}
            onChangeText={(txt) => {
              setGroupname(txt);
            }}
            textInputStyle={{
              fontSize: moderateScale(15),
            }}
          />
        </View>
      </ScrollView>
      <ActionContainer
        isContinue
        continueText="Save & Submit"
        numOfButtons={3}
        onPressSave={() => {
          btnGetMPGroup()
        }}
        cancelStyle={Styles.actionView}
        continueStyle={Styles.actionView}
        onPressCancel={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default EditMediaPlayerGroup;
