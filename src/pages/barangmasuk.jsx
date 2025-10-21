import React, { useEffect, useState } from "react";
import { Container, Form, Button, Table, ListGroup } from "react-bootstrap";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const BarangMasuk = ({ onLogout, onBarangMasuk }) => {
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
      } catch (err) {
        console.error("Gagal memuat data Excel:", err);
      }
    };
    loadExcelData();
  }, []);

  // 🔹 Filter pencarian nama barang (tanpa batas jumlah)
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems([]);
    } else {
      const lower = searchTerm.toLowerCase();
      const results = items.filter(
        (item) =>
          item.nama.toLowerCase().includes(lower) ||
          item.kode.toLowerCase().includes(lower) ||
          item.spesifikasi.toLowerCase().includes(lower)
      );
      setFilteredItems(results); // tidak dibatasi jumlah
    }
  }, [searchTerm, items]);

  // 🔹 Saat klik hasil autocomplete
  const handleSelect = (item) => {
    setForm({
      ...form,
      nama: item.nama,
      kode: item.kode,
      spesifikasi: item.spesifikasi,
    });
    setSearchTerm(item.nama);
    setFilteredItems([]);
  };

  // 🔹 Simpan barang masuk
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.nama || !form.jumlah || !form.tanggal)
    return alert("Lengkapi semua kolom!");

  // Proses frontend lama tetap jalan
  onBarangMasuk(
    form.kode,
    form.nama,
    form.spesifikasi,
    form.jumlah,
    form.tanggal
  );

  // Kirim data ke backend Flask (riwayat barang masuk)
  try {
    await fetch(`http://${window.location.hostname}:5000/api/riwayat-barang-masuk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  } catch (err) {
    console.error("Gagal menyimpan ke backend:", err);
  }

  // Update riwayat di frontend agar tetap sinkron
  setRiwayat([...riwayat, form]);

  // Reset form
  setForm({
    kode: "",
    nama: "",
    spesifikasi: "",
    jumlah: "",
    tanggal: "",
  });

  setSearchTerm("");
};


  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📥 Barang Masuk</h3>
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

      {/* 🔍 Form Input Barang Masuk */}
      <Form onSubmit={handleSubmit} className="mb-4 position-relative">
        <Form.Group className="mb-3">
          <Form.Label>Nama Barang</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ketik nama, kode, atau spesifikasi barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />

          {/* 🔽 Dropdown autocomplete */}
          {filteredItems.length > 0 && (
            <ListGroup
              className="position-absolute w-100 shadow-sm"
              style={{
                zIndex: 10,
                maxHeight: "250px",
                overflowY: "auto",
                backgroundColor: "white",
              }}
            >
              {filteredItems.map((item, i) => (
                <ListGroup.Item
                  key={i}
                  action
                  onClick={() => handleSelect(item)}
                >
                  <div className="fw-bold">{item.nama}</div>
                  <div className="small text-muted">
                    {item.kode} — {item.spesifikasi}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Kode Barang</Form.Label>
          <Form.Control type="text" value={form.kode} readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Spesifikasi</Form.Label>
          <Form.Control as="textarea" rows={2} value={form.spesifikasi} readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Jumlah Masuk</Form.Label>
          <Form.Control
            type="number"
            value={form.jumlah}
            onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tanggal Masuk</Form.Label>
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

      {/* 📋 Riwayat Barang Masuk */}
      <h5>Riwayat Barang Masuk</h5>
      <Table bordered hover responsive className="shadow-sm align-middle">
        <thead className="table-success text-center">
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

export default BarangMasuk;