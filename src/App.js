import "./App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import CustomRoute from "./routing/routing";
import PushNotification from "./component/counsellor/pushnotification";

function App() {

  return (
    <React.Fragment>
      <BrowserRouter>
        <CustomRoute />
        <PushNotification />
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
