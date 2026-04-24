/**
 * Standalone dropdown list component.
 * Used internally by <select-dropbox>, but can also be used on its own
 * by placing <option> children directly inside the element.
 *
 * Standalone HTML usage:
 *   <select-box class="open">
 *     <option value="apple">Apple</option>
 *     <option value="banana" selected>Banana</option>
 *     <option value="cherry" disabled>Cherry</option>
 *   </select-box>
 *
 * Programmatic usage (e.g. from SelectDropbox):
 *   const box = document.createElement('select-box');
 *   box.setOptions([{ value: 'a', label: 'A', disabled: false, selected: false }]);
 *   box.open(triggerEl);
 *   box.addEventListener('select', e => console.log(e.detail)); // { value, label }
 *
 * Attributes:
 *   multiple — enables multi-select: clicks toggle items, dropdown stays open.
 *
 * Dispatches 'select' CustomEvent (bubbles) on item selection:
 *   Single:   { detail: { value: string, label: string } }
 *   Multiple: { detail: { values: [{ value, label }] } }
 */
class SelectBox extends HTMLElement {
  /** @type {{ value: string, label: string, disabled: boolean, selected: boolean }[]} */
  #options = [];
  /** Index into #options pointing to the keyboard-focused item */
  #focusIndex = -1;
  #initialized = false;

