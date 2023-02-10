import "./App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import CustomRoute from "./routing/routing";

function App() {

  return (
    <React.Fragment>
      <BrowserRouter>
        <CustomRoute />
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
