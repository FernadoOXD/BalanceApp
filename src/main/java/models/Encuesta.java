package models;

import java.sql.Timestamp;

public class Encuesta {
    private int idEncuesta;
    private int idCita;
    private int idPaciente;
    private String datosEncuesta;
    private Timestamp fechaCreacion;

    public Encuesta() {}

    public int getIdEncuesta() {
        return idEncuesta;
    }

    public void setIdEncuesta(int idEncuesta) {
        this.idEncuesta = idEncuesta;
    }

    public int getIdCita() {
        return idCita;
    }

    public void setIdCita(int idCita) {
        this.idCita = idCita;
    }

    public int getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(int idPaciente) {
        this.idPaciente = idPaciente;
    }

    public String getDatosEncuesta() {
        return datosEncuesta;
    }

    public void setDatosEncuesta(String datosEncuesta) {
        this.datosEncuesta = datosEncuesta;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}