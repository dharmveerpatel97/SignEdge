import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import ThemedButton from "../../../Atoms/ThemedButton";
import { moderateScale } from "../../../../Helper/scaling";
import ModalWithInputField from "./ModalWithInputField";
import { CampaignManagerService } from "../../../../screens/Campaign/CompainApi";
import { getStorageForKey } from "../../../../Services/Storage/asyncStorage";
import { NAVIGATION_CONSTANTS } from "../../../../Constants/navigationConstant";

export default function CampaignPrewiewActions({ campaignItem, navigation,setIsLoading }) {
  const [reasonModal, seReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const btnConfirmPopup = async (type) => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to Approve this Campaign?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            onSubmitApprove();
          },
        },
      ]
    );
  };

  const onSubmitModal = async () => {
    // alert(reason)
    if (reason.trim().length <= 0) {
      setErrorMessage("Enter reason");
      return false;
    } else {
      setErrorMessage("");
    }
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      campaignId: campaignItem?.campaignId,
      reason: reason,
    };
    setIsLoading(true)

    const succussCallBack = async (response) => {
    setIsLoading(false)
      console.log(response);
      seReasonModal(false);
      if (response.name == "SuccessFullySaved") {
        Alert.alert("Success", "Campaign rejected successfully", [
          {
            text: "Ok",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }else if(response.name && response.name == "UnAuthorized"){
        Alert.alert(response?.name, response?.message, [
          {
            text: "Ok",
            onPress: () => {
              navigation.navigate(NAVIGATION_CONSTANTS.LOGIN);
            },
          },
        ]);
      } else if (response?.code != 200) {
        alert(response?.data[0].message);
      }
    };
    const failureCallBack = (error) => {
    setIsLoading(false)
      seReasonModal(false);
      console.log("error----------", error);
    };
    CampaignManagerService.onCancelApprove(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const onSubmitApprove = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      campaignId: campaignItem?.campaignId,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
    setIsLoading(false)

      if (response.name == "SuccessFullySaved") {
        Alert.alert("Success", "Campaign approved successfully", [
          {
            text: "Ok",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }else if(response.name && response.name == "UnAuthorized"){
        Alert.alert(response?.name, response?.message, [
          {
            text: "Ok",
            onPress: () => {
              navigation.navigate(NAVIGATION_CONSTANTS.LOGIN);
            },
          },
        ]);
      }else if(response.name && response.name != "SuccessFullySaved"){
        alert(response.message);
      }else if (response?.code != 200) {
        alert(response?.data[0].message);
      }
    };
    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("error----------", error);
    };
    CampaignManagerService.onApprove(params, succussCallBack, failureCallBack);
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: moderateScale(10),
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <ModalWithInputField
        visible={reasonModal}
        visibleAction={seReasonModal}
        onSubmitModal={onSubmitModal}
        value={reason}
        setValue={setReason}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <ThemedButton
        onClick={() => {
          navigation.goBack();
        }}
        title={"Cancel"}
        containerStyle={{ width: "30%", backgroundColor: "#dc3545" }}
      />
      {campaignItem?.state !== "DRAFT" && (
        <>
          <ThemedButton
            onClick={() => {
              btnConfirmPopup("approve");
            }}
            title={"Approve"}ƒ
            containerStyle={{ width: "30%", backgroundColor: "#ffc107" }}
          />
          <ThemedButton
            onClick={() => {
              seReasonModal(true);
            }}
            title={"Reject"}
            containerStyle={{ width: "30%", backgroundColor: "orange" }}
          />
        </>
      )}
    </View>
  );
}
