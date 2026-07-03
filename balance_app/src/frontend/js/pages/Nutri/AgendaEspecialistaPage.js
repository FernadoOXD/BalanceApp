export class AgendaEspecialistaPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <app-sidebar></app-sidebar>
        `;
  }
}
