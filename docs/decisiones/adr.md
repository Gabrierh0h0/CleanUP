# Decisiones Arquitectónicas — EIAR Monolito

## ADR-001: Arquitectura Monolítica en Capas

**Estado:** Adoptado  
**Contexto:** Entrega académica para demostrar comprensión de arquitectura monolítica con separación de responsabilidades.

**Decisión:** Organizar el proyecto en 4 capas: Presentación → Aplicación → Dominio → Infraestructura.

**Consecuencias:**
- El dominio no depende de Firebase; puede testearse de forma unitaria pura.
- Los repositorios son abstracciones; si se cambia Firebase por otra BD, solo cambia la capa de infraestructura.

---

## ADR-002: Inyección de dependencias con tokens simbólicos

**Estado:** Adoptado  
**Contexto:** Principio D de SOLID — depender de abstracciones, no de implementaciones concretas.

**Decisión:** Los servicios de aplicación reciben repositorios vía tokens (`USER_REPOSITORY`, `MISION_REPOSITORY`, `LOGRO_REPOSITORY`) en lugar de clases concretas de Firebase.

**Consecuencias:**
- La capa de aplicación no importa ningún archivo de Firebase directamente.
- En tests se pueden inyectar mocks sin tocar Firebase.

---

## ADR-003: Reglas de negocio en capa de dominio

**Estado:** Adoptado  
**Contexto:** La lógica de desbloqueo de logros es una regla de negocio, no un detalle de infraestructura.

**Decisión:** Crear `LogrosRules` como clase estática en la capa de dominio.

**Consecuencias:**
- Testeable sin ninguna dependencia externa.
- Reutilizable desde cualquier servicio de aplicación.
