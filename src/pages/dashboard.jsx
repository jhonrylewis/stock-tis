import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>📊 Dashboard Gudang</h3>
        <Button variant="danger" onClick={() => { onLogout(); navigate('/'); }}>
          Logout
        </Button>
      </div>

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow text-center border-0 p-3">
            <Card.Body>
              <h4>📦 Stock Barang</h4>
              <p className="text-muted">Lihat dan kelola semua stok barang yang tersedia</p>
              <Button variant="primary" onClick={() => navigate('/stock')}>
                Buka
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow text-center border-0 p-3">
            <Card.Body>
              <h4>📥 Barang Masuk</h4>
              <p className="text-muted">Catat dan tambahkan barang baru yang datang</p>
              <Button variant="success" onClick={() => navigate('/barang-masuk')}>
                Buka
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow text-center border-0 p-3">
            <Card.Body>
              <h4>📤 Barang Keluar</h4>
              <p className="text-muted">Kelola barang yang keluar dari gudang</p>
              <Button variant="warning" onClick={() => navigate('/barang-keluar')}>
                Buka
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
