import React from "react";
import { Link } from "react-router-dom";
import QuestionSummary from "../QuestionSummary";

import { IQuestion } from "../QuestionPage";

const QuestionPreview = (props: IQuestion) => {
  return (
    <div className="box question-preview">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <div className="columns">
              <div className="column">
                <p>
                  <Link to={"/question/" + props._id}>
                    <strong>{props.title}</strong>
                  </Link>{" "}
                  <br />
                  {props.text.substring(0, 500)}
                </p>
              </div>

              <QuestionSummary 
                voteTotal={props.voteTotal}
                answerTotal={props.answerTotal}
                id={props._id}
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default QuestionPreview;
