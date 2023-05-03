Creé la clase ProductManager que se inicializa sin necesidad de ningún valor y asignando a la lista de productos "products" el valor de un arreglo vacío.

El método getProducts simplemente retorna la lista de productos.

El método addProduct toma un 5 campos (título, descripción, precio, miniatura y existencias) y, si no existe ningún objeto que contenga ya esos mismos campos, lo agrega a la lista de productos. Si algún campo es distinto en lo más mínimo, puede agregar el artículo a pesar de que el resto sean idénticos. Si el elemento ya existía, no retorna nada y en cambio imprime en consola un mensaje de error.
Al agregar un artículo, se le asigna un código identificador o "id" que simplemente es su posición en el arreglo. De esta forma no se repiten nunca los códigos.

El método getProductById toma un valor cualquiera, busca en la lista de artículos si hay alguno con ese código identificador y, de haberlo, lo devuelve. En caso de que no esté en ela lista, imprime en consola un mensaje de error.

Dejé unos ejemplos ilustrativos que sirven para ver la consigna funcionando.