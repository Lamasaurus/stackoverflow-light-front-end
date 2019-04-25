import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import APIAccess from "../../lib/API";

import { IQuestion } from "../QuestionPage";

const NewQuestionPage = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionId, setQuestionId] = useState<string>();

  const updateQuestionTitle = (event: React.FormEvent) => {
    const titleElement = event.target as HTMLInputElement;
    setQuestionTitle(titleElement.value);
  };

  const updateQuestionDescription = (event: React.FormEvent) => {
    const descriptionElement = event.target as HTMLInputElement;
    setQuestionDescription(descriptionElement.value);
  };

  const postQuestion = () => {
    const { userId } = APIAccess.getUser();

    // Post question and set the question id
    APIAccess.postData("/question/", {
      userId,
      title: questionTitle,
      text: questionDescription,
    })
      .then<IQuestion>(response => response.json())
      .then(question => setQuestionId(question._id));
  }

  // If user is not logged in, redirect to signin page
  if (!APIAccess.isLoggedIn())
    return <Redirect to="/signin" />;

  // If a questionId is present, redirect to the question
  if (questionId)
    return <Redirect to={ `/question/${questionId}` } />;

  return (
    <div className="signinForm">
      <h1 className="title is-3">New Question</h1>

      <form className="form">
        <div className="field">
          <label className="label">Question title</label>
          <div className="control">
            <input
              className="input"
              id="question-title-input"
              type="text"
              value={questionTitle}
              onChange={updateQuestionTitle}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <textarea
              className="textarea"
              id="question-text-input"
              placeholder="Describe your question."
              value={questionDescription}
              onChange={updateQuestionDescription}
            />
          </div>
        </div>

        <div className="field is-grouped is-grouped-centered">
          <p className="button is-primary" id="post-button" onClick={postQuestion}>Submit</p>
        </div>
      </form>
    </div>
  );

};

export default NewQuestionPage;