SELECT * FROM `numero 1.csv` nc

/* normalizacion numero 1.csv */
-- n1_students
CREATE TABLE n1_students (
	id_student INT PRIMARY KEY,
	name VARCHAR(100),
	email VARCHAR(100)
);

INSERT INTO n1_students (id_student, name, email)
SELECT DISTINCT Estudiante_ID, Nombre_Estudiante, Correo_Estudiante FROM `numero 1.csv`;

-- n1_courses
CREATE TABLE n1_courses (
	id_course INT PRIMARY KEY,
	name VARCHAR(100)
);

INSERT INTO n1_courses (id_course, name)
SELECT DISTINCT Curso_ID, Nombre_Curso FROM `numero 1.csv` nc;

-- n1_professors
CREATE TABLE n1_professors (
	id_professor INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100)
);

INSERT INTO n1_professors (name)
SELECT DISTINCT Profesor_Curso FROM `numero 1.csv` nc;


-- tabla students_courses
CREATE TABLE n1_enrollments ( 
	id_student INT,
	id_course INT,
	PRIMARY KEY (id_student, id_course),
	FOREIGN KEY (id_student) REFERENCES n1_students(id_student),
	FOREIGN KEY (id_course) REFERENCES n1_courses(id_course)
);

INSERT INTO n1_enrollments (id_student, id_course)
SELECT DISTINCT Estudiante_ID, Curso_ID FROM `numero 1.csv` nc;

-- Cometi un error al dejar al profesor por fuera del curso
-- agrego el hueco, la nueva columna

ALTER TABLE n1_courses 
ADD COLUMN id_professor INT;

-- vamos a insertar los datos, porque se crearon como nulls

UPDATE n1_courses c
JOIN `numero 1.csv` n ON c.id_course = n.Curso_ID
JOIN n1_professors p ON n.Profesor_Curso = p.name
SET c.id_professor = p.id_professor;
-- opcion 2, una subconsulta
UPDATE n1_courses c
SET id_professor = (
    SELECT p.id_professor 
    FROM n1_professors p
    JOIN `numero 1.csv` n ON p.name = n.Profesor_Curso
    WHERE n.Curso_ID = c.id_course
    LIMIT 1
);
-- metiendo la clave fonanea- Hay que asegurarse de que las columnas tengan los mismo tipos de datos
ALTER TABLE n1_professors 
MODIFY COLUMN id_professor INT;

ALTER TABLE n1_courses
ADD CONSTRAINT fk_id_professor
FOREIGN KEY (id_professor) REFERENCES n1_professors(id_professor);


-- recreando la tabla completa nuevamente con claves
CREATE VIEW numeros_1_n AS
SELECT
	ns.id_student AS Students,
	nc.id_course AS Courses, 
	np.id_professor AS Professors
FROM n1_students ns
JOIN n1_enrollments ne ON ne.id_student = ns.id_student
JOIN n1_courses nc ON ne.id_course = nc.id_course
JOIN n1_professors np ON nc.id_professor = np.id_professor;
-- recreando la tabla con los valores originales
CREATE VIEW numeros_1_complete AS
SELECT
	ns.id_student AS Estudiante_ID,
	ns.name AS Nombre_Estudiante,
	ns.email AS Correo_Estudiante,
	nc.id_course AS Curso_ID,
	nc.name AS Nombre_Curso,
	np.name AS Profesor_Curso
FROM n1_students ns
JOIN n1_enrollments ne ON ne.id_student = ns.id_student
JOIN n1_courses nc ON ne.id_course = nc.id_course
JOIN n1_professors np ON nc.id_professor = np.id_professor;
-- actualizando la vista numeros_1_complete
CREATE OR REPLACE VIEW numeros_1_complete AS
SELECT
	ns.id_student AS Estudiante_ID,
	ns.name AS Nombre_Estudiante,
	ns.email AS Correo_Estudiante,
	nc.id_course AS Curso_ID,
	nc.name AS Nombre_Curso,
	np.name AS Profesor_Curso
FROM n1_students ns
JOIN n1_enrollments ne ON ne.id_student = ns.id_student
JOIN n1_courses nc ON ne.id_course = nc.id_course
JOIN n1_professors np ON nc.id_professor = np.id_professor
ORDER BY Estudiante_ID;
-- usando un vistaa
SELECT * FROM numeros_1_complete;
SELECT * FROM numeros_1_n;
-- viendo la vista, (se puede desde la pestaña Views o por comando)
SHOW CREATE VIEW numeros_1_n;

-- Schemas en mysql es sinonimo de databse, esto es util en POSTGRES
-- mandando las tablas al SCHEMA, solo postgres
-- ALTER TABLE n1_students SET SCHEMA normalizacion_tabla_1;
-- ALTER TABLE n1_courses SET SCHEMA normalizacion_tabla_1;
-- ALTER TABLE n1_professors SET SCHEMA normalizacion_tabla_1;
-- ALTER TABLE n1_enrollments SET SCHEMA normalizacion_tabla_1;



