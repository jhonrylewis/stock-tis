import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RiwayatMasuk = ({ onLogout }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://${window.location.hostname}:5000/api/riwayat-barang-masuk`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Gagal ambil riwayat masuk:", err));
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>📥 Riwayat Barang Masuk</h3>
        <div>
          <Button variant="secondary" className="me-2" onClick={() => navigate("/dashboard")}>
            Kembali
          </Button>
          <Button variant="danger" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Table bordered hover responsive>
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
          {data.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.kode}</td>
              <td>{item.nama}</td>
              <td>{item.spesifikasi}</td>
              <td>{item.jumlah}</td>
              <td>{item.tanggal}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default RiwayatMasuk;
