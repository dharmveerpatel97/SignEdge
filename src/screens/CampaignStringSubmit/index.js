import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import CommonStyles from "./style";
import Separator from "../../Components/Atoms/Separator";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import AppText from "../../Components/Atoms/CustomText";
import { moderateScale } from "../../Helper/scaling";
import { useSelector } from "react-redux";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";
import Loader from "../../Components/Organisms/CMS/Loader";
import { getWorkFlow } from "../../Services/AxiosService/ApiService";
const CampaignStringSubmit = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  const [campaignString, setCampaignString] = useState("");
  const [campaignStringError, setCampaignStringError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const responseData = route.params?.responseData || null;
  const { selectedImageIds, aspectRatioId } = route.params;

  const [selCampaigns, setSelCampaigns] = useState(
    route.params?.selectedImageIds
  );
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [textInputValue, setTextInputValue] = useState("1");
  const [textInputValueError, setTextInputValueError] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const [durationData, setDurationData] = useState("5s");
  const [campaigns, setCampaigns] = useState([]);
  const [responseValue, setResponseValue] = useState(null);
  const [totalDuration, setTotalDuration] = useState(null);


  const workFlow = useSelector(
    (state) => state.userReducer.workFlow
  );

  function convertSecondsToMinutesAndSeconds(totalSeconds) {
    if(totalSeconds){
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;
      return {
        minutes,
        seconds
      };
    }else{
      return {
        minutes:0,
        seconds:0
      };
    }
  }
  useEffect(()=>{
    getWorkFlow(navigation)
    const { selectedImageIds, aspectRatioId } = route.params;
    const sum = selectedImageIds.reduce((accu, a) => accu + a.deuration, 0);
    let data
    if(sum!=0){
      data =  convertSecondsToMinutesAndSeconds(sum)
    }else{
      data={
        minutes:0,
        seconds:0
      }
    }
    setTotalDuration(data)
  },[route])
  const handleCampaignStringSubmit = (TYPE) => {
    if (!campaignString.trim()) {
      setCampaignStringError("Please enter campaign string name");
    } else if (selectedCampaignId === "") {
      setCampaignStringError("Please select a campaign");
    } else if (parseInt(textInputValue) <= 0) {
      setTextInputValueError("Number of loops should be between 1 to 10 ");
    } else if (parseInt(textInputValue) > 10) {
      setTextInputValueError("Number of loops should be between 1 to 10 ");
    } else {
      setCampaignStringError("");
      handleSubmitPress(TYPE);
    }
  };

  const handleSubmitPress = async (TYPE) => {
    let slugId = await getStorageForKey("slugId");

    const campaignsArray = selCampaigns.map((item, index) => ({
      campaignId: item.campaignId,
      numberOfLoops: item.numberOfLoops,
      displayOrder: index + 1,
    }));

    let haserror = "";
    let reg = /^[1-9]\d*$/;
    for (let index = 0; index < selCampaigns.length; index++) {
      const element = selCampaigns[index].campaignName;
      if (
        !reg.test(selCampaigns[index].numberOfLoops) ||
        selCampaigns[index].numberOfLoops > 10
      ) {
        haserror = `No of loops accept between 1 to 10 only for ${element}`;
        break;
      }
    }

    if (haserror) {
      alert(haserror);
      return false;
    }
    //

    const params = {
      campaignStringName: campaignString,
      aspectRatioId: aspectRatioId?.ratioId,
      campaigns: campaignsArray,
      slugId: slugId,
      state: TYPE,
    };

    console.log(params, "params");

    setIsLoading(true);
    const succussCallBack = async (response) => {
      if (TYPE == "DRAFT") {
        setIsLoading(false);
        if (response && response.code === 200) {
          setResponseValue(response);
          Alert.alert("Success", "Campaign String Created Successfully", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate(NAVIGATION_CONSTANTS.CAMPAIGN_STRING);
              },
            },
          ]);
        }
      } else {
        btnForSubmitState(response.data);
      }
    };
    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("campaignSubmitError", response);
      if (error?.response?.data?.data?.length > 0) {
        alert(error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };
    CampaignStringManagerService.addCampaignString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnForSubmitState = async (data) => {
    let slugId = await getStorageForKey("slugId");
    data.state = "SUBMITTED";
    let params = {
      slugId: slugId,
      data: data,
    };
    const succussCallBack = async (response) => {
      console.log(
        "campaignSubmitSucees submitted-----------------------",
        response
      );
      setIsLoading(false);
      setResponseValue(response);
      
      if (response.code == 20) {  
        Alert.alert("Success", "Campaign String Created Successfully", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate(NAVIGATION_CONSTANTS.CAMPAIGN_STRING);
            },
          },
        ]);
      }else if(response.code == 21){
        Alert.alert("Error!", response?.message, [
          {
            text: "Ok",
            onPress: () => {
              navigation.navigate(NAVIGATION_CONSTANTS.CAMPAIGN_STRING);
            },
          },
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
    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("campaignSubmitError", response);
    };
    CampaignStringManagerService.submitCampaignString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const handleItemPress = (campaignId, campaignTitle, index) => {
    setSelectedCampaignId(campaignId);
    setSelectedItemIndex(index);
  };
  const changeInputField = (txt) => {
    // if(!reg.test(txt))  return false;
    let data = [...selCampaigns];
    data[selectedItemIndex].numberOfLoops = txt;
    setSelCampaigns([...data]);
  };
  return (
    <View style={Styles.mainContainer}>
      <Loader visible={isLoading} />
      <ClockHeader />
      <ScrollView>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Create Campaign String"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View style={Styles.bodyContainer}>
            <View style={Styles.bodyRowsContainer}>
              <TextInput
                style={[{ color: "#000000" }, Styles.eventTitleInput]}
                placeholder="Campaign String *"
                placeholderTextColor={themeColor.placeHolder}
                value={campaignString}
                onChangeText={(text) => setCampaignString(text)}
                fontSize={moderateScale(15)}
              />
              {campaignStringError ? (
                <Text style={Styles.errorText}>{campaignStringError}</Text>
              ) : null}
              <AppText style={Styles.duration}>Total Duration : {totalDuration ? `${totalDuration.minutes}m:${totalDuration.seconds}s`:0}</AppText>
            </View>
            {selCampaigns && selCampaigns.length > 0 && (
              <FlatList
                data={selCampaigns}
                numColumns={2}
                scrollEnabled={false}
                keyExtractor={(item, index) =>
                  `${item.campaignId}-${index.toString()}`
                }
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() =>
                      handleItemPress(item.campaignId, item.campaignName, index)
                    }
                    style={{
                      borderWidth: 1,
                      borderColor:
                        selectedCampaignId === item.campaignId
                          ? "blue"
                          : "transparent",
                      backgroundColor: "#ccc",
                      width: moderateScale(10),
                      padding: moderateScale(10),
                      justifyContent: "space-between",
                      flex: 1,
                      margin: moderateScale(10),
                    }}
                  >
                    <Text>{item.campaignName}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            {selectedCampaignId !== null && (
              <View style={Styles.loopsView}>
                <Text style={Styles.string}>
                  {selCampaigns[selectedItemIndex]?.campaignName}
                </Text>
                <Text style={Styles.string}>No. of Loops</Text>
                <TextInput
                  style={[Styles.eventTitleInput, { color: "#000000" }]}
                  keyboardType="number-pad"
                  value={selCampaigns[
                    selectedItemIndex
                  ].numberOfLoops.toString()}
                  placeholderTextColor={themeColor.placeHolder}
                  onChangeText={(text) => {
                    changeInputField(text);
                  }}
                  fontSize={moderateScale(15)}
                />
                {!/^[1-9]\d*$/.test(
                  selCampaigns[selectedItemIndex].numberOfLoops
                ) ? (
                  <Text style={Styles.errorText}>{"Enter valid value"}</Text>
                ) : null}
                <Text style={Styles.string}>Display Order</Text>
                <Text style={[Styles.eventTitleInput2, { color: "#000000",backgroundColor:themeColor.iconBackground }]}>
                  {selectedItemIndex !== null ? selectedItemIndex + 1 : ""}
                </Text>
                {/* <Text style={Styles.string}>Display Order</Text>
                <TextInput
                  style={[Styles.eventTitleInput, {color:'#000000'}]}
                  placeholderTextColor={themeColor.placeHolder}
                  value= {selectedItemIndex ? (selectedItemIndex + 1).toString() : ''}
                  editable={false}
                  fontSize={moderateScale(15)}
                /> */}
                <Text style={Styles.string}>Duration</Text>
                <TextInput
                  style={[Styles.eventTitleInput, { color: "#000000",backgroundColor:themeColor.iconBackground }]}
                  placeholderTextColor={themeColor.placeHolder}
                  value={durationData}
                  editable={false}
                  onChangeText={(text) => setDurationData(text)}
                  fontSize={moderateScale(15)}
                />
              </View>
            )}

            <View style={Styles.buttonView}>
              <ThemedButton
                onClick={() => navigation.goBack()}
                containerStyle={Styles.back}
                title="Back"
              />
              <ThemedButton
                onClick={() => handleCampaignStringSubmit("DRAFT")}
                containerStyle={Styles.saveAsDraft}
                title="Save as Draft"
              />
              {
                (workFlow &&
                workFlow?.approverWorkFlow == "CAMPAIGN_STRING") ?  
                <ThemedButton
                  onClick={() => handleCampaignStringSubmit("SUBMITTED")}
                  containerStyle={Styles.Submit}
                  title="Send for approval"
                />
                :
                <ThemedButton
                  onClick={() => handleCampaignStringSubmit("SUBMITTED")}
                  containerStyle={Styles.Submit}
                  title="Submit"
                />
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CampaignStringSubmit;
