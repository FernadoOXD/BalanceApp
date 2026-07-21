package models;

public class ExpedienteNuevo {

    private int idExpediente;
    private int idPaciente;
    private String nombrePaciente;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String sexo;
    private String edad;
    private String ocupacion;
    private String procedencia;
    private String escolaridad;
    private String ejercicio;
    private String objetivo;
    private String altura;
    private String peso;
    private String talla;
    private String imc;
    private String cintura;
    private String antecedenteFamiliares;
    private String patologiaPrevia;
    private String alergiaIntolerancia;
    private String medicamentoActual;
    private String habitoToxico;
    private String fechaInicializacion; // <- Cambiado a String para evitar errores 500
    private String notasInternas;

    public ExpedienteNuevo() {
    }

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

    public String getFechaInicializacion() {
        return fechaInicializacion;
    }

    public void setFechaInicializacion(String fechaInicializacion) {
        this.fechaInicializacion = fechaInicializacion;
    }

    public String getNotasInternas() {
        return notasInternas;
    }

    public void setNotasInternas(String notasInternas) {
        this.notasInternas = notasInternas;
    }

    public String getNombrePaciente() {
        return nombrePaciente;
    }

    public void setNombrePaciente(String nombrePaciente) {
        this.nombrePaciente = nombrePaciente;
    }

    public String getApellidoPaterno() {
        return apellidoPaterno;
    }

    public void setApellidoPaterno(String apellidoPaterno) {
        this.apellidoPaterno = apellidoPaterno;
    }

    public String getApellidoMaterno() {
        return apellidoMaterno;
    }

    public void setApellidoMaterno(String apellidoMaterno) {
        this.apellidoMaterno = apellidoMaterno;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getEdad() {
        return edad;
    }

    public void setEdad(String edad) {
        this.edad = edad;
    }

    public String getOcupacion() {
        return ocupacion;
    }

    public void setOcupacion(String ocupacion) {
        this.ocupacion = ocupacion;
    }

    public String getProcedencia() {
        return procedencia;
    }

    public void setProcedencia(String procedencia) {
        this.procedencia = procedencia;
    }

    public String getEscolaridad() {
        return escolaridad;
    }

    public void setEscolaridad(String escolaridad) {
        this.escolaridad = escolaridad;
    }

    public String getEjercicio() {
        return ejercicio;
    }

    public void setEjercicio(String ejercicio) {
        this.ejercicio = ejercicio;
    }

    public String getObjetivo() {
        return objetivo;
    }

    public void setObjetivo(String objetivo) {
        this.objetivo = objetivo;
    }

    public String getAltura() {
        return altura;
    }

    public void setAltura(String altura) {
        this.altura = altura;
    }

    public String getPeso() {
        return peso;
    }

    public void setPeso(String peso) {
        this.peso = peso;
    }

    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    public String getImc() {
        return imc;
    }

    public void setImc(String imc) {
        this.imc = imc;
    }

    public String getCintura() {
        return cintura;
    }

    public void setCintura(String cintura) {
        this.cintura = cintura;
    }
}
