class HeaderNav extends HTMLElement {
  connectedCallback() {
    
  }
  disconnectedCallback() {

  }
}
!customElements.get("header-nav") && customElements.define("header-nav", HeaderNav);