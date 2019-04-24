import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import APIAccess from "../../lib/API";

import "./FrontPage.scss";

import { IQuestion } from "../QuestionPage";
import QuestionPreview from "../QuestionPreview";

const FrontPage = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  // Fetch data when the component gets mounted
  useEffect(() => {
    APIAccess.getData<IQuestion[]>("/question/top").then(newQuestions => 
      setQuestions(newQuestions)
    );
  }, []);

  return (
    <div className="frontPage">
      <div className="columns">
        <div className="column">
          <h1 className="title is-3">Popular Questions</h1>
        </div>

        {
          APIAccess.isLoggedIn() &&
          <div className="column is-2">
            <p className="control">
              <Link className="button is-primary" to="/newquestion" id="ask-question-button">Ask Question</Link>
            </p>
          </div>
        }
      </div>
      <div className="question-list">
        { 
          questions.map(question => {
            return (<QuestionPreview {...question} key={question._id} />);
          })
        }
      </div>
    </div>
  );
};

export default FrontPage;
