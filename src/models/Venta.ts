import { Schema, model, Document } from 'mongoose';

// Definimos el producto con cantidad vendida
interface IProducto {
  nombre: string;
  precio: number;
  cantidadVendida: number; // Nueva propiedad
}

export interface IVenta extends Document {
  productos: IProducto[];
  fechaVenta: Date;
}

const ProductoSchema = new Schema<IProducto>({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  cantidadVendida: { type: Number, required: true, min: 1 } // Aseguramos que la cantidad sea al menos 1
});

const VentaSchema = new Schema<IVenta>({
  productos: { type: [ProductoSchema], required: true },
  fechaVenta: { type: Date, default: Date.now }
});

export default model<IVenta>('Venta', VentaSchema);
