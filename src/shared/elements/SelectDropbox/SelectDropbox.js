import '../SelectBox/SelectBox.js';

/**
 * Custom element that replaces the native <select> tag.
 *
 * On mobile (≤768px) renders a native <select> for better UX.
 * On desktop renders a custom trigger button backed by a <select-box> dropdown
 * with keyboard navigation, smart positioning and a scrollbar when needed.
 *
 * HTML usage:
 *   <select-dropbox name="fruit" placeholder="Choose a fruit">
 *     <option value="apple">Apple</option>
 *     <option value="banana" selected>Banana</option>
 *     <option value="cherry" disabled>Cherry</option>
 *   </select-dropbox>
 *
 * JS usage:
 *   const el = document.querySelector('select-dropbox');
 *   el.value('apple');                         // programmatic selection
 *   console.log(el.value());                   // 'apple'
 *   console.log(el.index());                   // 0
 *   el.addEventListener('change', e => ...);   // same as native <select>
 *
 * Attributes:
 *   name        — forwarded to the hidden native <select> for form submit
 *   placeholder — text shown when nothing is selected
 *   disabled    — disables all interaction
 */
class SelectDropbox extends HTMLElement {
    /** @type {{ value: string, label: string, disabled: boolean, selected: boolean }[]} */
    #options = [];
    /** @type {string|null} */
    #selectedValue = null;
    #selectedLabel = '';
    #isOpen = false;
    /** @type {InstanceType<SelectBox>|null} */
    #selectBox = null;
    /** Stored so they can be removed in disconnectedCallback */
    #outsideClickHandler = null;
    #scrollHandler = null;

    /** Lifecycle: parse <option> children, build DOM, attach events. */
    connectedCallback() {
        this.#parseOptions();
        this.#render();
        this.#setupEvents();
    }

    /** Lifecycle: remove document-level listeners. */
    disconnectedCallback() {
        if (this.#outsideClickHandler) {
            document.removeEventListener('click', this.#outsideClickHandler);
        }
        if (this.#scrollHandler) {
            window.removeEventListener('scroll', this.#scrollHandler, true);
        }
    }

    /**
     * Get or set the selected value.
     * Called without arguments — returns the current value.
     * Called with an argument — selects the matching option (ignored if not found).
     * @param {string} [v]
     * @returns {string|null|SelectDropbox} Current value when getting, `this` when setting.
     * @example
     *   const el = document.querySelector('select-dropbox');
     *   console.log(el.value()); // 'banana'
     *   el.value('apple');       // programmatic selection
     */
    value(v) {
        if (!arguments.length) return this.#selectedValue;
        const opt = this.#options.find(o => o.value === v);
        if (opt) this.#selectOption(opt.value, opt.label);
        return this;
    }

    /**
     * Get or set the selected option by index.
     * Called without arguments — returns the index of the currently selected option (-1 if none).
     * Called with an argument — selects the option at that index (ignored if out of range or disabled).
     * @param {number} [i]
     * @returns {number|SelectDropbox} Current index when getting, `this` when setting.
     * @example
     *   const el = document.querySelector('select-dropbox');
     *   console.log(el.index()); // 2
     *   el.index(0);             // select first option
     */
    index(i) {
        if (!arguments.length) return this.#options.findIndex(o => o.value === this.#selectedValue);
        const opt = this.#options[i];
        if (opt && !opt.disabled) this.#selectOption(opt.value, opt.label);
        return this;
    }

    /** Read <option> children into #options and detect initial selection. */
    #parseOptions() {
        this.#options = [];
        this.#selectedValue = null;
        this.#selectedLabel = '';

        this.querySelectorAll('option').forEach(el => {
            const opt = {
                value: el.value,
                label: el.textContent.trim(),
                disabled: el.disabled || el.hasAttribute('disabled'),
                selected: el.hasAttribute('selected') || el.selected,
            };
            if (opt.selected && !opt.disabled) {
                this.#selectedValue = opt.value;
                this.#selectedLabel = opt.label;
            }
            this.#options.push(opt);
        });
    }

    /** Build the trigger button, native select and <select-box> dropdown. */
    #render() {
        const placeholder = this.getAttribute('placeholder') || 'Select…';
        const isDisabled = this.hasAttribute('disabled');
        const name = this.getAttribute('name') || '';
        const displayLabel = this.#selectedLabel || placeholder;

        this.classList.add('e-select-dropbox');
        this.innerHTML = '';

        // --- Native select (mobile) ---
        const nativeSelect = document.createElement('select');
        nativeSelect.className = 'e-select-dropbox__native';
        if (name) nativeSelect.name = name;
        if (isDisabled) nativeSelect.disabled = true;

        if (!this.#selectedValue) {
            const ph = document.createElement('option');
            ph.value = '';
            ph.textContent = placeholder;
            ph.disabled = true;
            ph.selected = true;
            nativeSelect.appendChild(ph);
        }

        this.#options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.value;
            el.textContent = opt.label;
            if (opt.disabled) el.disabled = true;
            if (opt.value === this.#selectedValue) el.selected = true;
            nativeSelect.appendChild(el);
        });

