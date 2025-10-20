import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// File JSON untuk menyimpan data stok
const DATA_FILE = "./data_stock.json";

// 🔹 Ambil semua data stok
app.get("/api/stock", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  res.json(data);
});

// 🔹 Simpan/update data stok
app.post("/api/stock", (req, res) => {
  const stockData = req.body;
  fs.writeFileSync(DATA_FILE, JSON.stringify(stockData, null, 2));
  res.json({ message: "Data stok berhasil disimpan" });
});

// Jalankan server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server berjalan di http://localhost:${PORT}`));
