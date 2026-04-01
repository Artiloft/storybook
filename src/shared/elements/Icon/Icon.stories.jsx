import React from "react";
import { renderToString } from "react-dom/server";
import { uGetCssVariables } from "../../utils/CssVariables.jsx";
import "./_Stories.scss";


/* Get all variables --theme--* from css */
export const iconsName = uGetCssVariables('--e-icon--local-')
    .reduce((r, [key, value]) => {
        r.push(key);
        return r;
    },[]);

export const iconsBootstrapName = uGetCssVariables('--e-icon--bootstrap-')
    .reduce((r, [key, value]) => {
        r.push(key);
        return r;
    },[]);


export const Component = ({
    name = 'image-b',
  }) => (
      <i className={`e-icon e-icon--${name}`}></i>
  );

export default {
    title: "elements/Icon",
    excludeStories: /Component|iconsBootstrapName|iconsName/,
    tags: ['autodocs'],
    render: (arg) => renderToString(Component(arg)),
    argTypes: {
      name: {
        control: { type: 'select' },
        options: iconsName,
      }
    }
}

export const Example = {
  args: {
    name: "image-b",
  }
};



export const AvailableVariants = () => {
  return renderToString(
    <div class="grid">
      {iconsName.map((name) =>
          <div>
            <span className="icon">
                <i className={`e-icon e-icon--${name}`} label={name} title={name}></i>
            </span>
            <span className="name">{name}</span>
          </div>
      )}
    </div>
  );
};

export const UnavailableBootstrapVariants = () => {
  return renderToString(
    <div className="grid-bootstrap">
      {iconsBootstrapName.map((name) =>
          <div>
            <i className={`e-icon e-icon--bootstrap-${name}`} label={name} title={name}></i>
          </div>
      )}
    </div>
  );
};