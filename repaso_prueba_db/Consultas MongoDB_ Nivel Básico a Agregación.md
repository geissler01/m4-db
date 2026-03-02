¡Claro que sí\! Tienes una estructura de datos muy completa. Basándome en los campos que me compartiste, aquí tienes las consultas de MongoDB listas para copiar y ejecutar.

## ---

**Nivel 1 – Consultas Básicas**

1. **Listar todos los documentos:**  
   db.users.find({})  
2. **Mostrar únicamente campos específicos:**  
   db.users.find({}, { first\_name: 1, last\_name: 1, email: 1, \_id: 0 })  
3. **Usuarios con rol "admin":**  
   db.users.find({ role: "admin" })  
4. **Usuarios en "Colombia":**  
   db.users.find({ country: "Colombia" })  
5. **Usuarios activos (is\_active \= 1):**  
   *Nota: En tu ejemplo, el valor es numérico (1/0) en lugar de booleano.*  
   db.users.find({ is\_active: 1 })  
6. **Usuarios no verificados:**  
   db.users.find({ is\_verified: 0 })  
7. **Usuarios de género "Masculino":**  
   db.users.find({ gender: "Masculino" })  
8. **Usuarios en "Medellín":**  
   db.users.find({ city: "Medellín" })  
9. **Usuarios con al menos un hijo:**  
   db.users.find({ children\_count: { $gt: 0 } })  
10. **Profesión no es null:**  
    db.users.find({ profession: { $ne: null } })

## ---

**Nivel 2 – Filtros con Operadores**

1. **Ingreso mayor a 3,000,000:**  
   db.users.find({ monthly\_income: { $gt: 3000000 } })  
2. **Ingresos entre 2,000,000 y 5,000,000:**  
   db.users.find({ monthly\_income: { $gte: 2000000, $lte: 5000000 } })  
3. **Nacidos después del 2000-01-01:**  
   db.users.find({ birth\_date: { $gt: ISODate("2000-01-01T00:00:00Z") } })  
4. **Tipo de documento "CC" o "CE":**  
   db.users.find({ document\_type: { $in: \["CC", "CE"\] } })  
5. **Ciudad no sea "Bogotá":**  
   db.users.find({ city: { $ne: "Bogotá" } })  
6. **Nombre empiece por "A":**  
   db.users.find({ first\_name: { $regex: /^A/i } })  
7. **Email termine en "gmail.com":**  
   db.users.find({ email: { $regex: /gmail\\.com$/i } })  
8. **Más de 2 hijos y activos:**  
   db.users.find({ children\_count: { $gt: 2 }, is\_active: 1 })  
9. **Casado y con hijos:**  
   db.users.find({ marital\_status: "Casado", children\_count: { $gt: 0 } })  
10. **Inactivos o no verificados:**  
    db.users.find({ $or: \[{ is\_active: 0 }, { is\_verified: 0 }\] })

## ---

**Nivel 3 – Ordenamiento y Paginación**

1. **Orden por ingreso (Mayor a Menor):**  
   db.users.find().sort({ monthly\_income: \-1 })  
2. **5 usuarios más recientes:**  
   db.users.find().sort({ created\_at: \-1 }).limit(5)  
3. **Paginación (Página 2, 10 por página):**  
   db.users.find().skip(10).limit(10)  
4. **Nombre completo y ciudad (Agregación):**  
   JavaScript  
   db.users.aggregate(\[  
     { $project: {   
         full\_name: { $concat: \["$first\_name", " ", "$last\_name"\] },   
         city: 1   
     }}  
   \])

5. **Orden por nacimiento (Más joven a mayor):**  
   db.users.find().sort({ birth\_date: \-1 })

## ---

**Nivel 4 – Aggregation Framework**

1. **Ingreso promedio total:**  
   JavaScript  
   db.users.aggregate(\[  
     { $group: { \_id: null, avg\_income: { $avg: "$monthly\_income" } } }  
   \])

2. **Ingreso promedio por ciudad:**  
   JavaScript  
   db.users.aggregate(\[  
     { $group: { \_id: "$city", avg\_income: { $avg: "$monthly\_income" } } }  
   \])

3. **Usuarios por rol:**  
   JavaScript  
   db.users.aggregate(\[  
     { $group: { \_id: "$role", total: { $sum: 1 } } }  
   \])

4. **Usuarios activos vs inactivos:**  
   JavaScript  
   db.users.aggregate(\[  
     { $group: { \_id: "$is\_active", total: { $sum: 1 } } }  
   \])

5. **Total de hijos por estado:**  
   JavaScript  
   db.users.aggregate(\[  
     { $group: { \_id: "$state", total\_children: { $sum: "$children\_count" } } }  
   \])

¿Te gustaría que te explique cómo crear un índice para que estas consultas, especialmente las de nivel 2 y 3, corran más rápido?