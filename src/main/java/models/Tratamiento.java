package models;

import java.sql.Date;

public class Tratamiento {
    private int idTratamiento;
    private int idPaciente;
    private Date fechaInicio;
    private Date fechaFin;
    private String objetivo;
    private float caloriaDiaria;
    private String estado;

    public Tratamiento() {}

    public int getIdTratamiento() {
        return idTratamiento;
    }

    public void setIdTratamiento(int idTratamiento) {
        this.idTratamiento = idTratamiento;
    }

    public int getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(int idPaciente) {
        this.idPaciente = idPaciente;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Date getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(Date fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getObjetivo() {
        return objetivo;
    }

    public void setObjetivo(String objetivo) {
        this.objetivo = objetivo;
    }

    public float getCaloriaDiaria() {
        return caloriaDiaria;
    }

    public void setCaloriaDiaria(float caloriaDiaria) {
        this.caloriaDiaria = caloriaDiaria;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

}