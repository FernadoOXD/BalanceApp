package models;

import java.sql.Date;

public class ExpedienteSeguimiento {
    private int idSeguimiento;
    private int idExpediente;
    private Date fechaActualizacion;
    private String notasInternasActualizada;

    public ExpedienteSeguimiento() {}

    public int getIdSeguimiento() {
        return idSeguimiento;
    }

    public void setIdSeguimiento(int idSeguimiento) {
        this.idSeguimiento = idSeguimiento;
    }

    public int getIdExpediente() {
        return idExpediente;
    }

    public void setIdExpediente(int idExpediente) {
        this.idExpediente = idExpediente;
    }

    public Date getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(Date fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public String getNotasInternasActualizada() {
        return notasInternasActualizada;
    }

    public void setNotasInternasActualizada(String notasInternasActualizada) {
        this.notasInternasActualizada = notasInternasActualizada;
    }

}