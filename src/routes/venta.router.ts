import { Router } from 'express';
import Venta from '../models/Venta';

const router = Router();

// GET: Obtener ventas del día (UTC)
router.get('/', async (req, res) => {
  try {
    const ahora = new Date();
    const offsetMin = ahora.getTimezoneOffset(); // en minutos, por ejemplo 300 para UTC-5

    // Crea el inicio y fin del día en hora local
    const inicioLocal = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
    const finLocal = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59, 999);

    // Transforma esas fechas locales a UTC restando el offset (invertido)
    const inicioUTC = new Date(inicioLocal.getTime() - offsetMin * 60000);
    const finUTC = new Date(finLocal.getTime() - offsetMin * 60000);

    console.log("🕒 Buscando ventas desde:", inicioUTC.toISOString(), "hasta", finUTC.toISOString());

    const ventasDelDia = await Venta.find({
      fechaVenta: {
        $gte: inicioUTC,
        $lte: finUTC
      }
    });

    console.log(`✅ Ventas encontradas: ${ventasDelDia.length}`);
    res.json(ventasDelDia);
  } catch (error) {
    console.error('❌ Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener las ventas del día', detalle: error });
  }
});


// POST: Crear una nueva venta con fecha en UTC
router.post('/', async (req, res) => {
  try {
    // Si envían la fecha manualmente, la usamos; si no, usamos la hora actual convertida a UTC
    const fechaVentaUTC = req.body.fechaVenta
      ? new Date(req.body.fechaVenta)
      : new Date();

    const nuevaVenta = new Venta({
      productos: req.body.productos,
      fechaVenta: fechaVentaUTC
    });

    const ventaGuardada = await nuevaVenta.save();
    res.status(201).json(ventaGuardada);
  } catch (error) {
    console.error('❌ Error al guardar venta:', error);
    res.status(400).json({ error: 'Error al guardar la venta', detalle: error });
  }
});


// DELETE: Eliminar una venta
router.delete('/:id', async (req, res) => {
  await Venta.findByIdAndDelete(req.params.id);
  res.json({ message: 'Venta eliminada' });
});

export default router;
