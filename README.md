# Proyecto de Grupos y Chat en Tiempo Real

Este proyecto es una aplicación web que permite a los usuarios crear grupos, invitar amigos e interactuar a través de un sistema de chat dinámico. Originalmente desarrollado en un entorno privado, el sistema ha evolucionado para ofrecer una experiencia de comunicación robusta y escalable.

La funcionalidad principal radica en la mensajería en tiempo real, facilitada mediante WebSockets, permitiendo una interacción fluida y constante entre los miembros de un grupo.

## Características Principales

*   **Gestión de Grupos:** Los usuarios pueden crear y administrar sus propios grupos.
*   **Sistema de Invitaciones:** Capacidad para invitar a otros usuarios a unirse a grupos específicos.
*   **Mensajería en Tiempo Real:** Chat instantáneo integrado con persistencia de mensajes.
*   **Seguridad y Autenticación:** Implementación de tokens JWT para garantizar un acceso seguro y una autorización adecuada.
*   **Gestión de Imágenes:** Integración con Cloudinary para la carga y almacenamiento de imágenes de grupos.

## Arquitectura y Refactorización

Recientemente, el proyecto ha pasado por un proceso integral de refactorización para mejorar su mantenibilidad, escalabilidad y legibilidad. Los cambios clave incluyen:

*   **Capa de Servicios (Service Layer):** Se ha migrado la lógica de negocio desde los controladores hacia servicios dedicados. Esto permite una separación clara de responsabilidades, donde los controladores solo manejan las solicitudes HTTP y las respuestas.
*   **Patrón Singleton:** Los servicios se han implementado siguiendo el patrón Singleton, asegurando que exista una única instancia global de cada servicio, facilitando la gestión de dependencias y el estado interno.
*   **Manejo Centralizado de Errores:** Se han introducido clases de error HTTP personalizadas (Unauthorized, EntityNotFound, InternalServer, etc.) para proporcionar respuestas de error consistentes y descriptivas a través de un middleware de manejo de excepciones.
*   **Lógica Basada en Eventos:** Implementación de un sistema de suscriptores para manejar efectos secundarios complejos (como la reasignación automática de roles de administrador cuando un propietario abandona un grupo) de forma desacoplada.
*   **Modularidad de Sockets:** La lógica de comunicación en tiempo real se ha desacoplado de la infraestructura principal, concentrándola en módulos especializados que interactúan directamente con la capa de servicios.

## Tecnologías Utilizadas

*   **Backend:** Node.js con Express.
*   **Comunicación:** Socket.IO para el manejo de WebSockets.
*   **Base de Datos:** PostgreSQL para la persistencia de datos relacionales.
*   **Autenticación:** JWT (JSON Web Tokens).
*   **Almacenamiento:** Cloudinary API para la gestión de archivos multimedia.
*   **Seguridad:** Bcrypt para el hashing de contraseñas.
*   **Calidad de Código:** ESLint para mantener estándares de codificación y prevenir errores.

## Integración Continua y Despliegue (CI/CD)

El proyecto cuenta con un flujo de trabajo automatizado mediante **GitHub Actions** para garantizar la calidad y estabilidad del código:

*   **Verificación Automática:** En cada *push* o *pull request* a la rama `main`, se ejecutan automáticamente las tareas de linting (ESLint) para asegurar que el código cumpla con los estándares definidos.
*   **Despliegue Continuo:** Una vez que las pruebas y verificaciones son exitosas, los cambios en la rama `main` se despliegan automáticamente en **Render** mediante un webhook de despliegue.
