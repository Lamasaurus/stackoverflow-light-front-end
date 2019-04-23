import React, { useState, useEffect } from "react";
import APIAccess from "../../lib/API";

import QuestionSummary from "../QuestionSummary";
import Answer, { IAnswer } from "../Answer";

import "./QuestionPage.scss";

const QuestionPage = (props: any) => {
  const [question, setQuestion] = useState<IQuestion>({
    _id: "",
    userId: "",
    title: "",
    text: "",
    postTime: 0,
    voteTotal: 0,
    answerTotal: 0,
  });
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [answerToSubmit, setAnswerToSubmit] = useState<string>("");

  // Effect that runs on mount to load the question and its answers
  useEffect(() => {
    const questionId = props.match.params.questionId;
    // Load Question
    APIAccess.getData<IQuestion>("/question/", {
      questionId
    }).then(question => setQuestion(question));

    getAnswers(questionId);
  }, []);

  // Effect to keep track of aswers changes
  useEffect(() => {
    setQuestion({ ...question, answerTotal: answers.length});
  }, [answers]);

  // Load questions
  const getAnswers = (questionId: String) => {
    APIAccess.getData<IAnswer[]>("/answer/", {
      questionId
    }).then(answers => {
      setAnswers(answers);
    });
  }

  let submitAnswer = () => {
    APIAccess.postData("/answer/", { questionId: question._id, text: answerToSubmit })
      .then(() => {
        setAnswerToSubmit("");
        getAnswers(question._id);
      });
  };

  // Create answer elements or a message that says there are no answers
  let answerElements; 
  if(answers.length)
    answerElements = answers.map(answer => <Answer { ...answer } key={ answer._id } />);
  else
    answerElements = <small>No answers submitted yet!</small>;

  let submitAnswerElement;
  if (APIAccess.isLoggedIn()) {
    const submitAnswerChanged = (event: React.FormEvent) => {
      const textarea = event.target as HTMLTextAreaElement;
      setAnswerToSubmit(textarea.value);
    }

    submitAnswerElement = (
      <div className="box">
        <h1 className="title is-6">Submit Answer</h1>
        <div className="field">
          <div className="control">
            <textarea 
              className="textarea"
              id="answerInput"
              placeholder="Your Answer."
              value={answerToSubmit}
              onChange={submitAnswerChanged}></textarea>
          </div>
        </div>
        <div className="field">
          <p className="control">
            <a className="button is-primary" onClick={submitAnswer}>Submit</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="box question">
      <div className="columns">
        <div className="column">
          <h1 className="title is-3">{question.title}</h1>
        </div>

        <QuestionSummary
          voteTotal={question.voteTotal}
          answerTotal={question.answerTotal}
          id={props.match.params.questionId}
        />

      </div>

      <p>{question.text}</p>

      <p>
        <small>
          Posted by {question.userId} on {question.postTime}.
        </small>
      </p>

      <h1 className="title is-5 answer-title">Answers ({ answers.length })</h1>
      {answerElements}

      {submitAnswerElement}
    </div>
  );
};

export interface IQuestion {
  _id: string;
  userId: string;
  title: string;
  text: string;
  postTime: number;
  voteTotal: number;
  answerTotal: number;
}

export default QuestionPage;
