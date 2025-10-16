import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import StockBarang from "./pages/stockbarang";
import BarangMasuk from "./pages/barangmasuk";
import BarangKeluar from "./pages/barangkeluar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // === Stok Barang Global ===
  const [stockData, setStockData] = useState(() => {
    const saved = localStorage.getItem("stockData");
    return saved ? JSON.parse(saved) : [];
  });

  // Simpan otomatis ke localStorage
  useEffect(() => {
    localStorage.setItem("stockData", JSON.stringify(stockData));
  }, [stockData]);

  // Fungsi menambah stok (Barang Masuk)
  const handleBarangMasuk = (kode, nama, jumlah, tanggal) => {
    setStockData((prev) => {
      const existing = prev.find((item) => item.kode === kode);
      if (existing) {
        return prev.map((item) =>
          item.kode === kode
            ? {
                ...item,
                sisa: item.sisa + parseInt(jumlah),
                jumlahMasuk: (item.jumlahMasuk || 0) + parseInt(jumlah),
                terakhirMasuk: tanggal,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            kode,
            nama,
            sisa: parseInt(jumlah),
            jumlahMasuk: parseInt(jumlah),
            jumlahKeluar: 0,
            terakhirMasuk: tanggal,
            terakhirKeluar: "-",
          },
        ];
      }
    });
  };

  // Fungsi mengurangi stok (Barang Keluar)
  const handleBarangKeluar = (kode, nama, jumlah, tanggal) => {
    setStockData((prev) =>
      prev.map((item) =>
        item.kode === kode
          ? {
              ...item,
              sisa: item.sisa - parseInt(jumlah),
              jumlahKeluar: (item.jumlahKeluar || 0) + parseInt(jumlah),
              terakhirKeluar: tanggal,
            }
          : item
      )
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login onLogin={() => setIsAuthenticated(true)} />}
        />

        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/stock"
              element={<StockBarang onLogout={handleLogout} items={stockData} />}
            />
            <Route
              path="/barang-masuk"
              element={
                <BarangMasuk
                  onLogout={handleLogout}
                  onBarangMasuk={handleBarangMasuk}
                />
              }
            />
            <Route
              path="/barang-keluar"
              element={
                <BarangKeluar
                  onLogout={handleLogout}
                  onBarangKeluar={handleBarangKeluar}
                />
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
