import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import Login from "../../screens/Login";
import DrawerStack from "./drawer";
import { CommonHeader } from "./CommonHeader";
import AddMediaLibrary from "../../screens/AddMediaLibrary";
import RegisterDevice from "../../screens/RegisterDevice";
import Planogram from "../../screens/Planogram";
import AddNewPlanogram from "../../screens/AddNewPlanogram";
import PlanogramIndexView from "../../screens/Planogram/PlanogramIndexView";
import PlanogramEdit from "../../screens/Planogram/PlanogramEdit";
import CmpDetail from "../../screens/Campaign/CmpDetail";
import EditCampaign from "../../screens/AddCampaign/EditCampaign";
import EditRegisterDevice from "../../screens/RegisterDevice/EditRegisterDevice";
import CalenderView from "../../screens/Device/CalenderView";
import EditUnRegisterDevice from "../../screens/RegisterDevice/EditUnRegisterDevice";
import AddCampaign from "../../screens/AddCampaign";
import CampaignManagement from "../../screens/Campaign";
import ReplaceDevice from "../../screens/RegisterDevice/ReplaceDevice";
import ReplaceUnregDeviceForm from "../../screens/RegisterDevice/ReplaceUnregDeviceForm";
import ReplaceDeviceForm from "../../screens/RegisterDevice/ReplaceDeviceForm";
import ChangePassword from "../../Components/Organisms/Dashboard/ChangePassword";
import DraggableCompents from "../../screens/MediaPlayerGroups/DraggableCompents";
import CampainDtringDetails from "../../screens/CampaignString/CampainDtringDetails";
import PlanogramApproveView from "../../screens/Planogram/PlanogramApproveView";
import SchedulerIndexView from "../../screens/Scheduler/SchedulerIndexView";
import Scheduler from "../../screens/Scheduler";
import AddScheduler from "../../screens/AddScheduler";
import WhiteScreen from "../../screens/OnBoard/WhiteScreen";
import CampaignPreviwPage from "../../screens/Campaign/CampaignPreviwPage";
import CampaignStringDetails from "../../screens/CampaignString/CampaignStringDetails";
import CmpDetailMediaApproval from "../../screens/Campaign/CmpDetailMediaApproval";
import ApprocalFlow from "../../screens/ApprovalFlow";
import CampStrApproval from "../../screens/CampaignString/CampStrApproval";
const AppRouter = ({ initialScreen }) => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialScreen}
      >
        <Stack.Screen name={NAVIGATION_CONSTANTS.LOGIN} component={Login} />
        <Stack.Screen
          name={"DraggableCompents"}
          component={DraggableCompents}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.DRAWER_STACK}
          component={DrawerStack}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.WHITE_SCREEN}
          component={WhiteScreen}
        />
        <Stack.Screen
          name={"CmpDetailApproval"}
          component={CmpDetailMediaApproval}
        />
        <Stack.Screen
          name={"CampainDtringDetails"}
          component={CampainDtringDetails}
        />
        <Stack.Screen
          name={"CampaignPreviwPage"}
          component={CampaignPreviwPage}
        />
        <Stack.Screen
          name={"PlanogramApproveView"}
          component={PlanogramApproveView}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.SCHEDULER_VIEW}
          component={SchedulerIndexView}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.SCHEDULER}
          component={Scheduler}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.ADD_SCHEDULER}
          component={AddScheduler}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.ADD_MEDIA_LIBRARY}
          component={AddMediaLibrary}
        />
        <Stack.Screen
          name={"CampaignStringDetails"}
          component={CampaignStringDetails}
        />
         <Stack.Screen
          name={"CampStrApproval"}
          component={CampStrApproval}
        />
        <Stack.Screen name={"CalenderView"} component={CalenderView} />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.REGISTER_NEW_DEVICE}
          component={RegisterDevice}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.EDIT_UN_REGISTER_DEVICE}
          component={EditUnRegisterDevice}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.PLANOGRAM}
          component={Planogram}
        />

        <Stack.Screen
          name={NAVIGATION_CONSTANTS.PLANOGRAM_VIEW}
          component={PlanogramIndexView}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.PLANOGRAM_EDIT}
          component={PlanogramEdit}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.CMP_VIEW}
          component={CmpDetail}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.EDIT_CAMPAIGN}
          component={EditCampaign}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.EDIT_REGISTER_DEVICE}
          component={EditRegisterDevice}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.ADD_NEW_CAMPAIGN}
          component={AddCampaign}
        />

        <Stack.Screen
          name={NAVIGATION_CONSTANTS.CAMPAIGN}
          component={CampaignManagement}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.ADD_NEW_PLANOGRAM}
          component={AddNewPlanogram}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.REPLACE_DEVICE}
          component={ReplaceDevice}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.REPLACE_UN_REG_DEVICE_FORM}
          component={ReplaceUnregDeviceForm}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.REPLACE_DEVICE_FORM}
          component={ReplaceDeviceForm}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.CHANGE_PASSWORD}
          component={ChangePassword}
        />
        {/* <Stack.Screen
          name={NAVIGATION_CONSTANTS.APPROVAL_FLOW}
          component={ApprocalFlow}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppRouter;
