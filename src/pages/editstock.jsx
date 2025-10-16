import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const EditStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <Card className="shadow p-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h4 className="mb-4 text-center">Edit Stok Barang #{id}</h4>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nama Barang</Form.Label>
            <Form.Control type="text" placeholder="Nama barang..." />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Barang Masuk</Form.Label>
            <Form.Control type="number" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Barang Keluar</Form.Label>
            <Form.Control type="number" />
          </Form.Group>

          <Button variant="primary" className="w-100 mt-2">
            Simpan Perubahan
          </Button>
          <Button
            variant="secondary"
            className="w-100 mt-2"
            onClick={() => navigate('/dashboard')}
          >
            Kembali
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default EditStock;
