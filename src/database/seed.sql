-- -------------------------------------------------------------------
-- ARCHIVO DE SEMBRADO (SEED) - BALANCE APP
-- Datos ficticios para pruebas de Frontend y Dashboards (Streamlit)
-- -------------------------------------------------------------------

USE balanceapp;

-- 1. PACIENTES
INSERT INTO `PACIENTE` (`nombres`, `apellidoPaterno`, `apellidoMaterno`, `fechaNacimiento`, `genero`, `telefono`, `email`, `contrasena`) VALUES
('Carlos', 'López', 'García', '1990-05-15', 'Masculino', '9611234567', 'carlos.lopez@email.com', 'pwd_encriptada_123'),
('María', 'Pérez', 'Gómez', '1985-08-22', 'Femenino', '9617654321', 'maria.perez@email.com', 'pwd_encriptada_123'),
('Luis', 'Ruiz', 'Díaz', '2001-11-10', 'Masculino', '9611112222', 'luis.ruiz@email.com', 'pwd_encriptada_123'),
('Ana', 'Torres', 'Méndez', '1995-03-08', 'Femenino', '9613334444', 'ana.torres@email.com', 'pwd_encriptada_123');

-- 2. DIAGNÓSTICOS BASE
INSERT INTO `diagnostico` (`descripcionPrincipal`, `observacion`) VALUES
('Obesidad Grado I', 'Requiere plan calórico restrictivo y ejercicio cardiovascular'),
('Diabetes Tipo 2', 'Control de carbohidratos simples, monitoreo estricto de glucosa'),
('Hipertensión Arterial', 'Reducción de ingesta de sodio a menos de 2g diarios'),
('Desnutrición Leve', 'Aumento de ingesta proteica y calórica progresiva');

-- 3. EXPEDIENTE NUEVO (Primera valoración)
INSERT INTO `expedientenuevo` (`idPaciente`, `antecedenteFamiliares`, `patologiaPrevia`, `alergiaIntolerancia`, `medicamentoActual`, `habitoToxico`, `fechaInicializacion`, `notasInternas`) VALUES
(1, 'Padre con hipertensión', 'Ninguna', 'Intolerancia a la lactosa', 'Ninguno', 'Tabaquismo ocasional', '2026-06-01', 'Paciente muy motivado para bajar de peso, requiere seguimiento quincenal.'),
(2, 'Madre con diabetes', 'Resistencia a la insulina', 'Alérgico a mariscos', 'Metformina 500mg', 'Ninguno', '2026-06-15', 'Requiere seguimiento estricto de dieta para evitar picos de insulina.'),
(3, 'Ninguno', 'Gastritis leve', 'Ninguna', 'Omeprazol (ocasional)', 'Consumo frecuente de alcohol en fin de semana', '2026-07-01', 'Busca hipertrofia muscular y recomposición corporal.');

-- 4. CITAS (Pasadas y Futuras)
INSERT INTO `cita` (`idPaciente`, `fecha`, `hora`, `motivoConsulta`, `estado`) VALUES
(1, '2026-06-01', '10:00:00', 'Valoración inicial', 'Completada'),
(1, '2026-07-10', '10:00:00', 'Seguimiento mensual', 'Completada'),
(2, '2026-06-15', '11:30:00', 'Control de glucosa y peso', 'Completada'),
(3, '2026-07-01', '16:00:00', 'Asesoría deportiva', 'Completada'),
(4, '2026-07-20', '09:00:00', 'Valoración nutricional', 'Programada');

-- 5. MEDICIONES (Amarradas a las citas completadas)
INSERT INTO `medicion` (`idPaciente`, `idCita`, `fechaMedicion`, `pesoKg`, `estaturaCm`, `porcentajeGrasa`, `porcentajeMusculo`, `circunferenciaCintura`) VALUES
(1, 1, '2026-06-01', 95.5, 175.0, 32.5, 40.1, 105.0),
(1, 2, '2026-07-10', 93.5, 175.0, 31.0, 40.5, 102.5), -- Se nota una bajada de peso para tus gráficas
(2, 3, '2026-06-15', 78.2, 160.0, 35.0, 35.2, 92.0),
(3, 4, '2026-07-01', 70.0, 180.0, 15.0, 50.5, 80.0);

-- 6. SEGUIMIENTO DE EXPEDIENTES
INSERT INTO `expedienteseguimiento` (`idPaciente`, `idExpediente`, `fechaActualizacion`, `notasInternasActualizada`) VALUES
(1, 1, '2026-07-10', 'El paciente ha mejorado su apego a la dieta, bajó 2 kilos y redujo su circunferencia de cintura.'),
(2, 2, '2026-07-12', 'Refiere ligeros dolores de cabeza en las mañanas, se ajustarán los carbohidratos del desayuno.');

-- 7. TRATAMIENTOS
INSERT INTO `tratamiento` (`idPaciente`, `fechaInicio`, `fechaFin`, `objetivo`, `caloriaDiaria`, `estado`) VALUES
(1, '2026-06-01', '2026-09-01', 'Pérdida de peso y reducción de porcentaje de grasa', 1800.5, 'Activo'),
(2, '2026-06-15', '2026-12-15', 'Control glucémico y reducción de peso', 1600.0, 'Activo'),
(3, '2026-07-01', '2026-10-01', 'Aumento de masa muscular (Superávit calórico)', 2800.0, 'Activo');

-- 8. MENÚS (Utilizando formato JSON nativo)
INSERT INTO `menu` (`idTratamiento`, `tipoComida`, `diaSemana`, `descripcionAlimento`, `macronutrientes`) VALUES
(1, 'Desayuno', 'Lunes', 'Huevos revueltos con espinaca y 2 tortillas de maíz', '{"proteinas": 20, "carbohidratos": 30, "grasas": 15}'),
(1, 'Comida', 'Lunes', 'Pechuga de pollo a la plancha con arroz integral y brócoli al vapor', '{"proteinas": 40, "carbohidratos": 45, "grasas": 10}'),
(3, 'Desayuno', 'Lunes', 'Avena con leche entera, plátano, crema de cacahuate y proteína', '{"proteinas": 35, "carbohidratos": 60, "grasas": 12}');

-- 9. PACIENTE_DIAGNOSTICO (Relación M:N)
INSERT INTO `paciente_diagnostico` (`idPaciente`, `idDiagnostico`, `fechaDiagnostico`) VALUES
(1, 1, '2026-06-01'),
(2, 1, '2026-06-15'),
(2, 2, '2026-06-15'); -- El paciente 2 tiene dos diagnósticos cruzados

-- 10. CITA_DIAGNOSTICO (Relación M:N)
INSERT INTO `cita_diagnostico` (`idCita`, `idDiagnostico`, `notasClinicas`) VALUES
(1, 1, 'Se confirma IMC de 31.1, encaja en obesidad grado I.'),
(3, 2, 'Glucosa en ayuno elevada (125 mg/dL) durante la consulta.');

-- 11. ENCUESTAS (Utilizando formato JSON nativo)
INSERT INTO `encuesta` (`idCita`, `idPaciente`, `datosEncuesta`) VALUES
(1, 1, '{"satisfaccion": 5, "atencion": "Excelente", "comentarios": "El especialista resolvió todas mis dudas sobre la dieta."}'),
(3, 2, '{"satisfaccion": 4, "atencion": "Buena", "comentarios": "Buen servicio, pero tuve dificultad para agendar en este horario."}');