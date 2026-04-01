import React from "react";
import { renderToString } from "react-dom/server";

import "./_Stories.scss";

export const Component = ({
    label = 'Checkbox label',
    disabled = false,
    checked = false,
  }) => (
        <label class="e-checkbox">
        </label>
    );

export default {
    title: "component/Header",
    excludeStories: /Component/,
    tags: ['autodocs'],
    render: (arg) => renderToString(Component(arg)),
    argTypes: {
      label: { control: 'text' },
      checked: { control: 'boolean' },
      disabled: { control: 'boolean' }
    }
}


export const DefaultButton = {
  args: {
    label: "Default button",
  }
};
