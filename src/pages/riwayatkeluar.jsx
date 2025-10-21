import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RiwayatKeluar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [riwayat, setRiwayat] = useState([]);

  // 🔹 Ambil data riwayat dari backend
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:5000/api/riwayat-barang-keluar`);
        if (!response.ok) throw new Error("Gagal memuat data riwayat.");
        const data = await response.json();
        setRiwayat(data);
      } catch (err) {
        console.error("⚠️ Gagal mengambil data riwayat:", err);
      }
    };
    fetchRiwayat();
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📜 Riwayat Barang Keluar</h3>
        <div>
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => navigate("/dashboard")}
          >
            Kembali
          </Button>
          <Button variant="danger" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* 📋 Tabel Riwayat Barang Keluar */}
      <Table bordered hover responsive className="shadow-sm align-middle">
        <thead className="table-danger text-center">
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Nama</th>
            <th>Spesifikasi</th>
            <th>Jumlah</th>
            <th>Tanggal</th>
            <th>Keterangan / Tujuan</th> {/* 🔹 Kolom baru */}
          </tr>
        </thead>
        <tbody className="text-center">
          {riwayat.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-muted">
                Belum ada data riwayat barang keluar.
              </td>
            </tr>
          ) : (
            riwayat.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.kode}</td>
                <td>{r.nama}</td>
                <td>{r.spesifikasi}</td>
                <td>{r.jumlah}</td>
                <td>{r.tanggal}</td>
                <td>{r.keterangan || "-"}</td> {/* 🔹 tampilkan field baru */}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default RiwayatKeluar;
