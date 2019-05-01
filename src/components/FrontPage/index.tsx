import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import APIAccess from "../../lib/API";

import "./FrontPage.scss";

import { IQuestion } from "../QuestionPage";
import QuestionPreview from "../QuestionPreview";

const FrontPage = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [filter, setFilter] = useState<string>();

  // Fetch data when the component gets mounted and when
  // the filter state changes.
  useEffect(() => {
    getQuestions();
  }, [filter]);

  const getQuestions = () => {
    if (!filter || filter === "") {
      // If no filter was set, just get the top questions
      APIAccess.getData<IQuestion[]>("/question/top").then(newQuestions =>
        setQuestions(newQuestions),
      );
    } else {
      // If a filter was set, get the questions that contain it
      APIAccess.getData<IQuestion[]>("/search/question/", {
        text: filter,
      }).then(newQuestions => setQuestions(newQuestions));
    }
  };

  const updateFilter = (event: React.FormEvent) => {
    const searchBarElement = event.target as HTMLInputElement;
    setFilter(searchBarElement.value);
  };

  return (
    <div className="frontPage">

      <div className="columns">
        <div className="column">
          <h1 className="title is-3">Popular Questions</h1>
        </div>

        {// Show a button to ask a new question when logged in
        APIAccess.isLoggedIn() && (
          <div className="column is-2">
            <p className="control">
              <Link
                className="button is-primary"
                to="/newquestion"
                id="ask-question-button"
              >
                Ask Question
              </Link>
            </p>
          </div>
        )}
      </div>

      <div className="field">
        <div className="control">
          <input
            className="input"
            id="question-search-field"
            type="text"
            value={filter}
            onChange={updateFilter}
            placeholder="Search Questions"
          />
        </div>
      </div>

      <div className="question-list">
        {questions.map(question => {
          return <QuestionPreview {...question} key={question._id} />;
        })}
      </div>
    </div>
  );
};

export default FrontPage;
