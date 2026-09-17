BD Oracle:

Ejecutar la instalación limpia de Oracle 21c XE:Instalador oficial.Descomprime el archivo original OracleXE212_Win64.zip en una ruta simple y sin espacios (por ejemplo C:\Temp\OracleXE).Haz clic derecho sobre setup.exe y selecciona Ejecutar como administrador.Acepta los términos de licencia y deja la ruta por defecto (C:\app\product\21c\...).Paso crítico - Contraseña: Te solicitará una contraseña maestra para las cuentas administrativas (SYS, SYSTEM y PDBADMIN). Ingresa una contraseña estándar que recuerdes bien (por ejemplo: Oracle2026#) y anótala.Revisa la pantalla de resumen. Notarás los puertos clave:Listener: 1521HTTP EM Express: 5500Nombre de la Pluggable Database (PDB): XEPDB1Haz clic en Instalar y espera a que concluya el proceso.Verificación: Al terminar, abre cmd y ejecuta: sqlplus sys/Oracle2026#@localhost:1521/XEPDB1 as sysdba

Debe conectar de inmediato y mostrar el prompt SQL>.3.Crear el Tablespace y Usuario DEV desde SQL*Plus o SQL Developer:Aislamiento inicial.Desde el mismo cmd conectado a XEPDB1 (o desde SQL Developer conectado a XEPDB1 como SYS), ejecuta el bloque de aprovisionamiento para aislar tu desarrollo:

-- 1. Crear el almacenamiento exclusivo del proyecto
CREATE TABLESPACE TS_SEA_DATA
  DATAFILE 'ts_sea_data01.dbf' SIZE 100M
  AUTOEXTEND ON NEXT 50M MAXSIZE UNLIMITED;

-- 2. Crear el usuario dueño del esquema (sin privilegios excesivos de DBA)
CREATE USER SEA_APP IDENTIFIED BY "Desarrollo2026#"
  DEFAULT TABLESPACE TS_SEA_DATA
  TEMPORARY TABLESPACE TEMP
  QUOTA UNLIMITED ON TS_SEA_DATA
  ACCOUNT UNLOCK;

-- 3. Privilegios de desarrollo
GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW, 
      CREATE SEQUENCE, CREATE PROCEDURE, CREATE TRIGGER, 
      CREATE SYNONYM TO SEA_APP;

EXIT;

Verificación: Prueba la conexión directa del nuevo usuario en la consola:

sqlplus SEA_APP/Desarrollo2026#@localhost:1521/XEPDB1

Debe iniciar sesión mostrando Connected to: Oracle Database 21c Express Edition.4.Configurar la conexión en Oracle SQL Developer:Entorno de trabajo.Abre SQL Developer.Crea una Nueva Conexión (+):Nombre de conexión: SEA_LOCALUsuario: SEA_APPContraseña: Desarrollo2026#Rol: defaultHost: localhostPuerto: 1521Tipo: Selecciona Nombre de servicio (Service Name) y escribe: XEPDB1 (No uses SID: xe).Presiona Probar. Al ver Estado: Correcto, haz clic en Guardar y Conectar.Verificación: Abre el árbol de tablas bajo SEA_LOCAL; estará 100% limpio y vacío, sin ninguna tabla del diccionario AQ$_.
--------------------------------------------------------------------------------------------------
Configuración de la nueva conexión en Oracle SQL Developer:

Name: SEAD_DEV

Usuario: SEAD

Contraseña: Desarrollo2026#

Rol: default (o valor por defecto)

Tipo de Conexión: Básico

Nombre del Host: localhost

Puerto: 1521

Nombre del Servicio: XEPDB1 (marca el radio button "Nombre del Servicio", no uses SID)
--------------------------------------------------------------------------------------------------
BD Contenedor multiinquilino: localhost:1521
BD de Conexión: localhost:1521/XEPDB1
URL  EM Express: https://localhost:5500/em
Contraseña sys: Crecer2026

--------------------------------------------------------------------------------------------------
Crear el usuario SEAD:

ALTER SESSION SET CONTAINER = XEPDB1;

  CREATE TABLESPACE TS_SEAD_DATA
  DATAFILE 'ts_sead_data01.dbf' SIZE 100M
  AUTOEXTEND ON NEXT 50M MAXSIZE UNLIMITED
  EXTENT MANAGEMENT LOCAL
  SEGMENT SPACE MANAGEMENT AUTO;
  
  CREATE USER SEAD IDENTIFIED BY "Desarrollo.96"
  DEFAULT TABLESPACE TS_SEAD_DATA
  TEMPORARY TABLESPACE TEMP
  QUOTA UNLIMITED ON TS_SEAD_DATA
  ACCOUNT UNLOCK;
  
GRANT CREATE SESSION TO SEAD;
GRANT CREATE TABLE TO SEAD;
GRANT CREATE VIEW TO SEAD;
GRANT CREATE SEQUENCE TO SEAD;
GRANT CREATE PROCEDURE TO SEAD;
GRANT CREATE TRIGGER TO SEAD;
GRANT CREATE SYNONYM TO SEAD;

--------------------------------------------------------------------------------------------------

Crear las tablas en Oracle: ?

Poblar las tablas: ?.sql

---------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------
Backend:

Instalar JDK 17

Instalar maven: choco install maven

Iniciar proyecto: mvn spring-boot:run

---------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------

Frontend SEA:

npm install (npm install --legacy-peer-deps)

npm start

---------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------

Frontend SEA Proveedores:

npm install

npm start



