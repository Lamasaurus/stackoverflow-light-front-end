import React from "react";
import { act } from "react-dom/test-utils";
import { mount, shallow, ReactWrapper } from "enzyme";

import APIAccess from "../../lib/API";

import QuestionSummary from "./";
import EntitySummary from "../EntitySummary";

describe("<QuestionSummary />", () => {
  const params = {
    id: "0",
    voteTotal: 0,
    answerTotal: 1
  };

  it("should display a entity summary", () => {
    const wrapper = shallow(<QuestionSummary {...params} />);

    expect(wrapper.containsMatchingElement(<EntitySummary />)).toBe(true);
  });

  it("should get the users vote when logged in", () => {
    APIAccess.getUser = jest.fn(() => {
      return { userId: "1", userName: "User" };
    });
    APIAccess.isLoggedIn = jest.fn(() => true);

    fetch
      .mockResponseOnce(JSON.stringify({
        _id: "2",
        userId: "1",
        questionId: "0",
        value: 1
      }))
      .mockResponseOnce("1");

    act(() => {
      mount(<QuestionSummary {...params} />);
    });

    expect(fetch.mock.calls[0][0]).toEqual(
      `${APIAccess.baseAPIAddress}/vote/question?userId=1&questionId=0`
    );

    expect(fetch.mock.calls[1][0]).toEqual(
      `${APIAccess.baseAPIAddress}/vote/question/total?questionId=0`
    );

    APIAccess.getUser.mockRestore();
    APIAccess.isLoggedIn.mockRestore();
  });

  it("should post change of votes", () => {
    APIAccess.getUser = jest.fn(() => {
      return { userId: "1", userName: "User" };
    });

    fetch
      .mockResponseOnce("{}")
      .mockResponseOnce(JSON.stringify({
        _id: "2",
        userId: "1",
        questionId: "0",
        value: 1
      }))
      .mockResponseOnce("1");

    let wrapper;
    act(() => {
      wrapper = mount(<QuestionSummary {...params} />);
    });

    // Get the changeVote function and invoke it
    const changeVote = wrapper.find(EntitySummary).prop("changeVote");
    changeVote(1);

    const postCall = fetch.mock.calls[2];
    expect(postCall[0]).toEqual(
      `${APIAccess.baseAPIAddress}/vote/question/`
    );
    expect(JSON.parse(postCall[1].body)).toEqual({
      value: 1,
      questionId: "0",
    });
  });
});
