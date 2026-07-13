USE balanceapp;


CREATE TABLE `PACIENTE` (
  `idPaciente` int AUTO_INCREMENT PRIMARY KEY,
  `nombres` varchar(25) NOT NULL,
  `apellidoPaterno` varchar(15) NOT NULL,
  `apellidoMaterno` varchar(15),
  `fechaNacimiento` date,
  `genero` varchar(255),	
  `telefono` varchar(255),
  `email` varchar(255) UNIQUE NOT NULL,
  `contrasena` varchar(255) NOT NULL
);

CREATE TABLE `diagnostico` (
  `idDiagnostico` int AUTO_INCREMENT PRIMARY KEY,
  `descripcionPrincipal` varchar(255) NOT NULL,
  `observacion` varchar(255)
);

CREATE TABLE `expedientenuevo` (
  `idExpediente` int AUTO_INCREMENT PRIMARY KEY,
  `idPaciente` int UNIQUE NOT NULL,
  `antecedenteFamiliares` varchar(300),
  `patologiaPrevia` varchar(200),
  `alergiaIntolerancia` varchar(200),
  `medicamentoActual` varchar(200),
  `habitoToxico` varchar(255),
  `fechaInicializacion` date,
  `notasInternas` varchar(255)
);

CREATE TABLE `expedienteseguimiento` (
  `idSeguimiento` int AUTO_INCREMENT PRIMARY KEY,
  `idPaciente` int NOT NULL,
  `idExpediente` int NOT NULL,
  `fechaActualizacion` date NOT NULL,
  `notasInternasActualizada` varchar(1000)
);

CREATE TABLE `cita` (
  `idCita` int AUTO_INCREMENT PRIMARY KEY,
  `idPaciente` int NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `motivoConsulta` varchar(255),
  `estado` varchar(255)
);

CREATE TABLE `medicion` (
  `idMedicion` int AUTO_INCREMENT PRIMARY KEY,
  `idPaciente` int NOT NULL,
  `idCita` int NOT NULL,
  `fechaMedicion` date NOT NULL,
  `pesoKg` float,
  `estaturaCm` float,
  `porcentajeGrasa` float,
  `porcentajeMusculo` float,
  `circunferenciaCintura` float
);

CREATE TABLE `tratamiento` (
  `idTratamiento` int AUTO_INCREMENT PRIMARY KEY,
  `idPaciente` int NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date,
  `objetivo` varchar(255),
  `caloriaDiaria` float,
  `estado` varchar(255)
);

CREATE TABLE `menu` (
  `idMenu` int AUTO_INCREMENT PRIMARY KEY,
  `idTratamiento` int NOT NULL,
  `tipoComida` varchar(255),
  `diaSemana` varchar(255),
  `descripcionAlimento` varchar(255),
  `macronutrientes` json
);

CREATE TABLE `paciente_diagnostico` (
  `idPaciente` int,
  `idDiagnostico` int,
  `fechaDiagnostico` date NOT NULL,
  PRIMARY KEY (`idPaciente`, `idDiagnostico`)
);

CREATE TABLE `cita_diagnostico` (
  `idCita` int,
  `idDiagnostico` int,
  `notasClinicas` varchar(255),
  PRIMARY KEY (`idCita`, `idDiagnostico`)
);

CREATE TABLE `encuesta` (
  `idEncuesta` int AUTO_INCREMENT PRIMARY KEY,
  `idCita` int NOT NULL,
  `idPaciente` int NOT NULL,
  `datosEncuesta` json NOT NULL,
  `fechaCreacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`idCita`) REFERENCES `cita` (`idCita`) ON DELETE CASCADE,
  FOREIGN KEY (`idPaciente`) REFERENCES `PACIENTE` (`idPaciente`) ON DELETE CASCADE
);

-- 2. CREACIÓN DE RELACIONES (Llaves Foráneas)
-- Relaciones de Expedientes
ALTER TABLE `expedientenuevo` ADD CONSTRAINT `fk_expediente_paciente` FOREIGN KEY (`idPaciente`) REFERENCES `PACIENTE` (`idPaciente`) ON DELETE CASCADE;
ALTER TABLE `expedienteseguimiento` ADD CONSTRAINT `fk_seguimiento_paciente` FOREIGN KEY (`idPaciente`) REFERENCES `PACIENTE` (`idPaciente`) ON DELETE CASCADE;
ALTER TABLE `expedienteseguimiento` ADD CONSTRAINT `fk_seguimiento_expediente` FOREIGN KEY (`idExpediente`) REFERENCES `expedientenuevo` (`idExpediente`) ON DELETE CASCADE;

-- Relaciones de Cita y Medición
ALTER TABLE `cita` ADD CONSTRAINT `fk_cita_paciente` FOREIGN KEY (`idPaciente`) REFERENCES `PACIENTE` (`idPaciente`) ON DELETE CASCADE;
ALTER TABLE `medicion` ADD CONSTRAINT `fk_medicion_paciente` FOREIGN KEY (`idPaciente`) REFERENCES `PACIENTE` (`idPaciente`) ON DELETE CASCADE;
ALTER TABLE `medicion` ADD CONSTRAINT `fk_medicion_cita` FOREIGN KEY (`idCita`) REFERENCES `cita` (`idCita`) ON DELETE CASCADE;

-- Relaciones de Tratamiento y Menú
ALTER TABLE `tratamiento` ADD CONSTRAINT `fk_tratamiento_paciente` FOREIGN KEY (`idPaciente`) REFERENCES `PACIENTE` (`idPaciente`) ON DELETE CASCADE;
ALTER TABLE `menu` ADD CONSTRAINT `fk_menu_tratamiento` FOREIGN KEY (`idTratamiento`) REFERENCES `tratamiento` (`idTratamiento`) ON DELETE CASCADE;

-- Relaciones Intermedias (M:N)
ALTER TABLE `paciente_diagnostico` ADD CONSTRAINT `fk_pd_paciente` FOREIGN KEY (`idPaciente`) REFERENCES `PACIENTE` (`idPaciente`) ON DELETE CASCADE;
ALTER TABLE `paciente_diagnostico` ADD CONSTRAINT `fk_pd_diagnostico` FOREIGN KEY (`idDiagnostico`) REFERENCES `diagnostico` (`idDiagnostico`) ON DELETE CASCADE;

ALTER TABLE `cita_diagnostico` ADD CONSTRAINT `fk_cd_cita` FOREIGN KEY (`idCita`) REFERENCES `cita` (`idCita`) ON DELETE CASCADE;
ALTER TABLE `cita_diagnostico` ADD CONSTRAINT `fk_cd_diagnostico` FOREIGN KEY (`idDiagnostico`) REFERENCES `diagnostico` (`idDiagnostico`) ON DELETE CASCADE;