import React, { useEffect, useState } from "react";
import { LogBox, SafeAreaView, StatusBar } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import AppRouter from "./src/appConfig/AppRouter/router";
import Store from "./src/appConfig/Redux/store";
import { ThemeContext } from "./src/appConfig/AppContext/themeContext";
import Color from "./src/Assets/Color/Color";
import AppLoader from "./src/Components/Atoms/Loader";
import { getStorageForKey } from "./src/Services/Storage/asyncStorage";
import { NAVIGATION_CONSTANTS } from "./src/Constants/navigationConstant";
import { PaperProvider } from "react-native-paper";
import {
  setIsScheduler,
  setUserAuthorizations,
} from "./src/appConfig/Redux/Action/userAction";
// import 'react-native-gesture-handler ';

LogBox.ignoreAllLogs();

const App = () => {
  const { appLoader } = useSelector((state) => state.CommonReducer);
  const dispatch = useDispatch();
  const [initialScreen, setInitialScreen] = useState();
  const [isShow, setIsShow] = useState(false);
  const handleStack = async () => {
    const logged = await getStorageForKey("logged");
    if (logged === "true") {
      var authorization = await getStorageForKey("authorities");
      if (authorization) {
        dispatch(setUserAuthorizations(JSON.parse(authorization)));
      }
      var isScheduler = await getStorageForKey("is_scheduler_enabled");
      if (isScheduler) {
        dispatch(setIsScheduler(isScheduler));
      }
      setInitialScreen(NAVIGATION_CONSTANTS.DRAWER_STACK);
      setIsShow(true);
    } else {
      setInitialScreen(NAVIGATION_CONSTANTS.LOGIN);
      setIsShow(true);
    }
  };
  useEffect(() => {
    handleStack();
  });
  return (
    <ThemeContext.Provider value={Color.lightThemeColors}>
      <PaperProvider>
        {appLoader && <AppLoader />}
        {isShow ? <AppRouter initialScreen={initialScreen} /> : <AppLoader />}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

const ReduxApp = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={"#000"} />
      <Provider store={Store}>{<App />}</Provider>
    </SafeAreaView>
  );
};
export default ReduxApp;
