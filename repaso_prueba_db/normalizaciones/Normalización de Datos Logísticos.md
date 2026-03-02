¡Entendido\! Vamos a desglosar todo el ejercicio aquí mismo para que lo tengas a mano. Este es un caso de **Logística de Marketplace** (donde varios vendedores envían productos a través de un solo sistema).

### ---

**1\. Lógica de Negocio**

El sistema registra **Pedidos**. Cada pedido es realizado por un **Cliente** y puede contener varios **Productos**. Cada producto pertenece a un **Vendedor** diferente. Además, cada pedido tiene un **Courier** (transportadora) y un número de seguimiento.

### ---

**2\. Dataset "Sucio" (CSV de 30 registros)**

Aquí está la tabla plana inicial. Nota la redundancia: si un cliente compra 3 cosas, sus datos se repiten 3 veces. Si un producto se vende 10 veces, su precio y vendedor se repiten 10 veces.

Fragmento de código

ID\_Ped,Fecha,ID\_Cli,Nom\_Cli,Email\_Cli,Ciudad,ID\_Prod,Nom\_Prod,P\_Unit,ID\_Vend,Nom\_Vend,Cant,Courier,Tracking  
1001,2024-03-01,C01,Juan Perez,juan@mail.com,Bogota,P01,Monitor 24,200,V01,TechStore,1,Servientrega,TRK111  
1001,2024-03-01,C01,Juan Perez,juan@mail.com,Bogota,P02,Mouse Pro,50,V02,AccesoriosXYZ,2,Servientrega,TRK111  
1002,2024-03-01,C02,Ana Gomez,ana@mail.com,Medellin,P03,Teclado Mec,120,V01,TechStore,1,DHL,TRK222  
1003,2024-03-02,C01,Juan Perez,juan@mail.com,Bogota,P04,Laptop Nitro,1200,V03,MegaPC,1,FedEx,TRK333  
1004,2024-03-02,C03,Carlos Ruiz,cruiz@mail.com,Cali,P01,Monitor 24,200,V01,TechStore,2,Servientrega,TRK444  
1005,2024-03-02,C04,Maria Luz,mluz@mail.com,Barranquilla,P05,Headset G,80,V02,AccesoriosXYZ,1,DHL,TRK555  
1006,2024-03-03,C02,Ana Gomez,ana@mail.com,Medellin,P02,Mouse Pro,50,V02,AccesoriosXYZ,1,DHL,TRK666  
1007,2024-03-03,C05,Luis Serna,lserna@mail.com,Pereira,P06,Webcam HD,90,V03,MegaPC,1,FedEx,TRK777  
1008,2024-03-03,C01,Juan Perez,juan@mail.com,Bogota,P03,Teclado Mec,120,V01,TechStore,1,Servientrega,TRK888  
1009,2024-03-04,C06,Rosa Diaz,rdiaz@mail.com,Envigado,P01,Monitor 24,200,V01,TechStore,1,DHL,TRK999  
1010,2024-03-04,C03,Carlos Ruiz,cruiz@mail.com,Cali,P07,Silla Gamer,300,V04,MueblesGaming,1,FedEx,TRK010  
1011,2024-03-04,C07,Diego Mas,dmas@mail.com,Bucaramanga,P02,Mouse Pro,50,V02,AccesoriosXYZ,1,Servientrega,TRK011  
1012,2024-03-05,C08,Elena Gil,egil@mail.com,Manizales,P08,Pad XL,30,V02,AccesoriosXYZ,1,DHL,TRK012  
1013,2024-03-05,C01,Juan Perez,juan@mail.com,Bogota,P01,Monitor 24,200,V01,TechStore,1,FedEx,TRK013  
1014,2024-03-05,C09,Fabio Sol,fsol@mail.com,Cali,P09,Microfono,150,V03,MegaPC,1,Servientrega,TRK014  
1015,2024-03-06,C10,Gina Paz,gpaz@mail.com,Bogota,P10,Disco SSD,100,V01,TechStore,2,DHL,TRK015  
1016,2024-03-06,C02,Ana Gomez,ana@mail.com,Medellin,P01,Monitor 24,200,V01,TechStore,1,FedEx,TRK016  
1017,2024-03-06,C03,Carlos Ruiz,cruiz@mail.com,Cali,P05,Headset G,80,V02,AccesoriosXYZ,1,Servientrega,TRK017  
1018,2024-03-07,C11,Hugo Rey,hrey@mail.com,Cartagena,P03,Teclado Mec,120,V01,TechStore,1,DHL,TRK018  
1019,2024-03-07,C04,Maria Luz,mluz@mail.com,Barranquilla,P02,Mouse Pro,50,V02,AccesoriosXYZ,1,FedEx,TRK019  
1020,2024-03-07,C12,Iris Loa,iloa@mail.com,Pasto,P04,Laptop Nitro,1200,V03,MegaPC,1,Servientrega,TRK020  
1021,2024-03-08,C05,Luis Serna,lserna@mail.com,Pereira,P01,Monitor 24,200,V01,TechStore,1,DHL,TRK021  
1022,2024-03-08,C01,Juan Perez,juan@mail.com,Bogota,P06,Webcam HD,90,V03,MegaPC,1,FedEx,TRK022  
1023,2024-03-08,C06,Rosa Diaz,rdiaz@mail.com,Envigado,P03,Teclado Mec,120,V01,TechStore,1,Servientrega,TRK023  
1024,2024-03-09,C13,Kevin Uy,kuy@mail.com,Armenia,P05,Headset G,80,V02,AccesoriosXYZ,1,DHL,TRK024  
1025,2024-03-09,C03,Carlos Ruiz,cruiz@mail.com,Cali,P02,Mouse Pro,50,V02,AccesoriosXYZ,1,FedEx,TRK025  
1026,2024-03-09,C02,Ana Gomez,ana@mail.com,Medellin,P10,Disco SSD,100,V01,TechStore,1,Servientrega,TRK026  
1027,2024-03-10,C14,Lola Mer,lmer@mail.com,Popayan,P01,Monitor 24,200,V01,TechStore,1,DHL,TRK027  
1028,2024-03-10,C01,Juan Perez,juan@mail.com,Bogota,P07,Silla Gamer,300,V04,MueblesGaming,1,FedEx,TRK028  
1029,2024-03-10,C08,Elena Gil,egil@mail.com,Manizales,P03,Teclado Mec,120,V01,TechStore,1,Servientrega,TRK029  
1030,2024-03-11,C15,Noe Oro,noro@mail.com,Sincelejo,P02,Mouse Pro,50,V02,AccesoriosXYZ,1,DHL,TRK030

