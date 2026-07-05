export class AgendaPacientePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <app-sidebar-paciente></app-sidebar-paciente>
        `;
  }
}
