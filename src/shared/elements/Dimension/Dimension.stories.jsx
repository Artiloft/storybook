import React from "react";
import { renderToString } from "react-dom/server";
import { uStorybookReady } from "../../utils/StorybookReady";

import "./_Stories.scss";

uStorybookReady(() => {
  class ElementDimension extends HTMLElement{
    static elements = new Set();

    connectedCallback() {
      ElementDimension.elements.add(this);
      this.innerHTML = `9999 x 9999`;
      this.resize();
      this.resize();
    }
    disconnectedCallback() {
      ElementDimension.elements.delete(this);
    }
    resize() {
      const rect = this.getBoundingClientRect();
      this.innerHTML = `${Math.round(rect.width)} x ${Math.round(rect.height)}`;
    }

  }
  window.addEventListener('resize', e => {
    ElementDimension.elements.forEach(e => e.resize());
  });

  if (!customElements.get("element-dimension")) {
    customElements.define("element-dimension", ElementDimension);
  }
});

export const Component = ({className = ''}) => 
  (<element-dimension className={`e-dimension ${className}`}></element-dimension>);

export default {
    title: "elements/Dimension",
    excludeStories: /Component/,
    tags: ['autodocs'],
    render: (arg) => renderToString(Component(arg)),
    argTypes: {
      className: { control: 'text'}
    }
}

export const Default = {
  args: {
  }
};

