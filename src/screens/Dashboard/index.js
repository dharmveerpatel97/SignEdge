import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../Components/Atoms/CustomText";
import Greetings from "../../Components/Atoms/Greetings";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import QuickLinks from "../../Components/Molecules/QuickLinks";
import LicenseDetails from "../../Components/Organisms/Dashboard/LicenseDetails";
import LocationHierarchy from "../../Components/Organisms/Dashboard/LocationHierarchy";
import Planograms from "../../Components/Organisms/Dashboard/Planograms";
import RecentActivities from "../../Components/Organisms/Dashboard/RecentActivities";
import { ThemeContext } from "../../appConfig/AppContext/themeContext";
import dashboardStyles from "./style";
import userReducer from "../../appConfig/Redux/Reducer/userReducer";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import viewIcon from "../../Assets/Images/PNG/document.png";
import {
  getActiveSiteData,
  getRecentMediaData,
  getUserData,
  userManagerService,
} from "./DashboardApi";
import Fontisto from "react-native-vector-icons/Fontisto";

import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import Loader from "../../Components/Organisms/CMS/Loader";
import { getLocationList } from "../Planogram/PlonogramApi";
import LocationsList from "../../Components/Organisms/Dashboard/LocationsList";
import MediaAndDisplay from "../../Components/Organisms/Dashboard/MediaAndDisplay";
import SearchBox from "../../Components/Atoms/SearchBox";
import LocationsForDasboard from "../../Components/Organisms/Dashboard/LocationsForDashoard";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { checkIsApprove, getWorkFlow } from "../../Services/AxiosService/ApiService";
import { width } from "../../Helper/scaling";
import { updateDrawerIndex } from "../../appConfig/Redux/Action/userAction";

