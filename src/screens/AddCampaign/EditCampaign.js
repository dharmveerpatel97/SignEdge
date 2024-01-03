import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { Switch } from "react-native-paper";
import ActionContainer from "../../Components/Atoms/ActionContainer";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonTitleAndText from "../../Components/Atoms/CommonTitleAndText";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import AppText from "../../Components/Atoms/CustomText";
import Separator from "../../Components/Atoms/Separator";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { Dropdown } from "react-native-element-dropdown";
import CommonStyles from "./style";
import ColorModalPicker from "../../Components/Atoms/ColorPicker";
import {
  getMediaLibData,
  getTemplateData,
  getWorkFlow,
} from "../../Services/AxiosService/ApiService";
import { useSelector } from "react-redux";
import Slider from "@react-native-community/slider";
import SelectMediaModal from "../../Components/Organisms/CMS/Campaign/SelectMediaModal";
import { CampaignManagerService } from "../Campaign/CompainApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import CampaignRegion from "../../Components/Organisms/CMS/Campaign/CampaignRegion";
import CampaignArrangeMedia from "../../Components/Organisms/CMS/Campaign/CampaignArrangeMedia";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import SelectAudio from "../../Components/Organisms/CMS/Campaign/SelectAudio";
import CampaignAddTag from "../../Components/Organisms/CMS/Campaign/CampaignAddTag";
import { getMediaDataForCampAdd } from "../Campaign/CompainApi";
import { getTempleteDataForCampAdd } from "../Campaign/CompainApi";
import Loader from "../../Components/Organisms/CMS/Loader";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";
import CrossImage from "../../Assets/Images/PNG/delete-button.png";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ResolutionManagerService } from "../../Services/AxiosService";
import SelectLocationModalForCampaign from "../../Components/Organisms/Devices/SelectLocationModalForCampaign";
import axios from "axios";
const EditCampaign = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  const [currentSection, setCurrentSection] = useState(0);
  const [colorModal, setColorModal] = useState(false);
  const [bgColor, setBgColor] = useState("#000000");
  const [isLoading, setIsLoading] = useState(false);
  const [templateShowList, setTempleteShowList] = useState([]);
  const templateList = useSelector(
    (state) => state.TemplateReducer.templateList
  );
  const [imageMediaData, setImageMediaData] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const [seleAudioData, setSelAudioData] = useState([]);
  const [mediaData, setMediaData] = useState([]);
  const MediaList = useSelector((state) => state.MediaLibReducer.MediaLibList);

  const [value, setValue] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [templateTag, setTempletTag] = useState("");
  const [templateTagArr, setTempletTagArr] = useState([]);
  const [transparency, setTransparency] = useState();
  const [locationName, setLocationName] = useState(null);

  const [modal, setModal] = useState();
  const [arrangeModal, setArrangeModal] = useState(false);
  const [selectedBgImg, setSelectedBgImg] = useState("");
  const [selectedTemplet, setSelectedTemplet] = useState({});
  const [mediaModalType, setMediaModalType] = useState(null);
  const [activateRegion, setActiveRegion] = useState(0);
  const [selectRegionForEdit, setSelectetRegionForEdit] = useState(-1);
  const [campaignType, setCampaignType] = useState(null);
  const [cmpArrangeModal, setCmpArrangeModal] = useState(false);
  const [ratioId, setRatioId] = useState(null);
  const [duration, setDuration] = useState({
    hh: 0,
    mm: 0,
    ss: 0,
  });
  const [ratioList, setRatioList] = useState([]);

  //For Edit =====================================================
  const { campaignItem } = route.params;

  useEffect(() => {
    let {
      templateId,
      campaignTags,
      backgroundColor,
      campaignTitle,
      campaignId,
    } = campaignItem;
    btnGetCampaignDetails(campaignId);
  }, [MediaList]);

  const getResolutionData = async (setIsLoading = () => {}) => {
    const slugId = await getStorageForKey("slugId");
    setIsLoading(true);

    const successCallBack = async (response) => {
      console.log("response 123 resolution", response);
      if (response?.data && response?.data?.length > 0) {
        const modifyData = response?.data;
        let resolutionDropdownData = modifyData.map((resolution) => ({
          label: `${resolution.aspectRatio} (${resolution.defaultWidthInPixel} x ${resolution.defaultHeightInPixel})`,
          value: resolution.aspectRatioId,
        }));
        console.log("resolutionDropdownData", resolutionDropdownData);
        setRatioList(resolutionDropdownData);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    const errorCallBack = (response) => {
      setIsLoading(false);
    };

    ResolutionManagerService.fetchResolutionList(
      { slugId },
      successCallBack,
      errorCallBack
    );
  };
  const btnGetMediaById = async (mediaId) => {
    const token = await getStorageForKey("authToken");
    const slugId = await getStorageForKey("slugId");
    const authHeader = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${baseUrl}content-management/cms/${slugId}/v1/media/${mediaId}`, {
          headers: authHeader,
        })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const btnSetCamapaignEditValues = (campaignData) => {
    if (campaignData) {
      // contentId
      console.log("MediaList", MediaList.data);
      let mData = MediaList?.data?.mediaDetails;

      // let regiondata = campaignData?.regions[0]?.globalRegionContentPlaylistContents

      let regiondata = campaignData?.regions;
      let finalRegion = [];
      regiondata.map((region) => {
        let fdata = [];
        let contentData = region?.globalRegionContentPlaylistContents;
        contentData?.map((data,index) => {
          let findIndex = mData?.findIndex(
            (rdata) => data.contentId == rdata.mediaDetailId
          );
          if (findIndex > -1) {
            let mediaDta=mData[findIndex];
            mediaDta.displayMode=data.displayMode
            fdata.push(mediaDta);
          }
        });
        region.templateRegionName = region.layoutRegionName;
        region.regionData = fdata;
        let locationIds = [];
        if (region.locations.length > 0) {
          region.locationIds = [region.locations[0]?.locationId];
          region.customizCheck = true;
        } else {
          region.locationIds = locationIds;
          region.customizCheck = false;
        }
        finalRegion.push(region);
      });

      let trans = campaignData?.transparencyInPercentage || 0;
      console.log("transtrans", trans);
      if (trans) {
        setTransparency(trans);
      } else {
        setTransparency(0);
      }
      // set tags
      let tags = campaignData?.campaignTags?.map((tag) => {
        return tag.campaignTag;
      });
      // aoudio
      let audio = [];
      mData?.map((data) => {
        let findInde = campaignData?.audios?.findIndex(
          (rdata) => rdata.contentId == data.mediaDetailId
        );
        if (findInde > -1) {
          audio.push(data);
        }
      });
      //backgroundImageContentId
      if (campaignData?.backgroundImageContentId) {
        let findIndex = mData?.findIndex(
          (rdata) =>
            rdata.mediaDetailId == campaignData?.backgroundImageContentId
        );
        if (findIndex > -1) {
          console.log("mData[findIndex]", mData[findIndex]);
          setSelectedBgImg(mData[findIndex]);
        }
      }

      console.log("audio", audio);
      console.log("tags", tags);
      if (campaignData?.campaignType?.toLowerCase() == "advertisement") {
        let du = secondsToHMS(campaignData?.totalDurationOfCampaignInSeconds);
        console.log(
          "campaignData?.duration",
          campaignData?.totalDurationOfCampaignInSeconds
        );
        let camDu = {
          hh: du.hours,
          mm: du.minutes,
          ss: du.seconds,
        };
        setDuration(camDu);
      }
      setCampaignType(campaignData?.campaignType?.toLowerCase());
      setRatioId(campaignData?.aspectRatio?.aspectRatioId);
      setSelAudioData([...audio]);
      setTempletTagArr([...tags]);
      setBgColor(campaignData?.backgroundColor);
      setCampaignName(campaignData?.campaignName);
      setValue(campaignData?.templateId);

      let postObj = {
        aspectRatioId: campaignData?.aspectRatio?.aspectRatioId,
        templateId: campaignData?.templateId,
        backgroundImageContentId: null,
        transparencyInPercentage: null,
        state: campaignData?.state,
        status: campaignData?.status,
        audioStartBasedOnCampaignDurationInSeconds: 0,
        audioEndBasedOnCampaignDurationInSeconds: 0,
        audios: campaignData?.audios,
        campaignTags: campaignData?.campaignTags,
        regions: regiondata,
        campaignName: campaignData?.campaignName,
        campaignDescription: campaignData?.campaignName,
      };
      setSelectedTemplet(postObj);
      console.log("finalRegionfinalRegion", finalRegion);
      console.log("postObj", postObj);
    }
  };
  function secondsToHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  }
  const btnGetCampaignDetails = async (campaignId) => {
    setIsLoading(true);
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: campaignId,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      console.log("CampaignString---suc", response);
      setIsLoading(false);
      if (response?.data) {
        btnSetCamapaignEditValues(response.data);
        // setSelectedCampaign(response.data);
        // btnSelectedCampaignData(response.data);
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("deleteCampaignString--error", error);
    };

    CampaignStringManagerService.fetchCampaignDetails(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  //end for edit
  const workFlow = useSelector((state) => state.userReducer.workFlow);
  // get media data
  React.useEffect(() => {
    getWorkFlow(navigation);
    getMediaDataForCampAdd(setIsLoading);
    getResolutionData(setIsLoading);
  }, []);
  // get template data
  React.useEffect(() => {
    getTempleteDataForCampAdd(setIsLoading);
  }, []);

  React.useEffect(() => {
    makeTemplateDropDownList();
  }, [templateList]);

  // manage media data====
  React.useEffect(() => {
    let imageMediaData1 = [];
    let imageMediaData12 = [];
    let imageMediaData123 = [];

    MediaList?.data?.mediaDetails?.map((item) => {
      if (item.type == "IMAGE" && item.isFileReadyForPlay == "PROCESSED") {
        imageMediaData1.push({ ...item, statusFlag: false });
      }
      if (item.isFileReadyForPlay == "PROCESSED" && item.type != "AUDIO") {
        imageMediaData12.push({ ...item, statusFlag: false });
      }
      if (item.isFileReadyForPlay == "PROCESSED" && item.type == "AUDIO") {
        imageMediaData123.push({ ...item, statusFlag: false });
      }
    });

    setImageMediaData([...imageMediaData1]);
    setMediaData([...imageMediaData12]);
    setAudioData([...imageMediaData123]);
  }, [MediaList]);

  const makeTemplateDropDownList = () => {
    if (templateList.length > 0) {
      const modifykeys = (data, index) => {
        const { templateName, templateId, ...rest } = data;
        return {
          label: templateName,
          value: templateId,
          templateName: templateName,
          templateId: templateId,
          ...rest,
        };
      };
      let modiFyiedData = templateList.map((data, index) =>
        modifykeys(data, index)
      );
      setTempleteShowList(modiFyiedData);
    }
  };

  const btnMakePostData = (item) => {
    let regins = item.regions.map((region1, index) => {
      return { ...region1, regionData: [] };
    });

    let postObj = {
      aspectRatioId: item?.aspectRatio?.aspectRatioId,
      templateId: item?.templateId,
      backgroundImageContentId: null,
      transparencyInPercentage: null,
      state: item?.tempState,
      status: item?.status,
      audioStartBasedOnCampaignDurationInSeconds: 0,
      audioEndBasedOnCampaignDurationInSeconds: 0,
      audios: [],
      campaignTags: [],
      regions: regins,
      campaignName: campaignName,
      campaignDescription: campaignName,
    };

    if (item?.layoutTags) {
      let layoutTags = item?.layoutTags.split(",");
      setTempletTagArr([...layoutTags]);
    }
    setSelectedTemplet(postObj);
  };

  const fnPlayningMedia = (item) => {
    if (mediaModalType == "image") {
      setSelectedBgImg(item[0]);
    } else if (mediaModalType == "regionMedia") {
      selectedTemplet.regions[activateRegion].contentToDisplay = item[0];

      let rData = item.map((region, rIndex) => {
        return {
          contentId: region?.mediaDetailId,
          contentVersionId: region?.version,
          contentType: "IMAGE",
          mediaDetailId: region?.mediaDetailId,
          mediaVersionId: region?.version,
          mediaType: region?.type,
          order: rIndex + 1,
          durationInSeconds: region?.defaultDurationInSeconds,
          transparencyInPercentage: 1,
          entryAnimationId: 1,
          exitAnimationId: 1,
          displayMode: "NORMAL",
        };
      });

      selectedTemplet.regions[activateRegion].regionData = item;
      selectedTemplet.regions[
        activateRegion
      ].globalRegionContentPlaylistContents = rData;
      setSelectedTemplet({ ...selectedTemplet });
    } else {
      setSelAudioData([...item]);
    }
  };
  const openArrangeModal = (index) => {
    setActiveRegion(index);
    setMediaModalType("regionMedia");
    setModal(true);
    // setArrangeModal(true);
  };

  const removeItemFromRegion = (index) => {
    console.log("idnexindex", index);
    return false;
    if (selectedTemplet.regions[activateRegion].regionData.length == 1) {
      delete selectedTemplet.regions[activateRegion]["contentToDisplay"];
    }
    selectedTemplet.regions[activateRegion].regionData.splice(index, 1);
    setSelectedTemplet({ ...selectedTemplet });
  };

  const removeTag = (index) => {
    if (templateTagArr.length > 0) {
      templateTagArr.splice(index, 1);
      setTempletTagArr([...templateTagArr]);
    }
  };
  const removeAudio = (index) => {
    if (seleAudioData.length > 0) {
      seleAudioData.splice(index, 1);
      setSelAudioData([...seleAudioData]);
    }
  };

  const onRegionChange = (item) => {
    let imageMediaData12 = [];
    mediaData?.map((item) => {
      if (item.isFileReadyForPlay == "PROCESSED" && item.type != "AUDIO") {
        imageMediaData12.push({ ...item, statusFlag: false });
      }
    });
    setMediaData([...imageMediaData12]);
    setSelectetRegionForEdit(-1);
    setValue(item.value);
    btnMakePostData(item);
  };
  const btnSubmitData = async (btnType) => {
    if (!campaignType) {
      Alert.alert("Please enter campaign type");
      return false;
    }
    campaignType != "advertisement"
      ? btnAddCampaignData(btnType)
      : btnAddAdvertiseData(btnType);
  };

  const btnAddAdvertiseData = async (btnType) => {
    if (campaignName.trim().length <= 0) {
      alert("Please enter campaign name");
      return false;
    }

    if (!ratioId) {
      alert("Please select aspect ratio");
      return false;
    }

    if (duration.hh == 0 && duration.mm == 0 && duration.ss == 0) {
      alert("Please enter duration");
      return false;
    }

    let total_seconds =
      parseFloat(duration.hh) * 3600 +
      parseFloat(duration.mm) * 60 +
      parseFloat(duration.ss);
    console.log("total_seconds", total_seconds);
    let postData = {
      aspectRatioId: ratioId,
      campaignName: campaignName,
      durationInHH: duration.hh,
      durationInMM: duration.mm,
      durationInSS: duration.ss,
      duration: total_seconds,
    };

    const slugId = await getStorageForKey("slugId");
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response.code == 200) {
        Alert.alert("Info!", "Campaign edit successfully", [
          {
            text: "Ok",
            onPress: () => {
              navigation.goBack();
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
      if (error?.response?.data?.data?.length > 0) {
        alert(error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };
    let params = {
      data: postData,
      slugId,
      campaignId: campaignItem?.campaignId,
    };
    setIsLoading(true);
    CampaignManagerService.editAdvertisement(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnAddCampaignData = async (btnType) => {
    if (campaignName.trim().length <= 0) {
      alert("Please enter campaign name");
      return false;
    }
    if (selectedTemplet == null) {
      Alert.alert("Please select a template");
      return false;
    }

    let returntype = true;
    if (selectedTemplet.regions.length > 0) {
      for (let index = 0; index < selectedTemplet.regions.length; index++) {
        if (
          selectedTemplet?.regions[index]?.regionData &&
          selectedTemplet?.regions[index]?.regionData?.length <= 0
        ) {
          Alert.alert(
            `Please select media for ${selectedTemplet.regions[index].templateRegionName} region`
          );
          returntype = false;
          break;
        }
      }
    }

    if (!returntype) {
      return false;
    }

    let selAudioData1 = [];
    if (seleAudioData.length > 0) {
      for (let index = 0; index < seleAudioData.length; index++) {
        selAudioData1.push({
          contentVersionId: seleAudioData[index].version,
          contentId: seleAudioData[index].mediaDetailId,
          order: index + 1,
        });
      }
    }
    let campTag = [];
    if (templateTagArr.length > 0) {
      campTag = templateTagArr.map((tag) => {
        return { campaignTag: tag };
      });
      selectedTemplet["campaignTags"] = campTag;
    }

    selectedTemplet["audios"] = selAudioData1;
    if (selectedBgImg != "") {
      selectedTemplet["backgroundImageContentId"] = selectedBgImg.mediaDetailId;
      selectedTemplet["backgroundImageContentVersionId"] =
        selectedBgImg.version;
    }

    selectedTemplet["campaignName"] = campaignName;
    selectedTemplet["campaignDescription"] = campaignName;
    selectedTemplet["state"] = "DRAFT";
    if (bgColor != "") {
      selectedTemplet["backgroundColor"] = bgColor;
    }
    if (transparency != "") {
      selectedTemplet["transparencyInPercentage"] = transparency;
    }
    if (selectedBgImg != "") {
      selectedTemplet["backgroundImageContentId"] =
        selectedBgImg?.mediaDetailId;
    }

    console.log("selectedTemplet", selectedTemplet);
    const slugId = await getStorageForKey("slugId");
    const succussCallBack = async (response) => {
      console.log("editCampaign success", response);
      setIsLoading(false);
      if (response.code == 200) {
        btnSubmittedStatus(response?.data?.campaignId, btnType);
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
      console.log("editCampaign error", JSON.stringify(error));
      if (error?.response?.data?.message) {
        alert(error?.response?.data?.message);
      } else if (error?.response?.data?.data?.length > 0) {
        alert(error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };
    let params = {
      data: selectedTemplet,
      slugId,
      campaignId: campaignItem?.campaignId,
    };
    setIsLoading(true);
    CampaignManagerService.editCampaign(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnSubmittedStatus = async (campaignId, btnType) => {
    if (btnType == "DRAFT") {
      Alert.alert("Info!", "Campaign updated successfully", [
        {
          text: "Ok",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
      return false;
    }

    const slugId = await getStorageForKey("slugId");
    let params = {
      slugId: slugId,
      campaignId: campaignId,
    };
    const succussCallBack = async (response) => {
      console.log(JSON.stringify(response), "campaignsubmit success");

      setIsLoading(false);
      if (response.code == 20) {
        Alert.alert("Info!", "Campaign saved successfully", [
          {
            text: "Ok",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else if (response.code == 21) {
        Alert.alert("Error!", response?.message, [
          {
            text: "Ok",
            onPress: () => {
              navigation.goBack();
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
      console.log(JSON.stringify(error), "campaignsubmit success");

      if (error?.response?.data?.data?.length > 0) {
        alert(error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };

    setIsLoading(true);
    CampaignManagerService.campaignSubmittedStatusAdd(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const removeRegionData = (index) => {
    selectedTemplet.regions[index].regionData = [];
    setSelectedTemplet({ ...selectedTemplet });
  };

  const onSubmitArrangeData = (rData, gData) => {
    selectedTemplet.regions[activateRegion].regionData = rData;
    selectedTemplet.regions[
      activateRegion
    ].globalRegionContentPlaylistContents = gData;
    setSelectedTemplet({ ...selectedTemplet });
  };

  const onChangeDuration = (value, type) => {
    const re = /^[0-9\b]+$/;
    if (value === "" || re.test(value)) {
      if (type === "HH" && value <= 23) {
        setDuration({ ...duration, hh: value });
      }
      if (type === "MM" && value <= 59) {
        setDuration({ ...duration, mm: value });
      }
      if (type === "SS" && value <= 59) {
        setDuration({ ...duration, ss: value });
      }
    }
  };

  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  useEffect(() => {
    setLocationSelected(locationData1);
  }, [locationData1]);
  const [locationModal, setLocationModal] = useState(false);
  const [locationSelected, setLocationSelected] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // const onChangeLocatioValue = (lData) => {
  //   selectedTemplet.regions[selectRegionForEdit]["locationIds"] = lData;
  //   setSelectedTemplet({ ...selectedTemplet });
  // };
  const onChangeLocatioValue = (lData, ljsonData) => {
    console.log("locationSelectedlocationSelected", ljsonData?.locationName);
    selectedTemplet.regions[selectRegionForEdit]["locationIds"] = lData;
    setSelectedTemplet({ ...selectedTemplet });
    setLocationName(ljsonData?.locationName);
  };

  const customization = function () {
    if (!selectedTemplet.regions[selectRegionForEdit]["customizCheck"]) {
      setSelectedLocations([]);
      setLocationModal(true);
      selectedTemplet.regions[selectRegionForEdit]["customizCheck"] = true;
      setSelectedTemplet({ ...selectedTemplet });
    } else {
      selectedTemplet.regions[selectRegionForEdit]["locationIds"] = [];
      selectedTemplet.regions[selectRegionForEdit]["customizCheck"] = false;
      setSelectedTemplet({ ...selectedTemplet });
    }
  };

  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      <Loader visible={isLoading} />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {modal && (
          <SelectMediaModal
            data={
              mediaModalType == "regionMedia"
                ? mediaData
                : mediaModalType == "image"
                ? imageMediaData
                : audioData
            }
            regionData={
              selectedTemplet?.regions
                ? selectedTemplet?.regions[activateRegion]?.regionData
                : []
            }
            selectedBgImg={selectedBgImg}
            seleAudioData={seleAudioData}
            mediaModalType={mediaModalType}
            onClick={fnPlayningMedia}
            setArrangeModal={setArrangeModal}
            setModal={setModal}
          />
        )}

        {cmpArrangeModal && (
          <CampaignArrangeMedia
            data={selectedTemplet?.regions}
            removeItemFromRegion={removeItemFromRegion}
            setArrangeModal={setArrangeModal}
            activateRegion={activateRegion}
            setCmpArrangeModal={setCmpArrangeModal}
            onSubmitArrangeData={onSubmitArrangeData}
          />
        )}

        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Edit Campaign"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View style={Styles.bodyContainer}>
            <AppText style={Styles.bodyHeaderText}>
              EDIT CAMPAIGN DETAILS
            </AppText>
            <Separator />
            <View style={Styles.bodyRowsContainer}>
              <AppText style={Styles.labeltext}>Campaign Type</AppText>

              <CampaignDropDown
                dataList={[
                  { label: "Normal", value: "normal" },
                  { label: "Advertisement", value: "advertisement" },
                ]}
                placeHolderText="Select Campaign Type*"
                onChange={(item) => {
                  setCampaignType(item.value);
                }}
                value={campaignType}
              />
              <AppText style={Styles.labeltext}>Campaign Name</AppText>

              <AppTextInput
                containerStyle={Styles.eventTitleInput}
                placeHolderText="Campaign Name *"
                placeholderTextColor={themeColor.placeHolder}
                value={campaignName}
                onChangeText={(text) => {
                  setCampaignName(text);
                }}
                textInputStyle={{
                  fontSize: moderateScale(15),
                }}
              />
              {campaignType?.toLowerCase() == "advertisement" && (
                <View style={{ marginBottom: 5 }}>
                  <AppText style={Styles.labeltext}>Aspect ratio</AppText>

                  <CampaignDropDown
                    dataList={ratioList}
                    placeHolderText="Select aspect ratio*"
                    onChange={(item) => {
                      setRatioId(item.value);
                    }}
                    value={ratioId}
                  />
                </View>
              )}
              {campaignType?.toLowerCase() == "advertisement" && (
                <>
                  <AppText style={Styles.labeltext}>Duration*</AppText>
                  <View style={Styles.durartionContainer}>
                    <AppTextInput
                      containerStyle={Styles.durationTitleInput}
                      placeHolderText="HH"
                      placeholderTextColor={themeColor.placeHolder}
                      value={duration.hh?.toString()}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        onChangeDuration(text, "HH");
                      }}
                      textInputStyle={{
                        fontSize: moderateScale(15),
                      }}
                    />
                    <AppTextInput
                      containerStyle={Styles.durationTitleInput}
                      placeHolderText="MM"
                      placeholderTextColor={themeColor.placeHolder}
                      value={duration.mm?.toString()}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        onChangeDuration(text, "MM");
                      }}
                      textInputStyle={{
                        fontSize: moderateScale(15),
                      }}
                    />
                    <AppTextInput
                      containerStyle={Styles.durationTitleInput}
                      placeHolderText="SS"
                      placeholderTextColor={themeColor.placeHolder}
                      value={duration.ss?.toString()}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        onChangeDuration(text, "SS");
                      }}
                      textInputStyle={{
                        fontSize: moderateScale(15),
                      }}
                    />
                  </View>
                </>
              )}

              {campaignType?.toLowerCase() != "advertisement" && (
                <>
                  <AppText style={Styles.labeltext}>Templates *</AppText>
                  <CampaignDropDown
                    dataList={templateShowList}
                    Styles={Styles}
                    isDisabled={true}
                    onChange={(item) => {
                      onRegionChange(item);
                    }}
                    value={value}
                  />
                  <AppText style={Styles.labeltext}>Audio </AppText>

                  <SelectAudio
                    isDisabled={!selectedTemplet ? true : false}
                    data={seleAudioData}
                    setMediaModalType={(i) => setMediaModalType(i)}
                    setModal={setModal}
                    removeAudio={(i) => removeAudio(i)}
                  />
                  <AppText style={Styles.labeltext}>Tags </AppText>

                  <CampaignAddTag
                    data={templateTagArr}
                    templateTag={templateTag}
                    removeTag={removeTag}
                    setTempletTag={setTempletTag}
                    setTempletTagArr={setTempletTagArr}
                    templateTagArr={templateTagArr}
                  />
                  <AppText style={Styles.labeltext}>Background Image </AppText>

                  <TouchableOpacity
                    style={Styles.mainSelectImageContainer}
                    disabled={!selectedTemplet ? true : false}
                    onPress={() => {
                      setMediaModalType("image");
                      setModal(true);
                    }}
                  >
                    {selectedBgImg && (
                      <Pressable
                        onPress={() => {
                          setSelectedBgImg("");
                        }}
                        style={{
                          height: 30,
                          width: 30,
                          position: "absolute",
                          right: 7,
                          top: 7,
                        }}
                      >
                        <Image
                          style={{ height: 30, width: 30 }}
                          source={CrossImage}
                        />
                      </Pressable>
                    )}
                    {selectedBgImg ? (
                      <Image
                        source={{
                          uri: selectedBgImg?.imageUrl,
                        }}
                        style={{ width: 90, height: 90 }}
                      />
                    ) : (
                      <>
                        <Image
                          source={require("../../Assets/Images/PNG/select.png")}
                          style={{ width: 90, height: 90 }}
                        />
                        <Text style={{ color: "#ADB2C3" }}>
                          Upload background image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <AppText style={Styles.labeltext}>Background Color </AppText>

                  <ColorModalPicker
                    setModal={setColorModal}
                    modal_flag={colorModal}
                    setBgColor={setBgColor}
                  />

                  <TouchableOpacity
                    isDisabled={!selectedTemplet ? true : false}
                    onPress={() => setColorModal(true)}
                  >
                    <View style={Styles.colorPickerBox}>
                      <AppText style={{ color: "#ADB2C3" }}>
                        Select background color
                      </AppText>
                      <View
                        style={[
                          Styles.colorPickerSeleBox,
                          { backgroundColor: bgColor },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                  {selectedBgImg && (
                    <>
                      <AppText style={[[Styles.titleStyle, { marginTop: 10 }]]}>
                        {"Set Background Media Transparency"}
                      </AppText>
                      <Slider
                        style={{
                          width: moderateScale(340),
                          height: 40,
                          marginLeft: -7,
                        }}
                        minimumValue={0}
                        value={transparency}
                        maximumValue={1}
                        onValueChange={(value) => {
                          setTransparency(value);
                        }}
                        minimumTrackTintColor="#223577"
                        maximumTrackTintColor="#000000"
                      />
                    </>
                  )}
                </>
              )}
            </View>
            {campaignType?.toLowerCase() != "advertisement" && (
              <>
                {/*Region===============================regions====== */}
                {selectedTemplet?.regions && (
                  <View
                    style={{
                      height: 400,
                      width: "100%",
                      borderRadius: 2,
                      borderWidth: 1,
                      padding: 5,
                    }}
                  >
                    <ImageBackground
                      imageStyle={{
                        borderRadius: 5,
                        height: "100%",
                        width: "100%",
                        position: "relative",
                        backgroundColor: bgColor,
                        // opacity: transparency,
                        opacity: !selectedBgImg ? 1 :  1-transparency ,
                      }}
                      source={
                        selectedBgImg ? { uri: selectedBgImg.imageUrl } : null
                      }
                    >
                      <CampaignRegion
                        setLocationName={setLocationName}
                        selectedBgImg={mediaModalType}
                        removeRegionData={removeRegionData}
                        regions={selectedTemplet?.regions}
                        setActiveRegion={setActiveRegion}
                        setSelectetRegionForEdit={setSelectetRegionForEdit}
                        setCmpArrangeModal={setCmpArrangeModal}
                        selectMediaForRegion={(index) => {
                          openArrangeModal(index);
                        }}
                      />
                    </ImageBackground>
                  </View>
                )}

                {selectedTemplet?.regions && selectRegionForEdit > -1 && (
                  <View style={{ padding: 5 }}>
                    <AppText style={[Styles.regionSubTitleStyle]}>
                      {
                        selectedTemplet.regions[selectRegionForEdit][
                          "templateRegionName"
                        ]
                      }
                    </AppText>
                    {/* <View style={{ marginTop: 10 }}>
                      <AppText style={[Styles.titleStyle]}>{"zIndex"}</AppText>
                      <AppTextInput
                        editable={false}
                        containerStyle={Styles.eventTitleInput}
                        value={
                          selectedTemplet?.regions[
                            selectRegionForEdit
                          ]?.zIndex.toString() || 0
                        }
                        placeHolderText="Enter zIndex"
                        placeholderTextColor={themeColor.placeHolder}
                        onChangeText={(txt) => {
                          selectedTemplet.regions[selectRegionForEdit][
                            "zIndex"
                          ] = txt;
                          setSelectedTemplet({ ...selectedTemplet });
                        }}
                        textInputStyle={{
                          fontSize: moderateScale(15),
                        }}
                      />
                    </View> */}

                    <View style={{ marginTop: 8 }}>
                      <AppText style={[Styles.titleStyle]}>
                        {"Set Media Transparency"}
                      </AppText>
                      <Slider
                        style={{
                          width: moderateScale(344),
                          height: 40,
                          marginLeft: -7,
                        }}
                        minimumValue={0}
                        value={
                          selectedTemplet.regions[selectRegionForEdit][
                            "regionTransparencyInPercentage"
                          ] || 0
                        }
                        maximumValue={1}
                        onValueChange={(value) => {
                          selectedTemplet.regions[selectRegionForEdit][
                            "regionTransparencyInPercentage"
                          ] = value ;
                          setSelectedTemplet({ ...selectedTemplet });
                        }}
                        minimumTrackTintColor="#223577"
                        maximumTrackTintColor="#000000"
                      />
                    </View>
                    <View style={Styles.audioBox}>
                      <AppText style={[Styles.titleStyle]}>
                        {"Audio (ON/Off)"}
                      </AppText>
                      <Switch
                        color={"#253D91"}
                        value={
                          selectedTemplet?.regions[selectRegionForEdit]
                            ?.isAudioEnabled || false
                        }
                        onValueChange={(txt) => {
                          selectedTemplet.regions[selectRegionForEdit][
                            "isAudioEnabled"
                          ] = txt;
                          setSelectedTemplet({ ...selectedTemplet });
                        }}
                      />
                    </View>
                    <Text
                      style={{ color: "#000000", fontSize: 14, marginTop: 15 }}
                    >
                      Offset
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <CommonTitleAndText
                        title="Width"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "widthInPixel"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                      <CommonTitleAndText
                        title="Height"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "heightInPixel"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                      <CommonTitleAndText
                        title="Top"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "topLeftCoordinateYInPixel"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                      <CommonTitleAndText
                        title="Left"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "topLeftCoordinateXInPixel"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                    </View>
                    <CommonTitleAndText
                        title="Zindex"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "zIndex"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                    {/*=============cutomize checkbox======== */}
                    <Pressable
                      style={{
                        flexDirection: "row",
                        marginTop: 20,
                      }}
                      onPress={() => {
                        customization();
                      }}
                    >
                      <View>
                        {!selectedTemplet?.regions[selectRegionForEdit]
                          .customizCheck ? (
                          <MaterialIcons
                            name="check-box-outline-blank"
                            color={"#253D91"}
                            size={25}
                          />
                        ) : (
                          <MaterialIcons
                            name="check-box"
                            color={themeColor.themeColor}
                            size={25}
                          />
                        )}
                      </View>
                      {/*  */}
                      <AppText>Do you want to allow customization?</AppText>
                    </Pressable>

                    {selectedTemplet.regions[selectRegionForEdit]["locationIds"]
                      .length > 0 && (
                      <AppText
                        style={{
                          marginTop: 10,
                          fontSize: moderateScale(16),
                          color: "#000000",
                        }}
                      >
                        {locationName && locationName}
                      </AppText>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <ActionContainer
        isContinue={campaignType == "advertisement" && true}
        continueText={campaignType == "advertisement" && "Save & Next"}
        saveText={
          workFlow &&
          (workFlow?.approverWorkFlow === "CAMPAIGN" ||
            workFlow?.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN")
            ? "Send for approval"
            : "Save & Next"
        }
        numOfButtons={2}
        onPressSave={() => {
          btnSubmitData("SUBMITTED");
        }}
        onPressCancel={() => {
          navigation.goBack();
        }}
        onPressDraft={() => {
          btnSubmitData("DRAFT");
        }}
      />
      <SelectLocationModalForCampaign
        visible={locationModal}
        setModal={setLocationModal}
        setIsLoading={setIsLoading}
        locationSelected={locationSelected}
        setLocationSelected={setLocationSelected}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        locationData1={locationData1}
        onChangeLocatioValue={onChangeLocatioValue}
      />
    </View>
  );
};
export default EditCampaign;
