import React, { useEffect, useState } from "react";
import APIAccess from "../../lib/API";

import EntitySummary from "../EntitySummary";

const QuestionSummary = (props: IQuestionSummaryProps) => {
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(0);

  const refreshUserVote = () => {
    // Get the vote of the user for this question
    const { userId } = APIAccess.getUser();

    APIAccess.getData<IQuestionVote>("/vote/question", {
      userId,
      questionId: props.id
    }).then(vote => {
      // If the user voted on the question
      if (vote) setUserVote(vote.value);
    });

    // Get the total votes
    APIAccess.getData<number>("/vote/question/total", { questionId: props.id })
      .then(total => setVotes(total));
  };

  useEffect(() => {
    setVotes(props.voteTotal)
    if (APIAccess.isLoggedIn())
      refreshUserVote();
  }, []);

  const changeVote = (value: number) => {
    // Post the new vote
    const user = APIAccess.getUser();

    APIAccess.postData("/vote/question/", {
      userId: user,
      value,
      questionId: props.id
    }).then(() => {
      refreshUserVote();
    });
  };

  return <EntitySummary
            voteTotal={votes}
            answerTotal={props.answerTotal}
            userVote={userVote}
            changeVote={changeVote}
          />
};

interface IQuestionSummaryProps {
  id: string;
  answerTotal: number;
  voteTotal: number;
}

interface IQuestionVote {
  _id: string;
  userId: string;
  questionId: string;
  value: number;
}

export default QuestionSummary;