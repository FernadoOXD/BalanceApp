export class TratamientoEspecialistaPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <app-sidebar-especialista></app-sidebar-especialista>
        `;
  }
}
