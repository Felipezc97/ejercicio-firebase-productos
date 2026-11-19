# 📦 Ejercicio Práctico: Gestión de Productos con React y Firebase

## 🎓 Sobre este Taller
Este repositorio es una guía práctica enfocada en el desarrollo de una aplicación web para administrar un inventario de productos. En este ejercicio, los estudiantes del **Instituto Movilis** practicarán la creación de interfaces con React y TypeScript, así como la integración de una base de datos en la nube con **Firebase Firestore**.

La aplicación permite agregar, editar y eliminar productos, visualizar los cambios en tiempo real, filtrar por rangos de stock y precio, y recorrer los resultados mediante paginación.

> **Nota del Instructor:** En este taller conectaremos una interfaz construida con React y TypeScript a Firestore para gestionar productos en tiempo real. Practicaremos operaciones CRUD, consultas con filtros por rangos, índices compuestos y paginación con cursores, integrando cada concepto en una aplicación funcional.

---

## 🛠️ Stack Tecnológico
![React](https://img.shields.io/badge/React-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firestore](https://img.shields.io/badge/Cloud_Firestore-FF6F00?style=for-the-badge&logo=firebase&logoColor=white)

---

## 🎯 Objetivos de Aprendizaje
A través de este proyecto, el estudiante practicará competencias clave del desarrollo frontend y la integración con servicios en la nube:
- [x] **React y TypeScript:** Construcción de componentes, manejo de estado y formularios tipados.
- [x] **Operaciones CRUD:** Creación, consulta, actualización y eliminación de productos en Firestore.
- [x] **Actualizaciones en tiempo real:** Suscripción a los cambios de la colección mediante `onSnapshot`.
- [x] **Consultas y filtros:** Uso de `query`, `where` y `orderBy` para filtrar productos por rangos de stock y precio.
- [x] **Paginación:** Navegación por páginas de resultados con `limit` y cursores de Firestore.
- [x] **Índices compuestos:** Configuración y despliegue del índice de Firestore requerido para combinar los filtros.

## ⚙️ Integración Continua y Calidad
El proyecto incluye comandos locales para verificar la aplicación:
* **Compilación y tipos:** `npm run build` ejecuta TypeScript y genera la versión de producción con Vite.
* **Lint:** `npm run lint` analiza el código con ESLint.

No hay actualmente un flujo de integración continua configurado en GitHub Actions. Estos comandos pueden ejecutarse localmente antes de compartir cambios.

---

## 🚀 Inicio Rápido
Requisitos: Node.js y npm instalados, además de acceso al proyecto de Firebase configurado para la aplicación.

```bash
npm install
```

Antes de iniciar la aplicación, crea el archivo local de variables de entorno:

```powershell
Copy-Item .env.example .env.local
```

Completa en `.env.local` los valores `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID` y `VITE_FIREBASE_APP_ID` con la configuración de tu aplicación Firebase. `.env.local` está excluido de Git. Luego inicia la aplicación:

```bash
npm run dev
```

Para validar los cambios y generar la compilación de producción:

```bash
npm run lint
npm run build
```

### Índices de Firestore
La consulta que combina los rangos de stock y precio requiere un índice compuesto. La configuración se encuentra en `firebase.json` y `firestore.indexes.json`. Instala Firebase CLI, inicia sesión y despliega el índice al proyecto:

```bash
npm install --global firebase-tools
firebase login
firebase deploy --only firestore:indexes --project curso-firebase-krakedev
```

Firestore puede tardar un momento en construir el índice después del despliegue.

> **Seguridad:** Las variables `VITE_FIREBASE_*` se incorporan al código enviado al navegador; no son secretos. Configura restricciones de API key y reglas seguras de Firestore en Firebase. No incluyas claves privadas de cuentas de servicio en la aplicación.

---

## 📂 Estructura del Repositorio
El código de la aplicación está organizado por componentes y servicios:

```text
📁 src
├── 📁 components
│   ├── 📄 ProductoForm.tsx       <-- Formulario para crear y editar productos
│   └── 📄 ProductoLista.tsx      <-- Tabla, filtros y paginación
├── 📁 services
│   └── 📄 productoService.ts     <-- Operaciones y consultas de Firestore
├── 📄 App.tsx                    <-- Composición principal de la aplicación
└── 📄 firebase.ts                <-- Inicialización de Firebase y Firestore
📄 firebase.json                  <-- Configuración de Firebase CLI
📄 firestore.indexes.json         <-- Índices compuestos de Firestore
📄 package.json                   <-- Dependencias y comandos del proyecto
```

## 👨‍🏫 Instructor
Soy **Luis Felipe Zumárraga**, docente técnico enfocado en desarrollo de software. Mi meta es que mis estudiantes no solo aprendan a programar, sino a pensar como verdaderos arquitectos, con la capacidad de diseñar soluciones robustas, eficientes y de alta calidad.

## 🤝 Contacto y Mentoría
Si eres estudiante de mi clase y tienes dudas, puedes contactarme por estos medios:

<p align="left">
<a href="https://linkedin.com/in/felipezc97" target="blank"><img align="center" src="https://img.icons8.com/?size=100&id=13930&format=png&color=000000" alt="felipe-linkedin" height="35" width="35" /></a>
<a href="mailto:felipezumarraga@hotmail.com" target="blank"><img align="center" src="https://img.icons8.com/?size=100&id=13640&format=png&color=000000" alt="felipe-email" height="35" width="35" /></a>
<a href="https://api.whatsapp.com/send?phone=593993276962" target="blank"><img align="center" src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" alt="felipe-whatsapp" height="35" width="35" /></a>
</p>
