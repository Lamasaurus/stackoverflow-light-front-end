import React from "react";
import { act } from "react-dom/test-utils";
import { mount, shallow, ReactWrapper } from "enzyme";

import APIAccess from "../../lib/API";

import Answer from "./";
import EntitySummary from "../EntitySummary";

describe("<QuestionSummary />", () => {
  const params = {
    _id: "answerId",
    userId: "userId",
    text: "text",
    postTime: 1,
    voteTotal: 0
  };

  it("should display answer details", () => {
    const wrapper = shallow(<Answer {...params} />);

    expect(wrapper.find(".answer-text").text()).toEqual("text");
    expect(wrapper.find(".answer-details").text()).toEqual(
      "Posted by userId on 1."
    );
  });

  it("should display an entity summary", () => {
    const wrapper = shallow(<Answer {...params} />);

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
        answerId: "0",
        value: 1
      }))
      .mockResponseOnce("1");

    act(() => {
      mount(<Answer {...params} />);
    });

    expect(fetch.mock.calls[0][0]).toEqual(
      `${APIAccess.baseAPIAddress}/vote/answer?userId=1&answerId=answerId`
    );

    expect(fetch.mock.calls[1][0]).toEqual(
      `${APIAccess.baseAPIAddress}/vote/answer/total?answerId=answerId`
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
        answerId: "0",
        value: 1
      }))
      .mockResponseOnce("1");

    let wrapper;
    act(() => {
      wrapper = mount(<Answer {...params} />);
    });

    // Get the changeVote function and invoke it
    const changeVote = wrapper.find(EntitySummary).prop("changeVote");
    changeVote(1);

    const postCall = fetch.mock.calls[2];
    expect(postCall[0]).toEqual(`${APIAccess.baseAPIAddress}/vote/answer/`);
    expect(JSON.parse(postCall[1].body)).toEqual({
      value: 1,
      answerId: "answerId"
    });
  });
});
