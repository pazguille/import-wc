class ImportWC extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src') {
      let text = '';
      try {
        const mode = this.getAttribute('mode') || 'cors';
        const response = await fetch(newValue, { mode });
        if (!response.ok) {
          throw new Error();
        }
        text = await response.text();
        if (this.getAttribute('src') !== newValue) {
          return;
        }
      } catch(err) {
        this.dispatchEvent(new ErrorEvent('error', err));
        return;
      }

      this.shadowRoot.innerHTML = text;

      [...this.shadowRoot.querySelectorAll('script')].map((s) => {
        const script = document.createElement('script');
        script.innerHTML = s.innerHTML;
        s.remove();
        this.shadowRoot.appendChild(script);
      });

      this.dispatchEvent(new Event('load'));
    }
  }
}

if (!window.customElements.get('import-wc')) {
  window.ImportWC = ImportWC;
  window.customElements.define('import-wc', ImportWC)
}
