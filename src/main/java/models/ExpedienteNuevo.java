package models;

import java.sql.Date;

public class ExpedienteNuevo {
    private int idExpediente;
    private int idPaciente;
    private String antecedenteFamiliares;
    private String patologiaPrevia;
    private String alergiaIntolerancia;
    private String medicamentoActual;
    private String habitoToxico;
    private Date fechaInicializacion;
    private String notasInternas;

    public ExpedienteNuevo() {}

    public int getIdExpediente() {
        return idExpediente;
    }

    public void setIdExpediente(int idExpediente) {
        this.idExpediente = idExpediente;
    }

    public int getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(int idPaciente) {
        this.idPaciente = idPaciente;
    }

    public String getAntecedenteFamiliares() {
        return antecedenteFamiliares;
    }

    public void setAntecedenteFamiliares(String antecedenteFamiliares) {
        this.antecedenteFamiliares = antecedenteFamiliares;
    }

    public String getPatologiaPrevia() {
        return patologiaPrevia;
    }

    public void setPatologiaPrevia(String patologiaPrevia) {
        this.patologiaPrevia = patologiaPrevia;
    }

    public String getAlergiaIntolerancia() {
        return alergiaIntolerancia;
    }

    public void setAlergiaIntolerancia(String alergiaIntolerancia) {
        this.alergiaIntolerancia = alergiaIntolerancia;
    }

    public String getMedicamentoActual() {
        return medicamentoActual;
    }

    public void setMedicamentoActual(String medicamentoActual) {
        this.medicamentoActual = medicamentoActual;
    }

    public String getHabitoToxico() {
        return habitoToxico;
    }

    public void setHabitoToxico(String habitoToxico) {
        this.habitoToxico = habitoToxico;
    }

    public Date getFechaInicializacion() {
        return fechaInicializacion;
    }

    public void setFechaInicializacion(Date fechaInicializacion) {
        this.fechaInicializacion = fechaInicializacion;
    }

    public String getNotasInternas() {
        return notasInternas;
    }

    public void setNotasInternas(String notasInternas) {
        this.notasInternas = notasInternas;
    }

}