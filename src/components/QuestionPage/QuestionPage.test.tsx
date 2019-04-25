import React from "react";
import { act } from "react-dom/test-utils";
import { mount, shallow, ReactWrapper } from "enzyme";

import APIAccess from "../../lib/API";

import QuestionPage from "./";
import { MemoryRouter } from "react-router";
import Answer from "../Answer";

describe("<QUestionPage /> with answers", () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    fetch
      .mockResponseOnce(
        JSON.stringify({
          _id: "questionId",
          userId: "userId1",
          title: "Question title",
          text: "Question text",
          postTime: 0,
          voteTotal: 1,
          answerTotal: 2
        })
      )
      .mockResponseOnce(
        JSON.stringify([
          {
            _id: "answerId",
            userId: "userId2",
            title: "Answer title",
            text: "Answer text",
            postTime: 3,
            voteTotal: 4
          }
        ])
      );

    act(() => {
      wrapper = mount(
        <MemoryRouter>
          <QuestionPage match={{ params: { questionId: "questionId" } }} />
        </MemoryRouter>
      );
    });
  });

  it("should fetch question data", () => {
    expect(wrapper.find(".question-title").text()).toEqual("Question title");
    expect(wrapper.find(".question-text").text()).toEqual("Question text");
    expect(wrapper.find(".question-details").text()).toEqual(
      "Posted by userId1 on 0."
    );
  });

  it("should fetch answer data", () => {
    expect(wrapper.find(".answer-title").text()).toEqual("Answers (1)");
    expect(wrapper.update().find(".answer").length).toBe(1);
  });

  it("should not have a submit answer section when not logged in", () => {
    expect(wrapper.find(".submit-answer-section").length).toBe(0);
  });
});

describe("<QuestionPage /> without answers", () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    APIAccess.isLoggedIn = jest.fn(() => true);
    APIAccess.getUser = jest.fn(() => {
      return { userName: "User", userId: "id" };
    });

    fetch
      .mockResponseOnce(
        JSON.stringify({
          _id: "questionId",
          userId: "userId1",
          title: "Question title",
          text: "Question text",
          postTime: 0,
          voteTotal: 1,
          answerTotal: 2
        })
      )
      .mockResponseOnce(JSON.stringify([]));

    act(() => {
      wrapper = shallow(
        <QuestionPage match={{ params: { questionId: "questionId" } }} />
      );
    });
  });

  afterEach(() => {
    APIAccess.isLoggedIn.mockRestore();
    APIAccess.getUser.mockRestore();
  });

  it("should be able to submit an answer when logged in", () => {
    fetch.mockResponseOnce(JSON.stringify({})).mockResponseOnce(
      JSON.stringify([
        {
          _id: "answerId",
          userId: "userId2",
          title: "Answer title",
          text: "Answer text",
          postTime: 3,
          voteTotal: 4
        }
      ])
    );

    expect(wrapper.find(".submit-answer-section").length).toBe(1);
    expect(wrapper.find(".answer-title").text()).toEqual("Answers (0)");
    expect(wrapper.find(Answer).length).toBe(0);

    act(() => {
      wrapper
        .find("#answer-input")
        .simulate("change", { target: { value: "Text" } });

      wrapper.find(".answer-submit-button").simulate("click");
    });

    return new Promise(res => {
      setTimeout(() => {
        expect(wrapper.find(".answer-title").text()).toEqual("Answers (1)");
        expect(wrapper.find(Answer).length).toBe(1);

        const postBody = fetch.mock.calls.slice(-2)[0][1].body;
        res(expect(postBody.indexOf("Text")).toBeGreaterThanOrEqual(0));
      }, 0);
    });
  });
});
