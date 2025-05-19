import React, { useEffect, useState } from 'react';
import { Form, Button, Table, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { MdEdit } from "react-icons/md";



const apiUrl = import.meta.env.VITE_API_URL;

const statusEnum = ['pending', 'paid', 'rejected'];

const SalesFilterPanel = () => {
  const [filter, setFilter] = useState('pending');
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}api/v1/sale?status=${filter}`, {
        withCredentials: true
      });
      setSales(res.data);
    } catch (err) {
      console.error('Failed to fetch sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      await axios.patch(
        `${apiUrl}api/v1/sale/${id}/payout`,
        { payoutStatus: updatedStatus },
        { withCredentials: true }
      );
      setEditingId(null);
      fetchSales();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [filter]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sales Status Management</h2>

      <Form.Group controlId="statusFilter" className="mb-3">
        <Form.Label>Select Status</Form.Label>
        <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {statusEnum.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Song ID</th>
              <th>Buyer ID</th>
              <th>Seller ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td>{sale.songId?._id || sale.songId}</td>
                <td>{sale.buyerId?._id || sale.buyerId}</td>
                <td>{sale.sellerId?._id || sale.sellerId}</td>
                <td>${sale.amountPaid.toFixed(2)}</td>
                <td>
                  {editingId === sale._id ? (
                    <Form.Select
                      size="sm"
                      value={updatedStatus}
                      onChange={(e) => setUpdatedStatus(e.target.value)}
                    >
                      {statusEnum.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </Form.Select>
                  ) : (
                    <span className="text-capitalize">{sale.payoutStatus}</span>
                  )}
                </td>
                <td>
                  {editingId === sale._id ? (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleStatusUpdate(sale._id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setEditingId(sale._id);
                        setUpdatedStatus(sale.payoutStatus);
                      }}
                    >
                      <MdEdit />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SalesFilterPanel;
