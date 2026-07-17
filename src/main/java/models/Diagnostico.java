package models;

public class Diagnostico {
    private int idDiagnostico;
    private String descripcionPrincipal;
    private String observacion;

    public Diagnostico() {}

    public int getIdDiagnostico() {
        return idDiagnostico;
    }

    public void setIdDiagnostico(int idDiagnostico) {
        this.idDiagnostico = idDiagnostico;
    }

    public String getDescripcionPrincipal() {
        return descripcionPrincipal;
    }

    public void setDescripcionPrincipal(String descripcionPrincipal) {
        this.descripcionPrincipal = descripcionPrincipal;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
    
    // Generar Getters y Setters aquí...
}