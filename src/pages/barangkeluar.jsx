import React, { useEffect, useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const BarangKeluar = ({ onLogout, onBarangKeluar }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    jumlah: "",
    tanggal: "",
  });

  useEffect(() => {
    const loadExcelData = async () => {
      const response = await fetch("/data_barang.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const filtered = jsonData.map((row) => ({
        kode: row["Kode"],
        nama: row["Nama"],
      }));
      setItems(filtered);
    };
    loadExcelData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.jumlah || !form.tanggal) return alert("Lengkapi semua kolom!");

    onBarangKeluar(form.kode, form.nama, form.jumlah, form.tanggal); // update stok global
    setRiwayat([...riwayat, form]);
    setForm({ kode: "", nama: "", jumlah: "", tanggal: "" });
  };

  const handleSelect = (namaBarang) => {
    const selected = items.find((i) => i.nama === namaBarang);
    setForm({
      ...form,
      nama: namaBarang,
      kode: selected ? selected.kode : "",
    });
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📥 Barang BarangKeluar</h3>
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

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Nama Barang</Form.Label>
          <Form.Select
            value={form.nama}
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option value="">-- Pilih Barang --</option>
            {items.map((item, i) => (
              <option key={i} value={item.nama}>
                {item.nama}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Kode Barang</Form.Label>
          <Form.Control type="text" value={form.kode} disabled readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Jumlah BarangKeluar</Form.Label>
          <Form.Control
            type="number"
            value={form.jumlah}
            onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tanggal BarangKeluar</Form.Label>
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

      <h5>Riwayat Barang BarangKeluar</h5>
      <Table bordered hover responsive className="shadow-sm align-middle">
        <thead className="table-success text-center">
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Nama</th>
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
