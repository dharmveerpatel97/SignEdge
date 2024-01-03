import { Alert } from "react-native";
import {
  ResolutionManagerService,
  TemplateService,
  MediaLibraryService,
  CampaignManagerService,
  CommonService,
} from ".";
import {
  updateArchivedList,
  updateMediaLib,
} from "../../appConfig/Redux/Action/mediaLibAction";
import {
  removeResolutionList,
  updateResolutionList,
} from "../../appConfig/Redux/Action/resolutionManagerAction";
import {
  removeTemplateList,
  updateTemplates,
  updateTemplatesPagination,
} from "../../appConfig/Redux/Action/templateManagerAction";
import Store from "../../appConfig/Redux/store";
import { _getAllMediaBySearchFilter } from "../../screens/MediaLibrary";
import { getStorageForKey } from "../Storage/asyncStorage";
import { updateCampaingnList } from "../../appConfig/Redux/Action/campaignAction";
import { updateIsApprover, updateUserWorkFlow } from "../../appConfig/Redux/Action/userAction";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";

const { dispatch } = Store;

export const getResolutionData = async (setIsLoading = () => {}) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);

  const modifykeys = (data) => {
    const {
      actualHeightInPixel,
      actualWidthInPixel,
      defaultWidthInPixel,
      defaultHeightInPixel,
      aspectRatio,
      ...rest
    } = data;
    return {
      aspectRatio: aspectRatio,
      actualWidth: actualWidthInPixel,
      actualHeight: actualHeightInPixel,
      resolutions: `${aspectRatio} (${defaultWidthInPixel} x ${defaultHeightInPixel})`,
      ...rest,
    };
  };

  const successCallBack = async (response) => {
    const modifyData = response?.data.map((data) => modifykeys(data));
    dispatch(updateResolutionList(modifyData));
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

export const bulkDeleteResolutionData = async (
  params = {},
  success = () => {},
  failure = () => {}
) => {
  const slugId = await getStorageForKey("slugId");
  const successCallBack = (response) => {
    if (response?.data?.success?.length > 0) {
      const aspectRatioIds = response?.data?.success;
      dispatch(removeResolutionList(aspectRatioIds));
      success(response);
    }
  };

  const errorCallback = (error) => {
    failure(error);
  };

  ResolutionManagerService.BulkDeleteResolution(
    { ...params, slugId },
    successCallBack,
    errorCallback
  );
};

export const getTemplateData = async (setIsLoading = () => {}, params = {}) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);

  // const modifykeys = (data) =>{
  //   const {tempState, templateDesc, noOfRegion,...rest} = data
  //   return {state: tempState, description: templateDesc, numberOfRegion: noOfRegion, ...rest}
  // }

  const successCallBack = async (response) => {
    // const modifyData = response?.data.map((data)=> modifykeys(data) )
    console.log("responsedata template", response?.data);
    dispatch(updateTemplates(response?.data));
    dispatch(updateTemplatesPagination(response.paginationDetail));
    setIsLoading(false);
  };

  const errorCallBack = (error) => {
    setIsLoading(false);
  };

  TemplateService.fetchTemplateList(
    { ...params, slugId },
    successCallBack,
    errorCallBack
  );
};

export const getTemplateData2 = async (
  setIsLoading = () => {},
  params = {}
) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);

  // const modifykeys = (data) =>{
  //   const {tempState, templateDesc, noOfRegion,...rest} = data
  //   return {state: tempState, description: templateDesc, numberOfRegion: noOfRegion, ...rest}
  // }

  const successCallBack = async (response) => {
    // const modifyData = response?.data.map((data)=> modifykeys(data) )
    // console.log("responsedata template", response?.data);
    dispatch(updateTemplates(response?.data));
    dispatch(updateTemplatesPagination(response.paginationDetail));
    setIsLoading(false);
  };

  const errorCallBack = (error) => {
    setIsLoading(false);
    Alert.alert("Error", error.message);
  };

  TemplateService.fetchTemplateList2(params, successCallBack, errorCallBack);
};

