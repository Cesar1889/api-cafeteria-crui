const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let productos = [
  { id: 1, nombre: 'Café con leche', precio: 1800, categoria: 'bebida' },
  { id: 2, nombre: 'Medialuna', precio: 900, categoria: 'comida' },
  { id: 3, nombre: 'Tostado de jamón y queso', precio: 3500, categoria: 'comida' },
  { id: 4, nombre: 'Agua mineral', precio: 1200, categoria: 'bebida' }
];

let proximoId = 5;

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de la Cafetería del CRUI!');
});

app.get('/api/productos', (req, res) => {
  res.json(productos);
});

app.get('/api/productos/:id', (req, res) => {
  const idBuscar = Number(req.params.id);
  const producto = productos.find(p => p.id === idBuscar);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(producto);
});

app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria } = req.body || {};

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio y no puede estar vacío.' });
  }

  if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ error: 'El precio debe ser un número mayor que cero.' });
  }

  const nuevoProducto = {
    id: proximoId++,
    nombre: nombre.trim(),
    precio: precio,
    categoria: categoria || 'sin categoría'
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

app.put('/api/productos/:id', (req, res) => {
  const idModificar = Number(req.params.id);
  const productoIndex = productos.findIndex(p => p.id === idModificar);

  if (productoIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const { nombre, precio, categoria } = req.body || {};

  if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
    return res.status(400).json({ error: 'El nombre no puede estar vacío.' });
  }

  if (precio !== undefined && (typeof precio !== 'number' || precio <= 0)) {
    return res.status(400).json({ error: 'El precio debe ser un número mayor que cero.' });
  }

  productos[productoIndex] = {
    ...productos[productoIndex],
    nombre: nombre !== undefined ? nombre.trim() : productos[productoIndex].nombre,
    precio: precio !== undefined ? precio : productos[productoIndex].precio,
    categoria: categoria !== undefined ? categoria : productos[productoIndex].categoria
  };

  res.json(productos[productoIndex]);
});

app.delete('/api/productos/:id', (req, res) => {
  const idEliminar = Number(req.params.id);
  const productoIndex = productos.findIndex(p => p.id === idEliminar);

  if (productoIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const [productoEliminado] = productos.splice(productoIndex, 1);

  res.json({
    mensaje: 'Producto eliminado con éxito',
    producto: productoEliminado
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo con éxito en http://localhost:${PORT}`);
});