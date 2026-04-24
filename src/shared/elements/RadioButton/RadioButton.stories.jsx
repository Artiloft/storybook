import React from "react";
import { renderToString } from "react-dom/server";

import "./_Stories.scss";

export const Component = ({
    label = 'RadioButton label',
    disabled = false,
    checked = false,
    name = '',
  }) => (
        <label class="e-radio-button">
            <input type="radio" checked={checked} disabled={disabled} name={name}/>
            <i></i>
            <span>{label}</span>
        </label>
    );

export default {
    title: "elements/RadioButton",
    excludeStories: /Component/,
    tags: ['autodocs'],
    render: (arg) => renderToString(Component(arg)),
    argTypes: {
        label: { control: 'text' },
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' }
    }
}


export const Default = {
    args: {
        label: "RadioButton label",
    }
};

export const AllVariants = () => {
    return renderToString(
        <>
            {[false, true].map((checked, i) => [false, true].map((disabled, ii) =>
                <>
                    <Component
                        name="c"
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