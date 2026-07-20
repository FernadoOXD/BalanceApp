const isProduction = false; 

// URL de desarrollo (Javalin corriendo en tu computadora)  
const LOCAL_URL = "http://localhost:5000";

// URL de producción (La futura dirección real de tu backend)
const PROD_URL = "https://api-balanceapp-produccion.up.railway.app"; 

// Exportamos la URL correcta dependiendo del entorno
export const API_BASE_URL = isProduction ? PROD_URL : LOCAL_URL;