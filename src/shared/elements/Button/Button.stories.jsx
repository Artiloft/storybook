import React from "react";
import { renderToString } from "react-dom/server";

import "./_Stories.scss";

import {iconsName} from '../Icon/Icon.stories';

export const Component = ({
    label = 'Simple button',
    type = '',
    disabled = false,
    icon = '',
    icon_end = ''
  }) => {
    if (icon) {
      return (
        <button className={`e-button ${type}`} disabled={disabled}>
          <i class={`e-icon e-icon--${icon}`}></i>
          {label}
          <i class={`e-icon e-icon--${icon_end}`}></i>
        </button>
      )  
    }
    return (
      <button className={`e-button ${icon_end}`} disabled={disabled}>{label}</button>
    )
};



export default {
    title: "elements/Button",
    excludeStories: /Component/,
    tags: ['autodocs'],
    render: (arg) => renderToString(Component(arg)),
    argTypes: {
      label: { control: 'text' },
      type: {
        control: { type: 'select' },
        options: ['', 'primary', 'secondary'],
      },
      icon: {
        control: { type: 'select' },
        options: iconsName,
      },
      icon_end: {
        control: { type: 'select' },
        options: ['', 'chevron-b'],
      },
      disabled: { control: 'boolean' }
    }
}



export const DefaultButton = {
  args: {
    label: "Default button",
  }
};
export const DefaultIconButton = {
  args: {
    label: "Default button",
    icon: "image-b"
  }
};
export const DefaultDisabledButton = {
  args: {
    label: "Disabled button",
    disabled: true
  }
};
export const DefaultDisabledIconButton = {
  args: {
    label: "Disabled button",
    disabled: true,
    icon: "image-b"
  }
};
export const PrimaryButton = {
  args: {
    label: "Primary button",
    type: "primary"
  }
};
export const IconPrimaryButton = {
  args: {
    label: "Primary button",
    type: "Icon primary",
    icon: "check-box-checked-w"
  }
};
export const SecondaryButton = {
  args: {
    label: "Secondary button",
    type: "secondary"
  }
};
export const SecondarDisabledButton = {
  args: {
    label: "Secondary button",
    type: "secondary",
    disabled: true
  }
};

export const AllVariants = () => {
  const variants = ["", "primary", "secondary"];
  const disabledStates = [false, true];

  return renderToString(
    <>
      {['', 'image-w', 'image-b'].map((icon) => variants.map((type) =>
        disabledStates.map((disabled, i) => (
          <>
            <Component
              key={`${type}-${i}-${disabled}-${icon}`}
              type={type}
              disabled={disabled}
              label={`${type} ${disabled}`}
              icon={icon}
            />
            &nbsp;
          </>
        ))
      )) }
    </>
  );
};