export const getMediaLibData = async (setIsLoading = () => {}, params, q) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);

  let myurl = q.toString();
  console.log("/n/n params==>", String(q).length);
  console.log("/n/n myurl==>", myurl);
  console.log("/n/n qqq", q);

  let nUrl = `/v1/media/search?${String(q).length != 0 ? "q=" + q : "q="}${
    params.mediaName ? "&mediaName=" + params.mediaName : ""
  }${params.tag ? "&tag=" + params.tag : ""}${
    params.uploadedBy ? "&uploadedBy=" + params.uploadedBy : ""
  }${params.duration ? "&duration=" + params.duration : ""}${
    params.uploadedDate ? "&uploadedDate=" + params.uploadedDate : ""
  }&page=${params.page}&pageSize=${params.pageSize}&isArchive=${
    params.isArchive
  }`;

  const successCallBack = async (response) => {
    dispatch(updateMediaLib(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const errorCallBack = (error) => {
    console.log("error in getMediaLibData", error.message, params, slugId);
    setIsLoading(false);
  };

  MediaLibraryService.fetchMediaLibList(
    { ...params, slugId, url: nUrl },
    successCallBack,
    errorCallBack
  );
};

export const getArchivedList = async (setIsLoading = () => {}, params, q) => {
  const slugId = await getStorageForKey("slugId");
  let myurl = _getAllMediaBySearchFilter(q);

  // let nUrl = `/v1/media/archive?${String(q).length != 0 ? "q=" + q : "q="}${params.mediaName ? "&mediaName=" + params.mediaName : ""}&page=${params.page}&pageSize=${params.pageSize}`;

  let nUrl = `/v1/media/search?${String(q).length != 0 ? "q=" + q : "q="}${
    params.mediaName ? "&mediaName=" + params.mediaName : ""
  }${params.tag ? "&tag=" + params.tag : ""}${
    params.uploadedBy ? "&uploadedBy=" + params.uploadedBy : ""
  }${params.duration ? "&duration=" + params.duration : ""}${
    params.uploadedDate ? "&uploadedDate=" + params.uploadedDate : ""
  }&page=${params.page}&pageSize=${params.pageSize}&isArchive=${true}`;

  const successCallBack = async (response) => {
    dispatch(updateArchivedList(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const errorCallBack = (error) => {
    console.log("error in getArchivedList", error.message, params);
    setIsLoading(false);
  };

  MediaLibraryService.getArchiveMedia(
    { ...params, slugId, url: nUrl },
    successCallBack,
    errorCallBack
  );
};

export const uploadMediaFIle = async (setIsLoading = () => {}, params) => {
  const slugId = await getStorageForKey("slugId");

  const successCallBack = async (response) => {
    console.log("media upload", response?.data);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const errorCallBack = (error) => {
    console.log("error in media upload", error.message, params);
    setIsLoading(false);
  };

  MediaLibraryService.UploadMediafileLib(
    { ...params, slugId },
    successCallBack,
    errorCallBack
  );
};

export const uploadMedia = async (
  setIsLoading = () => {},
  params,
  onComplete = () => {}
) => {
  const slugId = await getStorageForKey("slugId");

  const successCallBack = async (response) => {
    console.log(
      "this is media upload list===>",
      params,
      "\n",
      JSON.stringify(response)
    );
    onComplete(response);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const errorCallBack = (error) => {
    console.log("error in upload media file", error.response);
    Alert.alert("in", JSON.stringify(error.response));
    setIsLoading(false);
  };

  MediaLibraryService.uploadMediaLibApi(
    { ...params, slugId },
    successCallBack,
    errorCallBack
  );
};

export const updateToArchive = async (data, url, onSuccess) => {
  var slugId = "";
  try {
    slugId = await getStorageForKey("slugId");
  } catch (error) {
    console.log(error);
  }

  const params = {
    ids: [data],
    url,
    url,
    slugId,
  };

  const succussCallBack = async (response) => {
    if (response.status == "OK") {
      console.log("response  archive", response);
      await onSuccess();
    } else {
      console.log("response of error in archive", response);
    }
  };

  const failureCallBack = (error) => {
    console.log("error of archive media", error, slugId);
    Alert.alert(error.message);
  };

  MediaLibraryService.ChangeToArchive(params, succussCallBack, failureCallBack);
};

export const getWorkFlow = async (navigation) => {
  var slugId = await getStorageForKey("slugId");
  const params = {
    slugId,
  };
  const succussCallBack = async (response) => {
    console.log("get work flow success =====================>", response);
    if (response.httpStatusCode == "200") {
      dispatch(updateUserWorkFlow(response?.data));
    }
  };

  const failureCallBack = (error) => {
    console.log("get work flow error", error);
    console.log("get work flow error", error?.response?.data?.message);
    if (error?.response?.data?.code == 401) {
      Alert.alert(error?.response?.data?.name, error?.response?.data?.message, [
        {
          text: "Ok",
          onPress: () => {
            navigation.navigate(NAVIGATION_CONSTANTS.LOGIN);
          },
        },
      ]);
    }
    //
  };

  CommonService.getWorkFlow(params, succussCallBack, failureCallBack);
};

export const checkIsApprove =async ()=>{
  console.log("checkIsApprove");
  var slugId = await getStorageForKey("slugId");
  const params = {
    slugId,
  };
  const succussCallBack = async (response) => {
    console.log("get work flow approve success", JSON.stringify(response));
    if (response.httpStatusCode == "200") {
      dispatch(updateIsApprover(Boolean(response?.data?.isApprover)));
    }
  };

  const failureCallBack = (error) => {
    console.log("get work flow error", error);
    console.log("get work flow error", error?.response?.data?.message);
    //
  };

  CommonService.checkIsApprover(params, succussCallBack, failureCallBack);
}
