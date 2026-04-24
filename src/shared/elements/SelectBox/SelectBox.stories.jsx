import React from "react";
import { renderToString } from "react-dom/server";

import "./_Stories.scss";
import "./SelectBox.js";

const defaultOptions = [
  { value: "apple",      label: "Apple" },
  { value: "banana",     label: "Banana" },
  { value: "cherry",     label: "Cherry" },
  { value: "date",       label: "Date",       disabled: true },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig",        label: "Fig" },
  { value: "grape",      label: "Grape" },
];

export const Component = ({ value = '' }) => (
  <select-box class="open">
    {defaultOptions.map(opt => (
      <option
        key={opt.value}
        value={opt.value}
        selected={opt.value === value || undefined}
        disabled={opt.disabled || undefined}
      >
        {opt.label}
      </option>
    ))}
  </select-box>
);

export default {
  title: "elements/SelectBox",
  excludeStories: /Component/,
  tags: ['autodocs'],
  render: (args) => renderToString(Component(args)),
  argTypes: {
    value: {
      control: { type: 'select' },
      options: ['', ...defaultOptions.map(o => o.value)],
    },
  },
};

export const Default = {
  args: {},
};

export const WithSelected = {
  args: { value: 'banana' },
};

export const AllVariants = () => renderToString(
  <>
    <Component />
    &nbsp;
    <Component value="grape" />
  </>
);
