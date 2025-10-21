import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RiwayatKeluar = ({ onLogout }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://${window.location.hostname}:5000/api/riwayat-barang-keluar`
        );
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Gagal ambil riwayat keluar:", err);
        setError("Gagal mengambil data riwayat barang keluar.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>📤 Riwayat Barang Keluar</h3>
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

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" /> <p>Memuat data...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <Table bordered hover responsive>
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
            {data.length > 0 ? (
              data.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.kode}</td>
                  <td>{item.nama}</td>
                  <td>{item.spesifikasi}</td>
                  <td>{item.jumlah}</td>
                  <td>{item.tanggal}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-muted">
                  Tidak ada data riwayat barang keluar
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RiwayatKeluar;
