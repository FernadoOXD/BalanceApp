const isProduction = true; 

// URL de desarrollo (Javalin corriendo en tu computadora)  
const LOCAL_URL = "http://localhost:5000";

// URL de producción (La futura dirección real de tu backend)
const PROD_URL = "http://100.58.9.182:5000";

// Exportamos la URL correcta dependiendo del entorno
export const API_BASE_URL = isProduction ? PROD_URL : LOCAL_URL;