import express from "express";
import cors from "cors";
import fs from "fs";
import os from "os"; // ✅ Tambahkan ini

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./data_stock.json";
const RIWAYAT_MASUK_FILE = "./riwayat_barang_masuk.json";
const RIWAYAT_KELUAR_FILE = "./riwayat_barang_keluar.json";

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

app.get("/api/riwayat-barang-masuk", (req, res) => {
  if (!fs.existsSync(RIWAYAT_MASUK_FILE)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(RIWAYAT_MASUK_FILE, "utf-8"));
  res.json(data);
});

app.post("/api/riwayat-barang-masuk", (req, res) => {
  const newData = req.body;
  const existingData = fs.existsSync(RIWAYAT_MASUK_FILE)
    ? JSON.parse(fs.readFileSync(RIWAYAT_MASUK_FILE, "utf-8"))
    : [];

  existingData.push(newData);
  fs.writeFileSync(RIWAYAT_MASUK_FILE, JSON.stringify(existingData, null, 2));
  res.json({ message: "Riwayat barang masuk berhasil disimpan" });
});

// ==============================
// 🔴 RIWAYAT BARANG KELUAR
// ==============================
app.get("/api/riwayat-barang-keluar", (req, res) => {
  if (!fs.existsSync(RIWAYAT_KELUAR_FILE)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(RIWAYAT_KELUAR_FILE, "utf-8"));
  res.json(data);
});

app.post("/api/riwayat-barang-keluar", (req, res) => {
  const newData = req.body;
  const existingData = fs.existsSync(RIWAYAT_KELUAR_FILE)
    ? JSON.parse(fs.readFileSync(RIWAYAT_KELUAR_FILE, "utf-8"))
    : [];

  existingData.push(newData);
  fs.writeFileSync(RIWAYAT_KELUAR_FILE, JSON.stringify(existingData, null, 2));
  res.json({ message: "Riwayat barang keluar berhasil disimpan" });
});


// 🔴 Hapus semua data stok
app.delete("/api/stock", (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE); // hapus file JSON
    }
    res.json({ message: "Data stok berhasil dihapus" });
  } catch (err) {
    console.error("Gagal hapus data stok:", err);
    res.status(500).json({ message: "Gagal menghapus data stok" });
  }
});

// DELETE semua riwayat barang masuk
app.delete("/api/riwayat-barang-masuk", (req, res) => {
  try {
    if (fs.existsSync(RIWAYAT_MASUK_FILE)) fs.writeFileSync(RIWAYAT_MASUK_FILE, "[]");
    res.json({ message: "Semua riwayat barang masuk berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus riwayat barang masuk" });
  }
});

// DELETE semua riwayat barang keluar
app.delete("/api/riwayat-barang-keluar", (req, res) => {
  try {
    if (fs.existsSync(RIWAYAT_KELUAR_FILE)) fs.writeFileSync(RIWAYAT_KELUAR_FILE, "[]");
    res.json({ message: "Semua riwayat barang keluar berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus riwayat barang keluar" });
  }
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
