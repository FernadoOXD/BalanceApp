package models;

public class Menu {
    private int idMenu;
    private int idTratamiento;
    private String tipoComida;
    private String diaSemana;
    private String descripcionAlimento;
    private String macronutrientes;

    public Menu() {}

    public int getIdMenu() {
        return idMenu;
    }

    public void setIdMenu(int idMenu) {
        this.idMenu = idMenu;
    }

    public int getIdTratamiento() {
        return idTratamiento;
    }

    public void setIdTratamiento(int idTratamiento) {
        this.idTratamiento = idTratamiento;
    }

    public String getTipoComida() {
        return tipoComida;
    }

    public void setTipoComida(String tipoComida) {
        this.tipoComida = tipoComida;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public String getDescripcionAlimento() {
        return descripcionAlimento;
    }

    public void setDescripcionAlimento(String descripcionAlimento) {
        this.descripcionAlimento = descripcionAlimento;
    }

    public String getMacronutrientes() {
        return macronutrientes;
    }

    public void setMacronutrientes(String macronutrientes) {
        this.macronutrientes = macronutrientes;
    }

}