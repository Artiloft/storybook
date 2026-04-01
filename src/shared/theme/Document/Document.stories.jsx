import React from "react";
import { renderToString } from "react-dom/server";
import { uGetCssVariables } from "../../utils/CssVariables";
import { Source } from '@storybook/addon-docs/blocks';

import "./_Stories.scss";
import rawDocumentScss from "./_Document.scss?raw";
import rawVariablesScss from "./_Variables.scss?raw";

export const documentVariables = uGetCssVariables('--t-document--')
    .map(v => {v[0]='$t-document--'+v[0]; return v;});

export default {
    title: "Theme/Document",
    excludeStories: /themeDocument|documentVariables|Component/,
};

export const _Document = {
    render: () => renderToString(
        <>
            _Document.scss
            <hr/>
            <pre>
                <code>{rawDocumentScss}</code>
            </pre>
        </>
    )
};
export const _Variables = {
    render: () => renderToString(
        <>
            _Variables.scss
            <hr/>
            <pre>
                <code>{rawVariablesScss}</code>
            </pre>
        </>
    )
};
