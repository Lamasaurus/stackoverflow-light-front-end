import React from "react";

import "./EntitySummary.scss";

import APIAccess from "../../lib/API";

// A component that shows the total answers and votes and controlls voting
const EntitySummary = (props: IEntitySummaryProps) => {
  const hasAnswerTotal = typeof props.answerTotal !== "undefined" ? props.answerTotal >= 0 : false;

  return (
    <div className={ `entity-summary column is-${ APIAccess.isLoggedIn() && hasAnswerTotal ? "3" : "2" }` }>
      <div className="level">
        {
          hasAnswerTotal &&
          <div className="level-item has-text-centered answer-display">
            <div>
              <p className="heading">Answers</p>
              <p className="title is-4 answer-total">{props.answerTotal}</p>
            </div>
          </div>
        }

        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Votes</p>
            <p className="title is-4 vote-total">{props.voteTotal}</p>
          </div>
        </div>

        {
          APIAccess.isLoggedIn() &&
          <div className="level-item voting-section">
            <div>
              <i
                className={
                  `up-vote fas fa-chevron-up ${props.userVote == 1 ? "is-active" : ""}`
                }
                onClick={() => props.changeVote(1)}
              />
              <br />
              <i
                className={
                  `down-vote fas fa-chevron-down ${props.userVote == -1 ? "is-active" : ""}`
                }
                onClick={() => props.changeVote(-1)}
              />
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export interface IEntitySummaryProps {
  voteTotal: number;
  answerTotal?: number;
  userVote?: number;
  changeVote: (value: number) => void;
}

export default EntitySummary;