import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import QuestionPreview from ".";
import QuestionSummary from "../QuestionSummary";

describe("<QuestionPreview />", () => {
  const routed_wrapper = mount(
    <MemoryRouter>
      <QuestionPreview
        title="Title"
        text="Text"
        voteTotal={0}
        answerTotal={0}
        _id="0"
        userId="0"
        postTime={0}
      />
    </MemoryRouter>
  );

  const wrapper = shallow(
    <QuestionPreview
      title="Title"
      text="Text"
      voteTotal={0}
      answerTotal={0}
      _id="0"
      userId="0"
      postTime={0}
    />
  );

  it("should contain title", () => {
    const title = routed_wrapper.find(".question-preview-title");

    expect(title.length).toBe(1);
    expect(title.text()).toEqual("Title");
    expect(title.find("a").prop("href")).toEqual("/question/0");
  });

  it("should contain the description", () => {
    const description = wrapper.find(".question-preview-text");

    expect(description.length).toBe(1);
    expect(description.text()).toEqual("Text");
  });

  it("should contain a question summary with the right params", () => {
    expect(
      wrapper.containsMatchingElement(
        <QuestionSummary voteTotal={0} answerTotal={0} id="0" />
      )
    ).toBe(true);
  });
});
