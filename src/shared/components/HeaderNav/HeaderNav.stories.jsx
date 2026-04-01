import React from "react";
import { renderToString } from "react-dom/server";

import "./_Stories.scss";
import "./HeaderNav.js";

export const Component = ({
    label = 'Checkbox label',
    disabled = false,
    checked = false,
  }) => (
        <header-nav role="navigation" class="c-header-nav c-section" aria-label="Main menu">
          <ul role="menubar">
              <li role="none" class="menu__item">
                <a role="menuitem" href="/support" class="e-logo"></a>
              </li>
              <li role="none" class="menu__item menu__item--has-submenu">
                <details>
                  <summary >Products</summary>
                  <ul>
                    <li><a href="/products/main">Main Products</a></li>
                    <li><a href="/products/accessories">Accessories</a></li>
                    <li><a href="/products/accessories">Accessories</a></li>
                    <li><a href="/products/accessories">Accessories</a></li>
                    <li><a href="/products/accessories">Accessories</a></li>
                  </ul>
                </details>
              </li>
              <li role="none" class="menu__item">
                <a role="menuitem" href="/support">Support</a>
              </li>
              <li role="none" class="menu__item">
                <a role="menuitem" href="/stores">Stores</a>
              </li>
          </ul>
        </header-nav>
    );

export default {
    title: "component/HeaderHav",
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
