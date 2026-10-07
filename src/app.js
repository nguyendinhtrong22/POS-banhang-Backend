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


app.get("/", (req, res) => {
    res.json({
        message: "POS Backend API is running"
    });
});

export default app;