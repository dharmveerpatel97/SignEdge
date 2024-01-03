import React, { useState, useEffect } from "react";
import { ScrollView, View, Alert } from "react-native";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonHeaderTitleAction from "../../Components/Atoms/CommonHeader";
import AppText from "../../Components/Atoms/CustomText";
import Pagination from "../../Components/Atoms/Pagination";
import Separator from "../../Components/Atoms/Separator";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import ResolutionListView from "../../Components/Organisms/CMS/Resolution/resolutionList";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import ResolutionStyles from "./style";
import { ActivityIndicator, Text } from "react-native-paper";
import { getResolutionData } from "../../Services/AxiosService/ApiService";
import { useSelector } from "react-redux";
import { ResolutionManagerService } from "../../Services/AxiosService";
import Store from "../../appConfig/Redux/store";
import { removeResolutionList } from "../../appConfig/Redux/Action/resolutionManagerAction";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import { PREVILAGES } from "../../Constants/privilages";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
// import CommonHeaderUpdated from '../../Components/Atoms/CommanHeaderUpdated';

const { dispatch } = Store;

const ResolutionManagement = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = ResolutionStyles(themeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );
  const userData = useSelector((state) => state.userReducer.userDetails.data);
  const { authorization, isApprover } = useSelector(
    (state) => state.userReducer
  );
  console.log("isApprover", isApprover);

  const [isModal, setisModal] = useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const onComplete = () => {
    setisModal(false);
    // navigation.goBack();
  };

  const markAll = (e) => {
    if (userData.customerType == "ADVANCED") {
      setCheckAll(e);
    }
    console.log(e);
  };

  const changeCheckbox = () => {
    setCheckAll(false);
    setTimeout(() => {
      setisModal(true);
    }, 1000);
  };

  useEffect(() => {
    getResolutionData(setIsLoading);
  }, []);

  const handleEditPress = (data = {}) => {
    navigation.navigate(NAVIGATION_CONSTANTS.ADD_RESOLUTION, {
      data,
      type: "edit",
    });
  };

  const handleDeletePress = async (data = {}) => {
    const slugId = await getStorageForKey("slugId");

    Alert.alert(
      "Warning!",
      `Are you sure you want to delete ${data?.resolutions} Resolution.`,
      [
        {
          text: "Take me back",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Sure",
          onPress: () => {
            const params = {
              aspectRatioId: data?.aspectRatioId,
              slugId,
            };

            const succussCallBack = async (response) => {
              setisModal(true);
              setTimeout(() => {
                dispatch(removeResolutionList([data?.aspectRatioId]));
                getResolutionData(setIsLoading);
              }, 800);
            };

            const failureCallBack = (error) => {
              console.log("failureCallBack in delete resolution", error);
              getResolutionData(setIsLoading);
            };

            ResolutionManagerService.DeleteResolution(
              params,
              succussCallBack,
              failureCallBack
            );
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={Styles.fullFlex}>
      <ClockHeader />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.mainContainer}>
          {userData.customerType == "BASIC" ? (
            <View style={{ marginVertical: 15, paddingHorizontal: 10 }}>
              <AppText style={Styles.titleStyle}>
                {" "}
                Resolution Management{" "}
              </AppText>
            </View>
          ) : (
            <CommonHeaderTitleAction
              titleTextStyle={{
                fontSize: moderateScale(17),
              }}
              title="Resolution Management"
              btnOpenModelType={changeCheckbox}
              renderDelete={authorization?.includes(
                PREVILAGES.ASPECT_RATIO.DELETE_ASPECT_RATIO
              )}
            />
          )}

          {userData.customerType != "BASIC" &&
            authorization?.includes(
              PREVILAGES.ASPECT_RATIO.ADD_ASPECT_RATIO
            ) && (
              <View style={Styles.addResolutionView}>
                <ThemedButton
                  disabled={userData.customerType == "BASIC" ? true : false}
                  onClick={() =>
                    navigation.navigate(NAVIGATION_CONSTANTS.ADD_RESOLUTION)
                  }
                  containerStyle={[
                    Styles.themeContainer,
                    { opacity: userData.customerType == "BASIC" ? 0.5 : 1 },
                  ]}
                  title="+ Add Resolution"
                />
              </View>
            )}

          {resolutionList.length > 0 && (
            <View>
              <AppText style={Styles.TotalText}>
                Total Records: {resolutionList.length}
              </AppText>
              <ResolutionListView
                checkAll={checkAll}
                setCheckAll={(e) => markAll(e)}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                handleEditPress={handleEditPress}
                handleDeletePress={handleDeletePress}
                resolutionList={resolutionList}
              />
              <Separator />
              {/* <AppText style={Styles.totalRecords}>
              Total Records : 1 - 10 of 25
            </AppText> */}
              {/* <Pagination pageNumber={1} /> */}
            </View>
          )}

          {isModal && (
            <SuccessModal Msg={"Delete Successfully"} onComplete={onComplete} />
          )}

          {resolutionList?.length === 0 && (
            <View>
              <Text style={{ color: "#000000", fontSize: 24 }}>
                No data Found.
              </Text>
            </View>
          )}

          <CopyRightText />
        </View>
      </ScrollView>
    </View>
  );
};

export default ResolutionManagement;
