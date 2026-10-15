import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import orderRoutes from "./routes/order.routes.js";
import orderItemRoutes from "./routes/orderItem.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import cartItemRoutes from "./routes/cartItem.routes.js";
import salesHistoryRoutes from "./routes/salesHistory.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/cart-items", cartItemRoutes);
app.use("/api/sales-history", salesHistoryRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "POS Backend API is running"
    });
});

export default app;