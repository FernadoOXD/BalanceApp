package models;

import java.sql.Date;

public class Medicion {
    private int idMedicion;
    private int idCita;
    private Date fechaMedicion;
    private float pesoKg;
    private float estaturaCm;
    private float porcentajeGrasa;
    private float porcentajeMusculo;
    private float circunferenciaCintura;

    public Medicion() {}

    public int getIdMedicion() {
        return idMedicion;
    }

    public void setIdMedicion(int idMedicion) {
        this.idMedicion = idMedicion;
    }

    public int getIdCita() {
        return idCita;
    }

    public void setIdCita(int idCita) {
        this.idCita = idCita;
    }

    public Date getFechaMedicion() {
        return fechaMedicion;
    }

    public void setFechaMedicion(Date fechaMedicion) {
        this.fechaMedicion = fechaMedicion;
    }

    public float getPesoKg() {
        return pesoKg;
    }

    public void setPesoKg(float pesoKg) {
        this.pesoKg = pesoKg;
    }

    public float getEstaturaCm() {
        return estaturaCm;
    }

    public void setEstaturaCm(float estaturaCm) {
        this.estaturaCm = estaturaCm;
    }

    public float getPorcentajeGrasa() {
        return porcentajeGrasa;
    }

    public void setPorcentajeGrasa(float porcentajeGrasa) {
        this.porcentajeGrasa = porcentajeGrasa;
    }

    public float getPorcentajeMusculo() {
        return porcentajeMusculo;
    }

    public void setPorcentajeMusculo(float porcentajeMusculo) {
        this.porcentajeMusculo = porcentajeMusculo;
    }

    public float getCircunferenciaCintura() {
        return circunferenciaCintura;
    }

    public void setCircunferenciaCintura(float circunferenciaCintura) {
        this.circunferenciaCintura = circunferenciaCintura;
    }

}