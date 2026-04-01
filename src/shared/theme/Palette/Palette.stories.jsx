import React from "react";
import { renderToString } from "react-dom/server";
import { uGetCssVariables } from "../../utils/CssVariables.jsx";

import "./_Stories.scss";

/* Get all variables --theme--* from css */
export const themeColor = uGetCssVariables('--t-palette--')
    .reduce((r, [key, value]) => {
        const nameChunks = key.split('-').reverse();
        if (nameChunks[1] !== 'palette' && nameChunks[1] !== 'colors') return r;
        r[nameChunks[1]] ||= [];
        r[nameChunks[1]].push([nameChunks[0], value])
        return r;
    },{});

/* Create element */
const Component = ({ list = [] }) => 
    renderToString(<ColorCards list={list}/>);

export const ColorCards = ({ list = [] }) => (
    <div className="t-palette">
        {list.map(([name, code], i) => (
            <ColorCard key={i} name={name} code={code} />
        ))}
    </div>
);
const ColorCard = ({ name = "undefined", code = "" }) => (
    <div className="t-palette--color">
        <div className={`t-palette--color-background t-palette--background-${name}`} />
        <b className="t-palette--color-name">${name}</b>
        <span className="t-palette--color-code">{code}</span>
    </div>
);

export const ColorCardsDetails = ({ list = [] }) => (
    <>
    {console.log(list)}
    {console.log(themeColor)}
    <div className="t-palette">
        {list.map(([name, code], i) => (
            <ColorDetails key={i} name={name} code={code} list={list}/>
        ))}
    </div>
    </>
);
const ColorDetails = ({ name = "undefined", code = "", list=[] }) => (
    <div class="t-palette--color-details">
        <ColorCard name={name} code={code} />
        <ColorDetail name={name} code={code} list={list}/>
    </div>
);
const ColorDetail = ({ name="", code = "", list = [] }) => (
    <div>
        <div className="t-palette--color-details-list">
            {list
            .filter(([name, _code]) => code !== _code)
            .map(([name, c], i) => {
                const contrast = contrastRatio(code, c);
                let contrast_class='contrast-error';
                if (contrast >= 4.5) {
                    contrast_class='contrast-perfect';
                } else if (contrast >= 3) {
                    contrast_class='contrast-good';
                }
                return (
                <div className={`t-palette--color-details-list-card ${contrast_class}`} key={i}>
                    <div className={`t-palette--color-details-list-card-rect t-palette--background-${name}`}></div>
                    <div className="t-palette--color-details-list-card-contrast">{contrast}</div>
                    <div className="t-palette--color-details-list-card-name">${name}</div>
                </div>
                )
            })}
        </div>
    </div>
);
function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  const num = parseInt(hex, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ];
}
function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(...rgb1);
  const lum2 = luminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const value = ((brightest + 0.05) / (darkest + 0.05));
  return Math.round(value * 100) / 100;
}



/* STORIES */
const cfg = {
    title: "Theme/Palette",
    _tags: ['autodocs'],
    excludeStories: /themeColor|ColorCards|ColorCardsDetails/,
    render: Component,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Component />
                    {/* <Primary /> */}
                    {/* <Controls /> */}
                    <Stories />
                </>
            ),
            _description: {
                component: `
                    All colors of theme available from \`src/shared/Theme/Palette/_Palette.scss\`
                `.trim()
            },
            inlineStories: true,
        },
        controls: { hideNoControlsWarning: true },
    }
};
export default cfg;


export const Palette = {
    args: {
        list: themeColor.palette,
    },
    argTypes: {
        list: { table: { disable: true } }
    }
};
export const Accents = {
    args: {
        list: themeColor.colors,
    },
    argTypes: {
        list: { table: { disable: true } }
    }
};