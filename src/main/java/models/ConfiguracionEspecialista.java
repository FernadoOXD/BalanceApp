package models;

public class ConfiguracionEspecialista {
    private int idConfiguracion;
    private String datosConfiguracion;

    public ConfiguracionEspecialista() {}

    public int getIdConfiguracion() {
        return idConfiguracion;
    }

    public void setIdConfiguracion(int idConfiguracion) {
        this.idConfiguracion = idConfiguracion;
    }

    public String getDatosConfiguracion() {
        return datosConfiguracion;
    }

    public void setDatosConfiguracion(String datosConfiguracion) {
        this.datosConfiguracion = datosConfiguracion;
    }
}
