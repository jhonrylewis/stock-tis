import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import BarangMasuk from "./pages/barangmasuk";
import BarangKeluar from "./pages/barangkeluar";
import StockBarang from "./pages/stockbarang";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stockData, setStockData] = useState([]);

  // 🟢 Ambil data dari backend + simpan ke localStorage
  useEffect(() => {
    const backendURL = `http://${window.location.hostname}:5000/api/stock`;

    const fetchStock = async () => {
      try {
        const response = await fetch(backendURL);
        if (!response.ok) throw new Error("Server tidak merespons");
        const data = await response.json();
        setStockData(data);
        localStorage.setItem("stockData", JSON.stringify(data));
      } catch (error) {
        console.warn("Gagal ambil data dari server, gunakan localStorage:", error);
        const saved = localStorage.getItem("stockData");
        if (saved) setStockData(JSON.parse(saved));
      }
    };

    fetchStock();

    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") setIsLoggedIn(true);
  }, []);

  // 🟡 Sinkronisasi ke backend jika stok berubah
  useEffect(() => {
    if (stockData.length > 0) {
      localStorage.setItem("stockData", JSON.stringify(stockData));

      const backendURL = `http://${window.location.hostname}:5000/api/stock`;

      fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockData),
      }).catch((err) => console.error("⚠️ Gagal sync ke backend:", err));
    }
  }, [stockData]);

  // 🟣 Login
  const handleLogin = (username, password) => {
    if (username === "admin" && password === "12345") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Username atau password salah!");
    }
  };

  // 🔴 Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  // 📥 Barang Masuk
  const handleBarangMasuk = (kode, nama, spesifikasi, jumlah, tanggal) => {
    setStockData((prev) => {
      const exist = prev.find((item) => item.kode === kode);
      let updated;
      if (exist) {
        updated = prev.map((item) =>
          item.kode === kode
            ? {
                ...item,
                jumlahMasuk: (item.jumlahMasuk || 0) + parseInt(jumlah),
                sisa: (item.sisa || 0) + parseInt(jumlah),
                terakhirMasuk: tanggal,
              }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            kode,
            nama,
            spesifikasi,
            jumlahMasuk: parseInt(jumlah),
            jumlahKeluar: 0,
            sisa: parseInt(jumlah),
            terakhirMasuk: tanggal,
            terakhirKeluar: "-",
          },
        ];
      }
      return updated;
    });
  };

  // 📤 Barang Keluar
  const handleBarangKeluar = (kode, nama, spesifikasi, jumlah, tanggal) => {
    setStockData((prev) => {
      const exist = prev.find((item) => item.kode === kode);
      let updated;
      if (exist) {
        const sisaBaru = (exist.sisa || 0) - parseInt(jumlah);
        updated = prev.map((item) =>
          item.kode === kode
            ? {
                ...item,
                jumlahKeluar: (item.jumlahKeluar || 0) + parseInt(jumlah),
                sisa: sisaBaru >= 0 ? sisaBaru : 0,
                terakhirKeluar: tanggal,
              }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            kode,
            nama,
            spesifikasi,
            jumlahMasuk: 0,
            jumlahKeluar: parseInt(jumlah),
            sisa: 0,
            terakhirMasuk: "-",
            terakhirKeluar: tanggal,
          },
        ];
      }
      return updated;
    });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/barang-masuk"
          element={
            isLoggedIn ? (
              <BarangMasuk onLogout={handleLogout} onBarangMasuk={handleBarangMasuk} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/barang-keluar"
          element={
            isLoggedIn ? (
              <BarangKeluar onLogout={handleLogout} onBarangKeluar={handleBarangKeluar} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/stock"
          element={
            isLoggedIn ? (
              <StockBarang onLogout={handleLogout} items={stockData} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
