import React, { useEffect, useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const BarangKeluar = ({ onLogout, onBarangKeluar }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    spesifikasi: "",
    jumlah: "",
    tanggal: "",
  });

  // 🔹 Load data dari Excel
  useEffect(() => {
    const loadExcelData = async () => {
      try {
        const response = await fetch("/data_barang.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const filtered = jsonData.map((row) => ({
          kode: row["Kode"],
          nama: row["Nama"],
          spesifikasi: row["Spesifikasi"] || "-",
        }));
        setItems(filtered);
        setFilteredItems(filtered);
      } catch (err) {
        console.error("Gagal memuat Excel:", err);
      }
    };
    loadExcelData();
  }, []);

  // 🔍 Fitur pencarian otomatis
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredItems(items);
    } else {
      const result = items.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(result);
    }
  }, [searchTerm, items]);

  const handleSelect = (namaBarang) => {
    const selected = items.find((i) => i.nama === namaBarang);
    if (selected) {
      setForm({
        ...form,
        nama: selected.nama,
        kode: selected.kode,
        spesifikasi: selected.spesifikasi,
      });
      setSearchTerm(selected.nama);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.jumlah || !form.tanggal) {
      return alert("Lengkapi semua kolom!");
    }

    onBarangKeluar(form.kode, form.nama, form.spesifikasi, form.jumlah, form.tanggal); // update stok global
    setRiwayat([...riwayat, form]);
    setForm({ kode: "", nama: "", spesifikasi: "", jumlah: "", tanggal: "" });
    setSearchTerm("");
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📤 Barang Keluar</h3>
        <div>
          <Button variant="secondary" className="me-2" onClick={() => navigate("/dashboard")}>
            Kembali
          </Button>
          <Button variant="danger" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Form Input */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3 position-relative">
          <Form.Label>Nama Barang</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ketik untuk mencari barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && filteredItems.length > 0 && (
            <div
              className="position-absolute bg-white border w-100 mt-1 shadow-sm"
              style={{ maxHeight: "200px", overflowY: "auto", zIndex: 10 }}
            >
              {filteredItems.map((item, i) => (
                <div
                  key={i}
                  className="p-2 border-bottom hover-bg-light"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelect(item.nama)}
                >
                  {item.nama}
                </div>
              ))}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Kode Barang</Form.Label>
          <Form.Control type="text" value={form.kode} disabled readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Spesifikasi</Form.Label>
          <Form.Control type="text" value={form.spesifikasi} disabled readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Jumlah Keluar</Form.Label>
          <Form.Control
            type="number"
            value={form.jumlah}
            onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tanggal Keluar</Form.Label>
          <Form.Control
            type="date"
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Simpan
        </Button>
      </Form>

      {/* Riwayat Barang Keluar */}
      <h5>Riwayat Barang Keluar</h5>
      <Table bordered hover responsive className="shadow-sm align-middle">
        <thead className="table-danger text-center">
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Nama</th>
            <th>Spesifikasi</th>
            <th>Jumlah</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {riwayat.map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{r.kode}</td>
              <td>{r.nama}</td>
              <td>{r.spesifikasi}</td>
              <td>{r.jumlah}</td>
              <td>{r.tanggal}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default BarangKeluar;
