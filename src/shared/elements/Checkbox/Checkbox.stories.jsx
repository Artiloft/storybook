import React from "react";
import { renderToString } from "react-dom/server";

import "./_Stories.scss";

export const Component = ({
    label = 'Checkbox label',
    disabled = false,
    checked = false,
  }) => (
        <label class="e-checkbox">
            <input type="checkbox" checked={checked} disabled={disabled}/>
            <i></i>
            <span>{label}</span>
        </label>
    );

export default {
    title: "elements/Checkbox",
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



export const AllVariants = () => {
  return renderToString(
    <>
      {[false, true].map((checked, i) => [false, true].map((disabled, ii) =>
          <>
            <Component
              key={`${i}-${ii}-${checked}-${disabled}`}
              checked={checked}
              disabled={disabled}
              label={`Label ${checked ? 'Checked' : ''} ${disabled ? 'disabled' : ''}`}
            />
            &nbsp;
          </>
      )) }
    </>
  );
};