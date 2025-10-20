import React, { useState } from "react";
import { Container, Button, Table, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const StockBarang = ({ onLogout, items }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // 🔍 Filter barang berdasarkan input pencarian
  const filteredItems = items.filter(
    (item) =>
      item.nama?.toLowerCase().includes(search.toLowerCase()) ||
      item.kode?.toLowerCase().includes(search.toLowerCase())
  );

  // 📤 Fungsi export ke Excel
  const exportToExcel = () => {
    if (items.length === 0) return alert("Tidak ada data untuk diexport!");
    const worksheet = XLSX.utils.json_to_sheet(items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Stok Barang");
    XLSX.writeFile(workbook, "StockBarang.xlsx");
  };

  // 🗑️ Reset data
  const handleReset = () => {
    if (window.confirm("Yakin ingin menghapus semua data stok?")) {
      localStorage.removeItem("stockData");
      window.location.reload();
    }
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📦 Daftar Stok Barang</h3>
        <div>
          <Button variant="success" className="me-2" onClick={exportToExcel}>
            Export Excel
          </Button>
          <Button variant="secondary" className="me-2" onClick={() => navigate("/dashboard")}>
            Kembali
          </Button>
          <Button variant="danger" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Baris Pencarian dan Reset */}
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="🔍 Cari berdasarkan nama atau kode barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md="auto">
          <Button variant="outline-danger" onClick={handleReset}>
            Reset Data
          </Button>
        </Col>
      </Row>

      {/* Tabel Stok */}
      <Table bordered hover responsive className="shadow-sm align-middle">
        <thead className="table-primary text-center">
          <tr>
            <th>No</th>
            <th>Kode Barang</th>
            <th>Nama Barang</th>
            <th>Jumlah Masuk</th>
            <th>Jumlah Keluar</th>
            <th>Sisa</th>
            <th>Terakhir Masuk</th>
            <th>Terakhir Keluar</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="8">Tidak ada data barang yang cocok</td>
            </tr>
          ) : (
            filteredItems.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.kode}</td>
                <td>{item.nama}</td>
                <td>{item.jumlahMasuk || 0}</td>
                <td>{item.jumlahKeluar || 0}</td>
                <td>{item.sisa}</td>
                <td>{item.terakhirMasuk}</td>
                <td>{item.terakhirKeluar}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default StockBarang;