### ---

**3\. El Proceso de Normalización**

#### **1FN: Atomicidad y Clave Primaria**

* **Acción:** Nos aseguramos de que no haya listas en las celdas.  
* **PK:** La clave primaria es compuesta: (ID\_Ped, ID\_Prod). Con esto identificamos cada fila de forma única.

#### **2FN: Dependencias Parciales**

* **Problema:** Nom\_Prod, P\_Unit, ID\_Vend y Nom\_Vend dependen únicamente del ID\_Prod, no de todo el ID\_Ped.  
* **Solución:** Extraemos los productos a una tabla aparte.  
* **Problema:** Fecha, ID\_Cli, Nom\_Cli, Email\_Cli, Ciudad, Courier y Tracking dependen del ID\_Ped, no del producto.  
* **Solución:** Extraemos los datos del pedido a otra tabla.

#### **3FN: Dependencias Transitivas**

* **Problema:** En la tabla de **Pedidos**, el nombre del cliente y su email dependen de ID\_Cli, no directamente de la PK ID\_Ped.  
* **Problema:** En la tabla de **Productos**, el nombre del vendedor depende de ID\_Vend, no de ID\_Prod.  
* **Solución:** Creamos las tablas maestras de **Clientes** y **Vendedores**.

### ---

**4\. Modelo Relacional Final (DER)**

Aquí tienes la estructura gráfica de las tablas y cómo se conectan:

Plaintext

  \[ CLIENTES \]             \[ VENDEDORES \]  
  \- ID\_Cli (PK)            \- ID\_Vend (PK)  
  \- Nom\_Cli                \- Nom\_Vend  
  \- Email\_Cli                   |  
       |                        |  
       | (1)                    | (1)  
       |                        |  
       | (N)                    | (N)  
  \[  PEDIDOS  \]            \[ PRODUCTOS \]  
  \- ID\_Ped (PK)            \- ID\_Prod (PK)  
  \- Fecha                  \- Nom\_Prod  
  \- Ciudad                 \- P\_Unit  
  \- Courier                \- ID\_Vend (FK)  
  \- Tracking                    |  
  \- ID\_Cli (FK)                 |  
       |                        |  
       | (1)                    | (1)  
       |          (N)           |  
       \+----\[ DETALLE\_PEDIDO \]--+  
            \- ID\_Ped (FK)  
            \- ID\_Prod (FK)  
            \- Cantidad

### **Resumen de tablas finales:**

1. **Clientes**: Evita repetir nombres y correos.  
2. **Vendedores**: El nombre de la tienda está en un solo lugar.  
3. **Productos**: Contiene el precio maestro y quién lo vende.  
4. **Pedidos**: Datos de cabecera (cuándo, a dónde y quién compró).  
5. **Detalle\_Pedido**: La tabla de "rompimiento" que dice exactamente qué productos y cuántos hay en cada pedido.

¿Qué te parece esta estructura? ¿Te gustaría ver cómo quedarían los datos de los primeros 5 registros repartidos en estas 5 tablas nuevas?