  /** Lifecycle: add base class, role, click listener and auto-init from children if needed. */
  connectedCallback() {
    this.classList.add('e-select-box');
    this.setAttribute('role', 'listbox');
    if (this.hasAttribute('multiple')) {
      this.setAttribute('aria-multiselectable', 'true');
    }
    if (!this.#initialized) {
      this.addEventListener('click', e => this.#onItemClick(e));
      this.#initialized = true;
    }
    // Auto-initialize from <option> children when not set programmatically
    if (!this.#options.length && this.querySelectorAll('option').length) {
      this.#parseChildren();
      this.#render();
    }
  }

  /**
   * Replace the option list and re-render items.
   * Safe to call before the element is connected to the DOM.
   * @param {{ value: string, label: string, disabled: boolean, selected: boolean }[]} options
   */
  setOptions(options) {
    this.#options = options;
    this.#render();
  }

  /**
   * Sync the visual selected state after an external value change.
   * Accepts a single value (string) for single mode, or an array of values for multiple mode.
   * @param {string|string[]|null} value
   */
  setSelected(value) {
    const set = Array.isArray(value) ? new Set(value) : null;
    this.#options.forEach(o => (o.selected = set ? set.has(o.value) : o.value === value));
    this.querySelectorAll('.e-select-box__item').forEach(item => {
      const sel = set ? set.has(item.dataset.value) : item.dataset.value === value;
      item.classList.toggle('selected', sel);
      item.setAttribute('aria-selected', sel ? 'true' : 'false');
    });
  }

  /**
   * Show and position the dropdown relative to the trigger element.
   * Focus is placed on the currently selected item, or the first enabled one.
   * @param {HTMLElement} triggerEl
   */
  open(triggerEl) {
    this.classList.add('open');
    this.#position(triggerEl);

    const selectedIdx = this.#options.findIndex(o => o.selected && !o.disabled);
    this.#focusIndex = selectedIdx >= 0 ? selectedIdx : this.#firstEnabledIndex();
    this.#updateFocus();
  }

  /** Hide the dropdown and clear all inline positioning styles. */
  close() {
    this.classList.remove('open');
    this.style.cssText = '';
    this.querySelectorAll('.e-select-box__item.focused')
      .forEach(el => el.classList.remove('focused'));
  }

  /**
   * Move keyboard focus, skipping disabled items.
   * @param {1|-1} direction
   */
  moveFocus(direction) {
    const valid = this.#options
      .map((opt, i) => ({ opt, i }))
      .filter(({ opt }) => !opt.disabled);

    if (!valid.length) return;

    const currentPos = valid.findIndex(({ i }) => i === this.#focusIndex);
    let nextPos;
    if (direction > 0) {
      nextPos = currentPos < valid.length - 1 ? currentPos + 1 : currentPos;
    } else {
      nextPos = currentPos > 0 ? currentPos - 1 : 0;
    }

    this.#focusIndex = valid[nextPos].i;
    this.#updateFocus();
  }

  /** Confirm the currently focused item: toggle in multiple mode, select in single mode. */
  confirmFocus() {
    const focused = this.querySelector('.e-select-box__item.focused');
    if (!focused || focused.classList.contains('disabled')) return;
    if (this.hasAttribute('multiple')) {
      this.#toggleItem(focused);
    } else {
      this.#emitSelect(focused.dataset.value, focused.textContent.trim());
    }
  }

  /** Read <option> children into #options (used for standalone HTML usage). */
  #parseChildren() {
    this.querySelectorAll('option').forEach(el => {
      this.#options.push({
        value: el.value,
        label: el.textContent.trim(),
        disabled: el.disabled || el.hasAttribute('disabled'),
        selected: el.hasAttribute('selected') || el.selected,
      });
    });
  }

  /** Build the __inner + <ul>/<li> structure from #options. */
  #render() {
    this.innerHTML = '';

    const inner = document.createElement('div');
    inner.className = 'e-select-box__inner';

    const list = document.createElement('ul');
    list.className = 'e-select-box__list';

    this.#options.forEach((opt, i) => {
      const li = document.createElement('li');
      li.className = 'e-select-box__item';
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      li.dataset.index = i;
      li.textContent = opt.label;

      if (opt.disabled) li.classList.add('disabled');
      if (opt.selected) {
        li.classList.add('selected');
        li.setAttribute('aria-selected', 'true');
      } else {
        li.setAttribute('aria-selected', 'false');
      }

      list.appendChild(li);
    });

    inner.appendChild(list);
    this.appendChild(inner);
  }

  /** Handle item click via event delegation. */
  #onItemClick(e) {
    const item = e.target.closest('.e-select-box__item');
    if (!item || item.classList.contains('disabled')) return;
    if (this.hasAttribute('multiple')) {
      this.#toggleItem(item);
    } else {
      this.#emitSelect(item.dataset.value, item.textContent.trim());
    }
  }

  /**
   * Toggle selection state of an item (multiple mode).
   * Updates #options, DOM classes and dispatches 'select' with the full selected values array.
   * @param {HTMLElement} item
   */
  #toggleItem(item) {
    const opt = this.#options.find(o => o.value === item.dataset.value);
    if (!opt) return;
    opt.selected = !opt.selected;
    item.classList.toggle('selected', opt.selected);
    item.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      detail: {
        values: this.#options.filter(o => o.selected).map(o => ({ value: o.value, label: o.label })),
      },
    }));
  }

  /** Dispatch a 'select' CustomEvent with the chosen value and label (single mode). */
  #emitSelect(value, label) {
    this.dispatchEvent(new CustomEvent('select', {
      bubbles: true,
      detail: { value, label },
    }));
    this.setSelected(value);
  }

  /**
   * Calculate and apply inline position styles each time the dropdown opens:
   *  1. Enough space below → open below (CSS default, no override).
   *  2. Not enough below, enough above → flip above the trigger.
   *  3. No room on either side → position: fixed, anchored to top of viewport.
   * @param {HTMLElement} triggerEl
   */
  #position(triggerEl) {
    const GAP = 2;
    const rect = triggerEl.getBoundingClientRect();
    const dropHeight = this.scrollHeight;
    const spaceBelow = window.innerHeight - rect.bottom - GAP;
    const spaceAbove = rect.top - GAP;

    if (dropHeight <= spaceBelow) return; // CSS default handles it

    if (dropHeight <= spaceAbove) {
      this.style.top = 'auto';
      this.style.bottom = `calc(100% + ${GAP}px)`;
      return;
    }

    // No room on either side — anchor to top of viewport
    this.style.position = 'fixed';
    this.style.top = '0';
    this.style.bottom = 'auto';
    this.style.left = `${rect.left}px`;
    this.style.minWidth = `${rect.width}px`;
    this.style.maxHeight = '100dvh';
  }

  /** Apply .focused class to the current item and scroll it into view. */
  #updateFocus() {
    const items = this.querySelectorAll('.e-select-box__item');
    items.forEach((item, i) => item.classList.toggle('focused', i === this.#focusIndex));
    items[this.#focusIndex]?.scrollIntoView({ block: 'nearest' });
  }

  /** Return the index of the first non-disabled option, or -1 if none. */
  #firstEnabledIndex() {
    return this.#options.findIndex(o => !o.disabled);
  }
}

!customElements.get('select-box') && customElements.define('select-box', SelectBox);
