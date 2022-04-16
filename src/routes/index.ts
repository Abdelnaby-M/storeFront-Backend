import express from 'express';
import userRoutes from "./user";
import productRoutes from "./product";
import orderRoutes from "./order";

export default function(app: express.Application) {

    app.use('/users', userRoutes);
    app.use('/products', productRoutes);
    app.use('/orders', orderRoutes);
  }