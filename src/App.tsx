import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./style/App.scss";

import Navbar from "./components/Navbar";

import FrontPage from "./components/FrontPage";
import SignInPage from "./components/SignInPage";
import QuestionPage from "./components/QuestionPage";
import NewQuestionPage from "./components/NewQuestionPage";

const App = () => {
  return (
  <Router>
    <div className="App container">
      <Navbar />

      <div className="wrapper">
        <Route exact path="/" component={ FrontPage } />
        <Route path="/signin" component={ SignInPage } />
        <Route path="/question/:questionId" component={ QuestionPage } />
        <Route path="/newquestion" component={ NewQuestionPage } />
      </div>
    </div>
  </Router>
  );
}

export default App;
