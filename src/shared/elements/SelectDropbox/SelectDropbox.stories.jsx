import React from "react";
import { renderToString } from "react-dom/server";

import "./_Stories.scss";
import "./SelectDropbox.js";

const defaultOptions = [
    { value: "apple",      label: "Apple" },
    { value: "banana",     label: "Banana" },
    { value: "cherry",     label: "Cherry" },
    { value: "date",       label: "Date",       disabled: true },
    { value: "elderberry", label: "Elderberry" },
    { value: "fig",        label: "Fig" },
    { value: "grape",      label: "Grape" },
    { value: "honeydew",   label: "Honeydew" },
    { value: "kiwi",       label: "Kiwi" },
    { value: "lemon",      label: "Lemon" },
    { value: "mango",      label: "Mango" },
    { value: "nectarine",  label: "Nectarine" },
    { value: "orange",     label: "Orange" },
    { value: "peach",      label: "Peach" },
    { value: "quince",     label: "Quince",     disabled: true },
    ];

export const Component = ({
    placeholder = 'Select option',
    value = '',
    disabled = false,
}) => (
    <select-dropbox
        placeholder={placeholder}
        disabled={disabled || undefined}
    >
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
    </select-dropbox>
);

export default {
    title: "elements/SelectDropbox",
    excludeStories: /Component/,
    tags: ['autodocs'],
    render: (args) => renderToString(Component(args)),
    argTypes: {
        placeholder: { control: 'text' },
        value: {
            control: { type: 'select' },
            options: ['', ...defaultOptions.map(o => o.value)],
        },
        disabled: { control: 'boolean' },
    },
};

export const Default = {
    args: {
        placeholder: 'Select option',
    },
};

export const WithSelected = {
    args: {
        placeholder: 'Select option',
        value: 'grape',
    },
};

export const Disabled = {
    args: {
        placeholder: 'Select option',
        disabled: true,
    },
};

export const DisabledWithSelected = {
    args: {
        placeholder: 'Select option',
        value: 'mango',
        disabled: true,
    },
};

export const AllVariants = () => renderToString(
    <>
        <Component placeholder="No selection" />
        &nbsp;
        <Component placeholder="With selection" value="kiwi" />
        &nbsp;
        <Component placeholder="Disabled" disabled={true} />
        &nbsp;
        <Component placeholder="Disabled + selected" value="fig" disabled={true} />
    </>
);
