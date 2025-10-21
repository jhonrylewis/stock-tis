import express from "express";
import cors from "cors";
import fs from "fs";
import os from "os"; // ✅ Tambahkan ini

const app = express();
app.use(cors());
app.use(express.json());

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

// 🔹 Jalankan server di semua IP LAN
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  const ipList = Object.values(os.networkInterfaces())
    .flat()
    .filter((iface) => iface.family === "IPv4" && !iface.internal)
    .map((iface) => iface.address);

  console.log("✅ Server berjalan di:");
  console.log(`   Lokal     → http://localhost:${PORT}`);
  ipList.forEach((ip) => console.log(`   Jaringan  → http://${ip}:${PORT}`));
});
