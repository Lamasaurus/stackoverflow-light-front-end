import React, { useEffect, useState } from "react";
import EntitySummary from "../EntitySummary";

import APIAccess from "../../lib/API";

const Answer = (props: IAnswer) => {
  const [votes, setVotes] = useState(props.voteTotal);
  const [userVote, setUserVote] = useState(0);

  useEffect(() => {
    if (APIAccess.isLoggedIn())
      refreshUserVote();
  }, []);

  const refreshUserVote = () => {
    // Get the vote of the user for this answer
    const { userId } = APIAccess.getUser();

    APIAccess.getData<IAnswerVote>("/vote/answer", {
      userId,
      answerId: props._id
    }).then(vote => {
      // If the user voted on the answer
      if (vote) setUserVote(vote.value);
    });

    // Get the total votes
    APIAccess.getData<number>("/vote/answer/total", { answerId: props._id })
      .then(total => setVotes(total));
  };

  const changeVote = (value: number) => {
    // Post the new vote
    APIAccess.postData("/vote/answer/", {
      value,
      answerId: props._id
    }).then(() => {
      refreshUserVote();
    });
  };

  return (
    <div className="box answer">
      <div className="columns">
        <div className="column">
          <p className="answer-text">{props.text}</p>
          <p>
            <small className="answer-details">
              Posted by {props.userId} on {props.postTime}.
            </small>
          </p>
        </div>

        <EntitySummary
          voteTotal={votes}
          userVote={userVote}
          changeVote={changeVote}
        />
      </div>
    </div>
  );
};

export interface IAnswer {
  _id: string;
  userId: string;
  text: string;
  postTime: number;
  voteTotal: number;
}

interface IAnswerVote {
  _id: string;
  userId: string;
  answerId: string;
  value: number;
}

export default Answer;