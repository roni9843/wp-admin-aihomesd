import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from '@mui/material';

export default function Shipping() {
  const [insideDhaka, setInsideDhaka] = useState('');
  const [outsideDhaka, setOutsideDhaka] = useState('');
  const [shippingId, setShippingId] = useState(null); // Holds the ID of fetched shipping
  const [message, setMessage] = useState(''); // Success or error message
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const response = await fetch('https://backend.aihomesd.com/shipping/66f52cedd61b11378679f834');
        const data = await response.json();

        if (response.ok) {
          setInsideDhaka(data.insideDhaka);
          setOutsideDhaka(data.outsideDhaka);
          setShippingId(data._id); // Store the shipping ID for future updates
        } else {
          setError(data.message || 'Failed to fetch shipping info');
        }
      } catch (error) {
        setError('An error occurred while fetching shipping info');
      }
    };

    fetchShipping();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!shippingId) {
      setError('No shipping entry found to update.');
      return;
    }

    try {
      const response = await fetch(`https://backend.aihomesd.com/shipping/${shippingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insideDhaka: parseInt(insideDhaka),
          outsideDhaka: parseInt(outsideDhaka),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Shipping cost updated successfully');
        setError(null);
      } else {
        setError(data.message || 'Failed to update shipping cost');
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred while updating shipping cost');
      setMessage('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5,pt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Update Shipping Cost
        </Typography>

        {/* Form for updating shipping */}
        <form onSubmit={handleUpdate}>
          <Box mb={2}>
            <TextField
              label="Shipping Cost Inside Dhaka"
              type="number"
              fullWidth
              variant="outlined"
              value={insideDhaka}
              onChange={(e) => setInsideDhaka(e.target.value)}
              required
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Shipping Cost Outside Dhaka"
              type="number"
              fullWidth
              variant="outlined"
              value={outsideDhaka}
              onChange={(e) => setOutsideDhaka(e.target.value)}
              required
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Update Shipping
          </Button>
        </form>

        {/* Display success or error messages */}
        <Box mt={3}>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Paper>
    </Container>
  );
}
