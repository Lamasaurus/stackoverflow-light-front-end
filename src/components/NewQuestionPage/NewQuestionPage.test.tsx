import React from "react";
import { act } from "react-dom/test-utils";
import { shallow, mount } from "enzyme";

import APIAccess, { IUser } from "../../lib/API";

import NewQuestionPage from ".";
import { Redirect, MemoryRouter } from "react-router-dom";
import { IQuestion } from "../QuestionPage";

describe("<NewQuestionPage /> not logged in", () => {
  it("should redirect to the signin  page", () => {
    const wrapper = shallow(<NewQuestionPage />);

    expect(wrapper.find(Redirect).prop("to")).toEqual("/signin");
  });
});

describe("<NewQuestionPage /> logged in", () => {
  let isLoggedIn: () => boolean;
  let getUser: () => IUser;

  beforeEach(() => {
    isLoggedIn = APIAccess.isLoggedIn;
    APIAccess.isLoggedIn = () => true;

    getUser = APIAccess.getUser;
    APIAccess.getUser = (): IUser => {
      return { userId: "0", userName: "User Name" };
    };
  });

  afterEach(() => {
    APIAccess.isLoggedIn = isLoggedIn;
    APIAccess.getUser = getUser;
  });

  it("should not redirect if logged in", () => {
    const wrapper = shallow(<NewQuestionPage />);

    expect(wrapper.find(Redirect).length).toBe(0);
  });

  it("should post a question and redirect to the questions page", async () => {
    const question: IQuestion = {
      _id: "0",
      userId: "0",
      title: "Title",
      text: "Text",
      postTime: 0,
      voteTotal: 0,
      answerTotal: 0
    };

    fetch.mockResponseOnce(JSON.stringify(question));

    let wrapper;
    wrapper = shallow(<NewQuestionPage />);

    wrapper
      .find("#question-title-input")
      .simulate("change", { target: { value: "Title" } });

    wrapper
      .find("#question-text-input")
      .simulate("change", { target: { value: "Text" } });

    wrapper.find("#post-button").simulate("click");

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(
          expect(
            wrapper
              .update()
              .find(Redirect)
              .prop("to")
          ).toEqual("/question/0")
        );
      }, 0);
    });
  });
});
