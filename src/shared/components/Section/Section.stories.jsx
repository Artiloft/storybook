import React from "react";
import { renderToString } from "react-dom/server";
import * as Dimension from "../../elements/Dimension/Dimension.stories"
import "./_Stories.scss";

export const СComponent = ({
    padding = false
  }) =>{
    let p = (padding ? 'c-section--padding' : '');
    return (
        <section className={`c-section ${p}`}>
          <Dimension.Component />
        </section>
    )
  } 

export default {
    title: "component/Section",
    excludeStories: /Component/,
    tags: ['autodocs'],
    render: (arg) => renderToString(СComponent(arg)),
    argTypes: {
      padding: { control: 'boolean'}
    }
}

export const Default = {
  args: {
  }
};
export const WithPaddingForMobile = {
  args: {
    padding: true
  }
};