        // --- Custom UI (desktop) ---
        const custom = document.createElement('div');
        custom.className = 'e-select-dropbox__custom';

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'e-select-dropbox__trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        if (isDisabled) trigger.disabled = true;

        const label = document.createElement('span');
        label.className = 'e-select-dropbox__label';
        label.textContent = displayLabel;

        const chevron = document.createElement('i');
        chevron.className = 'e-icon e-icon--chevron-expand-b';

        trigger.appendChild(label);
        trigger.appendChild(chevron);

        // --- SelectBox (dropdown list) ---
        this.#selectBox = document.createElement('select-box');
        this.#selectBox.setOptions(this.#options);

        custom.appendChild(trigger);
        custom.appendChild(this.#selectBox);

        this.appendChild(nativeSelect);
        this.appendChild(custom);
    }

    /** Attach trigger, native select, SelectBox and document-level listeners. */
    #setupEvents() {
        const trigger = this.querySelector('.e-select-dropbox__trigger');
        const nativeSelect = this.querySelector('.e-select-dropbox__native');

        trigger?.addEventListener('click', () => this.#toggle());

        this.#selectBox?.addEventListener('select', e => {
            this.#selectOption(e.detail.value, e.detail.label);
        });

        nativeSelect?.addEventListener('change', () => {
            const sel = nativeSelect.options[nativeSelect.selectedIndex];
            if (sel?.value) this.#selectOption(sel.value, sel.textContent.trim());
        });

        this.addEventListener('keydown', e => this.#handleKeydown(e));

        // Stored references are needed to remove the listeners on disconnect
        this.#outsideClickHandler = e => {
            if (!this.contains(e.target)) this.#close();
        };
        document.addEventListener('click', this.#outsideClickHandler);

        // capture:true catches scroll on any nested scrollable container, not only window
        this.#scrollHandler = e => {
            if (this.#isOpen && !this.contains(e.target)) this.#close();
        };
        window.addEventListener('scroll', this.#scrollHandler, true);
    }

    /** Toggle open/close state. */
    #toggle() {
        this.#isOpen ? this.#close() : this.#open();
    }

    /** Open the dropdown. */
    #open() {
        if (this.hasAttribute('disabled')) return;
        this.#isOpen = true;

        const trigger = this.querySelector('.e-select-dropbox__trigger');
        trigger?.setAttribute('aria-expanded', 'true');
        trigger?.querySelector('.e-icon')
            ?.classList.replace('e-icon--chevron-expand-b', 'e-icon--chevron-contract-b');
        this.#selectBox?.open(trigger);
    }

    /** Close the dropdown and return focus to the trigger button. */
    #close() {
        this.#isOpen = false;

        const trigger = this.querySelector('.e-select-dropbox__trigger');
        this.#selectBox?.close();
        trigger?.setAttribute('aria-expanded', 'false');
        trigger?.querySelector('.e-icon')
            ?.classList.replace('e-icon--chevron-contract-b', 'e-icon--chevron-expand-b');
        trigger?.focus();
    }

    /**
     * Apply a selection: update label, sync SelectBox and native select, dispatch 'change'.
     * @param {string} value
     * @param {string} label
     */
    #selectOption(value, label) {
        this.#selectedValue = value;
        this.#selectedLabel = label;

        const labelEl = this.querySelector('.e-select-dropbox__label');
        if (labelEl) labelEl.textContent = label;

        this.#selectBox?.setSelected(value);

        const nativeSelect = this.querySelector('.e-select-dropbox__native');
        if (nativeSelect) nativeSelect.value = value;

        this.dispatchEvent(new Event('change', { bubbles: true }));
        this.#close();
    }

    /**
     * Handle keyboard events.
     * Closed: Enter/Space opens the dropdown.
     * Open: ArrowUp/Down navigate, Enter/Space confirm, Escape closes.
     * @param {KeyboardEvent} e
     */
    #handleKeydown(e) {
        if (!this.#isOpen) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.#open();
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.#close();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.#selectBox?.moveFocus(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.#selectBox?.moveFocus(-1);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.#selectBox?.confirmFocus();
                break;
        }
    }
}

!customElements.get('select-dropbox') && customElements.define('select-dropbox', SelectDropbox);
