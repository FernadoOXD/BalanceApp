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
    private String alimentacion;
    private String ejercicioDescripcion; // Resumen corto para la tarjeta
    private String ejercicio;            // Rutina detallada (modal de ejercicios)
    private String menuExcel;            // Matriz JSON del menú semanal
    private String nombrePaciente;       // Nombre real obtenido del JOIN con PACIENTE

    // Método clave para que el frontend (p.nombre) lo lea sin errores
    public String getNombre() {
        return nombrePaciente;
    }

    public String getNombrePaciente() {
        return nombrePaciente;
    }

    public void setNombrePaciente(String nombrePaciente) {
        this.nombrePaciente = nombrePaciente;
    }

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

    public String getAlimentacion() {
        return alimentacion;
    }

    public void setAlimentacion(String alimentacion) {
        this.alimentacion = alimentacion;
    }

    public String getEjercicioDescripcion() {
        return ejercicioDescripcion;
    }

    public void setEjercicioDescripcion(String ejercicioDescripcion) {
        this.ejercicioDescripcion = ejercicioDescripcion;
    }

    public String getEjercicio() {
        return ejercicio;
    }

    public void setEjercicio(String ejercicio) {
        this.ejercicio = ejercicio;
    }

    public String getMenuExcel() {
        return menuExcel;
    }

    public void setMenuExcel(String menuExcel) {
        this.menuExcel = menuExcel;
    }
}