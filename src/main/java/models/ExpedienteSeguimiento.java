package models;

public class ExpedienteSeguimiento {
    private int idSeguimiento;
    private int idExpediente;
    private String fechaActualizacion;
    private String peso;
    private String altura;
    private String imc;
    private String cintura;
    private String objetivoSeguimiento;
    private String notasInternasActualizada;

    public ExpedienteSeguimiento() {}

    // Getters y Setters
    public int getIdSeguimiento() { return idSeguimiento; }
    public void setIdSeguimiento(int idSeguimiento) { this.idSeguimiento = idSeguimiento; }

    public int getIdExpediente() { return idExpediente; }
    public void setIdExpediente(int idExpediente) { this.idExpediente = idExpediente; }

    public String getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(String fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public String getPeso() { return peso; }
    public void setPeso(String peso) { this.peso = peso; }

    public String getAltura() { return altura; }
    public void setAltura(String altura) { this.altura = altura; }

    public String getImc() { return imc; }
    public void setImc(String imc) { this.imc = imc; }

    public String getCintura() { return cintura; }
    public void setCintura(String cintura) { this.cintura = cintura; }

    public String getObjetivoSeguimiento() { return objetivoSeguimiento; }
    public void setObjetivoSeguimiento(String objetivoSeguimiento) { this.objetivoSeguimiento = objetivoSeguimiento; }

    public String getNotasInternasActualizada() { return notasInternasActualizada; }
    public void setNotasInternasActualizada(String notasInternasActualizada) { this.notasInternasActualizada = notasInternasActualizada; }
}