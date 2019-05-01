import React from "react";
import { act } from "react-dom/test-utils";
import { shallow, mount, ReactWrapper } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import FrontPage from "./";
import APIAccess from "../../lib/API";
import { IQuestion } from "../QuestionPage";

describe("<FrontPgae />", () => {
  it("should not show a button for asking new questions when not logged in.", () => {
    const wrapper = shallow(<FrontPage />);

    expect(wrapper.find("#ask-question-button").length).toBe(0);
  });

  it("should show a button for asking new questions when logged in.", () => {
    const isLoggedIn = APIAccess.isLoggedIn;

    APIAccess.isLoggedIn = () => true;
    const wrapper = shallow(<FrontPage />);

    expect(wrapper.find("#ask-question-button").length).toBe(1);

    APIAccess.isLoggedIn = isLoggedIn;
  });

  it("should display a list of question previews.", async () => {
    const questions: IQuestion[] = [
      {
        _id: "0",
        userId: "0",
        title: "Title",
        text: "Text",
        postTime: 0,
        voteTotal: 0,
        answerTotal: 0,
      },
    ];

    fetch.mockResponseOnce(JSON.stringify(questions));

    let wrapper: ReactWrapper;

    // This will give a warning
    // But it is a known issue that they are actively working on
    // https://github.com/facebook/react/issues/14769
    act(() => {
      wrapper = mount(
        <MemoryRouter>
          <FrontPage />
        </MemoryRouter>,
      );
    });

    return new Promise(res => {
      setTimeout(() => {
        res(expect(wrapper.update().find(".question-preview").length).toBe(1));
      });
    });
  });

  it("should be able to enter a filter", () => {
    const questions: IQuestion[] = [
      {
        _id: "0",
        userId: "0",
        title: "Title",
        text: "Text",
        postTime: 0,
        voteTotal: 0,
        answerTotal: 0,
      },
    ];

    const filteredQuestions: IQuestion[] = [
      {
        _id: "0",
        userId: "0",
        title: "Title",
        text: "Text",
        postTime: 0,
        voteTotal: 0,
        answerTotal: 0,
      },
      {
        _id: "0",
        userId: "0",
        title: "Title",
        text: "Text",
        postTime: 0,
        voteTotal: 0,
        answerTotal: 0,
      },
    ];


    fetch.mockResponseOnce(JSON.stringify(questions));
    fetch.mockResponseOnce(JSON.stringify(filteredQuestions));

    let wrapper: ReactWrapper;

    // This will give a warning
    // But it is a known issue that they are actively working on
    // https://github.com/facebook/react/issues/14769
    act(() => {
      wrapper = mount(
        <MemoryRouter>
          <FrontPage />
        </MemoryRouter>,
      );
    });

    act(() => {
      const searchField = wrapper.find("#question-search-field");
      searchField.simulate("change", { target: { value: "text" } });
    });

    return new Promise(res => {
      setTimeout(() => {
        res(expect(wrapper.update().find(".question-preview").length).toBe(2));
      });
    });
  });
});