const Dashboard = ({ navigation }) => {
  const themeColor = useContext(ThemeContext);
  const Styles = dashboardStyles(themeColor);
  const userList = useSelector((state) => state.userReducer.userDetails);
  const userActive = useSelector((state) => state.userReducer.activeSite);
  const activeSideCount = useSelector(
    (state) => state.userReducer.activeSideCount
  );
  const [isLoading, setIsLoading] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const [recentCampaign, setRecentCampaign] = useState(null);
  const [recentCampaignString, setRecentCampaignString] = useState(null);
  const [recentpublished, setRecentPublished] = useState([]);
  const [recentInActive, setRecentInActive] = useState([]);
  const [planogramRunning, setPlanogramRunning] = useState([]);
  const [planogramLive, setPlanogramLive] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [recentDevices, setResentDevices] = useState([]);
  const [recentMedia, setRecentMedia] = useState(null);
  const [recentInactiveDevices, setRecentInactiveDevices] = useState(null);
  const [locationSelected, setLocationSelected] = useState(null);
  const [recentPlanoSche, setrecentPlanoSche] = useState(null);
  const [mpData, setMPData] = useState(null);

  // console.log("recentMedia--54", recentMedia);
  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  const userData = useSelector(
    (state) => state?.userReducer?.userDetails?.data
  );

  const workFlow = useSelector((state) => state.userReducer.workFlow);
  const isApprover = useSelector((state) => state.userReducer.isApprover);
  const dispatch = useDispatch();


  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        if (backPressCount === 0) {
          setBackPressCount(1 + backPressCount);
          setTimeout(() => setBackPressCount(0), 2000);
          if (Platform.OS == "android") {
            Toast.show("Press again to exit the app.", Toast.SHORT);
          }
        } else if (backPressCount === 1) {
          BackHandler.exitApp();
        }
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );
      return () => subscription.remove();
    }, [backPressCount])
  );

  useEffect(() => {
    setLocationSelected(locationData1);
  }, [locationData1]);

  useEffect(() => {
    if (locationSelected != null) {
      getMediaPlayerData(locationSelected.locationId);
    }
  }, [locationSelected]);

  const getMediaPlayerData = async (locationId) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      locationId: locationId,
    };
    const succussCallBack = async (response) => {
      console.log("Sucess bar data fetchMediaPlayer", response);
      console.log("Sucess bar data fetchMediaPlayer", response?.result[0]);
      setMPData(response?.result[0]);
    };

    const failureCallBack = (error) => {
      console.log("error----------", error);
    };

    userManagerService.fetchConnectedDisconnectedDevices(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(updateDrawerIndex({ index: 0, subIndex: 0 }));
      getDashboardDetails();
    });
    return unsubscribe;
  }, []);
  const [isSchedulerEnabled, setisSchedulerEnabled] = useState(null);
  const getDashboardDetails = () => {
    getStorageForKey("is_scheduler_enabled").then((is_scheduler_enabled) => {
      let is_scheduler_enabled1 = "";
      if (is_scheduler_enabled == "true" || is_scheduler_enabled == true) {
        is_scheduler_enabled1 = true;
        setisSchedulerEnabled(true);
      } else {
        is_scheduler_enabled1 = false;
        setisSchedulerEnabled(false);
      }

      setTimeout(() => {
        getLocationList();
        getWorkFlow(navigation);
        checkIsApprove();
      }, 500);
      userDetail();
      getSiteData();
      setTimeout(() => {
        getRecentMediaData();
      }, 100);
      setTimeout(() => {
        getRecentCampaignData();
        getRecentCampaignStringData();
        getRecentSchedulerPlanogram(1,5,is_scheduler_enabled1);
      }, 1000);
      setTimeout(() => {
        getRecentInActiveData();
        getRecentPublishedData();
        getplanogramLiveData(is_scheduler_enabled1);
      }, 1500);
      setTimeout(() => {
        getplanogramRunningData(is_scheduler_enabled1);
        getRecentDevices();
        getRecentInactiveDevices();
      }, 2000);
      setTimeout(() => {
        // fetchApprovedRejectedPlano(is_scheduler_enabled1);
        // fetchUnApprovalPlano(is_scheduler_enabled1);
      }, 2600);
    });
  };

  const getRecentMediaData = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
    setIsLoading(false)

      console.log('getRecentMediaData',response)
      if (response) {
        setRecentMedia(response);
      }
    };
    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("Error Recent Media Data uploadd", error);
    };
    userManagerService.recentMediaList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getRecentSchedulerPlanogram = async (currentPage = 1, limit = 5,is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
      setIsLoading(false)
      console.log("getRecentSchedulerPlanogram get", response);
      if (response) {
        setrecentPlanoSche(response);
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("getRecentSchedulerPlanogram error----------", error);
    };

    if (is_scheduler_enabled) {
      userManagerService.recentScheduler(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.recentPlanogram(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };
  const getRecentCampaignStringData = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
      setIsLoading(false)
      if (response) {
        setRecentCampaignString(response);
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("recent campaign error----------", error);
    };

    userManagerService.recentCampaignStringList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getRecentCampaignData = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
      setIsLoading(false)
      console.log('getRecentCampaignData',response)
      if (response && response?.data) {
        setRecentCampaign(response);
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("error----------", error);
    };

    userManagerService.recentCamapignList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getRecentDevices = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
      setIsLoading(false)
      setResentDevices(response);
    };

    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("error----------", error);
    };

    userManagerService.recentDevices(params, succussCallBack, failureCallBack);
  };

  const getRecentInactiveDevices = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
      setIsLoading(false)
      setRecentInactiveDevices(response);
    };

    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("error----------", error);
    };

    userManagerService.recentInactiveDevices(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const fetchUnApprovalPlano = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      console.log("fetchUnApprovalPlano", response);
      if (response.data) {
        setUnApprovedPlano(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("fetchUnApprovalPlano error", error);
    };

    if (is_scheduler_enabled == true || is_scheduler_enabled == "true") {
      userManagerService.fetchUnApprovalPlanoSch(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.fetchUnApprovalPlano(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };
  const fetchApprovedRejectedPlano = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      console.log("fetchApprovedRejectedPlano", response);
      if (response.data) {
        setApprovedRejectedPlano(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("fetchApprovedRejectedPlano error", error);
    };
    if (is_scheduler_enabled == true || is_scheduler_enabled == "true") {
      userManagerService.fetchApprovedRejectedPlanoSch(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.fetchApprovedRejectedPlano(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };

  const userDetail = async () => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      slugId,
    };
    getUserData(params, setIsLoading);
  };

  const getSiteData = async () => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      slugId,
    };
    getActiveSiteData(params, setIsLoading);
  };

  const getRecentInActiveData = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response && response?.data) {
        setRecentInActive(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("error----------", error);
    };

    userManagerService.recentInActiveList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getRecentPublishedData = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response && response?.data) {
        setRecentPublished(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("error----------", error);
    };

    userManagerService.recentPublishedList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getplanogramRunningData = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response && response?.data) {
        setPlanogramRunning(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("error----------", error);
    };

    if (is_scheduler_enabled) {
      userManagerService.recentPlanogarmRunningListSch(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.recentPlanogarmRunningList(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };

  const getplanogramLiveData = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response && response?.data) {
        setPlanogramLive(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("error----------", error);
    };
    if (is_scheduler_enabled) {
      userManagerService.recentPlanogramLiveListSch(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.recentPlanogramLiveList(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };

  
 

  return (
    <View style={Styles.mainContainer}>
      <Loader visible={isLoading} />
      <ClockHeader />
      <ScrollView
        style={Styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={Styles.subContainer}>
          <Greetings
            name={userList?.data ? userList?.data?.customerFullName : null}
          />

          <LicenseDetails
            userList={userList?.data}
            userActive={userActive}
            activeSideCount={activeSideCount}
          />
          <AppText style={Styles.headerText}>Location Hierarchy</AppText>
          <View style={Styles.hariarchyContainer}>
            {/* <SearchBox isIcon placeholder="Search Location" /> */}
            <>
              {locationData1 && (
                <LocationsForDasboard
                  data={locationData1}
                  setIsLoading={setIsLoading}
                  locationSelected={locationSelected}
                  setLocationSelected={setLocationSelected}
                  selectedLocations={selectedLocations}
                  setSelectedLocations={setSelectedLocations}
                />
              )}
            </>
            <MediaAndDisplay data={locationSelected} mpData={mpData} />
          </View>
          <QuickLinks isSchedulerEnabled={isSchedulerEnabled} />
          <Planograms
            planogramRunning={planogramRunning}
            planogramLive={planogramLive}
            isSchedulerEnabled={isSchedulerEnabled}
          />

          <RecentActivities
            recentMedia={recentMedia}
            recentCampaign={recentCampaign}
            recentCampaignString={recentCampaignString}
            recentpublished={recentpublished}
            recentPlanoSche={recentPlanoSche}
            isSchedulerEnabled={isSchedulerEnabled}
            recentInActive={recentInActive}
            recentDevices={recentDevices}
            recentInactiveDevices={recentInactiveDevices}
            getRecentMediaData={getRecentMediaData}
            getRecentCampaignStringData={getRecentCampaignStringData}
            getRecentSchedulerPlanogram={getRecentSchedulerPlanogram}
            getRecentCampaignData={getRecentCampaignData}
            getRecentDevices={getRecentDevices}
            getRecentInactiveDevices={getRecentInactiveDevices}
          />
          {/* isSchedulerEnabled != true && workFlow */}
          {/* {true &&
            (workFlow?.approverWorkFlow === "PLANOGRAM" ||
              workFlow?.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN") && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setplanogramApprovalFlag(true);
                    }}
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: planogramApprovalFlag ? 1 : 0,
                    }}
                  >
                    <AppText style={{ fontSize: 12, color: "#000" }}>
                      {isSchedulerEnabled == true
                        ? "SCHEDULER APPROVAL"
                        : "PLANOGRAM APPROVAL"}
                    </AppText>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setplanogramApprovalFlag(false);
                    }}
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: !planogramApprovalFlag ? 1 : 0,
                    }}
                  >
                    <AppText style={{ fontSize: 12, color: "#000" }}>
                      {isSchedulerEnabled == true
                        ? "APPROVED/REJECTED SCHEDULER"
                        : "APPROVED/REJECTED PLANOGRAM"}
                    </AppText>
                  </Pressable>
                </View>

                <FlatList
                  ListEmptyComponent={ListEmptyComponent}
                  data={
                    planogramApprovalFlag
                      ? unApprovedPlano
                      : approvedRejectedPlano
                  }
                  renderItem={renderCampaignList}
                  ListHeaderComponent={renderCampaignHeader}
                />
              </>
            )
          } */}

          <CopyRightText />
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
