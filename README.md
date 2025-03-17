# Gestor de Productos Angular

## Descripción
Sistema de gestión de productos desarrollado con Angular y Tailwind CSS que permite administrar un catálogo de productos de manera eficiente y organizada. La aplicación implementa una arquitectura modular y sigue las mejores prácticas de desarrollo.

## Características Principales
- CRUD de productos
- Filtrado por estado
- Ordenamiento por Nombre | Descripción | Fecha | Estado
- Almacenamiento local en IndexedDB
- Validación de formulario
- Estado de productos (Inicial, Pendiente, Completado)

## Tecnologías Utilizadas
- Angular 19.2.3
- Tailwind CSS
- IndexedDB para almacenamiento de datos.

## Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm (versión 9 o superior)
- Angular CLI

# Gestor de Productos Angular

## Descripción
Sistema de gestión de productos desarrollado con Angular y Tailwind CSS que permite administrar un catálogo de productos de manera eficiente y organizada. La aplicación implementa una arquitectura modular y sigue las mejores prácticas de desarrollo.

## Características Principales
- CRUD de productos
- Filtrado por estado
- Ordenamiento por Nombre | Descripción | Fecha | Estado
- Almacenamiento local en IndexedDB
- Validación de formulario
- Estado de productos (Inicial, Pendiente, Completado)

## Tecnologías Utilizadas
- Angular 19.2.3
- Tailwind CSS
- IndexedDB para almacenamiento de datos.

## Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm (versión 9 o superior)
- Angular CLI

### Pasos de Instalación
```bash
# Clonar el repositorio
git clone https://github.com/BernardoCarvajal/angular-productos-manager-.git

# Navegar al directorio del proyecto
cd angular-productos-manager

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

##  Arquitectura del Proyecto

src/
├── app/
│ ├── core/ # Servicios y utilidades
│ ├── features/ # Módulos de características
│ │ └── products/ # Módulo de productos
│ │ └── dashboard/ # Módulo de reportabilidad
│ ├── shared/ # Componentes y pipes
│ │ └──Componentes/ # Badge, botón y Header
│ │ └──Pipes/ # Formato de fecha.
│ └── app.module.ts # Módulo principal


## Decisiones Técnicas

### Arquitectura Modular
- Desarrollé una arquitectura modular para una mejor mantenibilidad a largo plazo. De esta manera por ejemplo podemos cambiar la base de datos de manera rápida desde IndexedDB a otra más robusta y poder reutilizar el código.
- Decidí dejar componentes que fueran reutilizables de manera aparte en "Shared" para poder mantener un estándar de estilos y formatos.
- Decidí almacenar los servicios en un lugar separados para reutiliziar el código.
- Decidí dejar los Features en su lugar separado para poder trabajar con ellos de manera separada. Esto permite a futuro armar nuevos features (En este caso son solo productos), que funcionen de manera independiente.

### Gestión de Estado
- Se usaron observables para tener constantemente actualizaciones de estado.
- En Base de Datos se guardaron los estados con números para tener un mejor control de ellos.
    - A futuro sería importante hacer nuevas tablas que se relacionen con la actual y que describan estos estados. Esto dota de mayor escalabilidad que usar datos "en bruto"

### Almacenamiento
- Se usó IndexedDB para persistencia de Datos.
- Usar esta Base de datos permitirá a futuro poder cambiarla por una relacional o no relacional de manera más rápida ya que solo habría que modificar el servicio.

### UX/UI
- Diseño con Tailwind CSS.
- Feedback visual inmediato en acciones del usuario.
- Validaciones en tiempo real.
- Mensajes de error descriptivos.

## Funcionalidades Principales

### Gestión de Productos
- Creación de productos con validación de campos
- Edición de productos existentes
- Eliminación con confirmación
- Visualización en lista con ordenamiento

### Filtrado y Ordenamiento
- Múltiples filtros en aplicación.
- Ordenamiento por todos los campos de la tabla.

## Futuras Mejoras
- Implementación de PWA
- Cambio a BBDD robusta
- Exportación a CSV/Excel
- Gráficos estadísticos
- Drag & Drop para reordenamiento
- Modo oscuro
- Mantenedores para personalización de formulario

## Autor
[Bernardo Carvajal]
- GitHub: [@BernardoCarvajal](https://github.com/BernardoCarvajal)
- LinkedIn: https://www.linkedin.com/in/bernardo-carvajal-rivera/
