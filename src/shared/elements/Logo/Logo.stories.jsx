import React from "react";
import { renderToString } from "react-dom/server";
import { uGetCssVariables } from "../../utils/CssVariables.jsx";
import "./_Stories.scss";

export const Component = () => (<i className={`e-logo`}></i>);

export default {
    title: "elements/Logo",
    excludeStories: /Component/,
    tags: ['autodocs'],
    render: (arg) => renderToString(Component(arg)),
}

export const Example = {
  args: {
  }
};
