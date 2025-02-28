import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  Divider,
  Chip,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faHistory, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 12px 40px rgba(26, 188, 156, 0.15)',
  background: '#ffffff',
  borderLeft: '5px solid #1abc9c',
}));

const StyledButton = styled(Button)({
  background: 'linear-gradient(45deg, #1abc9c, #17a589)',
  borderRadius: 12,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 5px 15px rgba(26, 188, 156, 0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #148c76, #1abc9c)',
    boxShadow: '0 8px 20px rgba(26, 188, 156, 0.4)',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    background: '#e6f4f1',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: '2px solid #1abc9c',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#718096',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1abc9c',
  },
});

export default function Shipping() {
  const [insideDhaka, setInsideDhaka] = useState('');
  const [outsideDhaka, setOutsideDhaka] = useState('');
  const [shippingId, setShippingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShipping = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://backend.aihomesd.com/shipping/66f52cedd61b11378679f834');
        const data = await response.json();

        if (response.ok) {
          setInsideDhaka(data.insideDhaka);
          setOutsideDhaka(data.outsideDhaka);
          setShippingId(data._id);
          setLastUpdated(data.updatedAt || new Date().toISOString());
        } else {
          setError(data.message || 'Failed to fetch shipping info');
        }
      } catch (error) {
        setError('An error occurred while fetching shipping info');
      } finally {
        setLoading(false);
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

    setLoading(true);
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
        setLastUpdated(new Date().toISOString());
      } else {
        setError(data.message || 'Failed to update shipping cost');
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred while updating shipping cost');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#e6f4f1', p: 4, fontFamily: "'Poppins', sans-serif" }}>
      <Container maxWidth="md">
        <StyledPaper elevation={0}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#1abc9c', width: 56, height: 56 }}>
                <FontAwesomeIcon icon={faSave} size="lg" />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2d3748' }}>
                  Shipping Control Panel
                </Typography>
                <Typography variant="body2" sx={{ color: '#718096' }}>
                  Configure delivery costs with precision
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Last updated">
              <Chip
                icon={<FontAwesomeIcon icon={faHistory} />}
                label={lastUpdated ? dayjs(lastUpdated).format('DD MMM YYYY, HH:mm') : 'N/A'}
                sx={{ bgcolor: '#d1ece5', color: '#1abc9c', fontWeight: 500 }}
              />
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 4, borderColor: '#d1ece5' }} />

          {/* Form */}
          <form onSubmit={handleUpdate}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 5px 15px rgba(0,0,0,0.05)', borderLeft: '3px solid #1abc9c' }}>
                <CardContent>
                  <StyledTextField
                    label="Inside Dhaka Shipping Cost"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={insideDhaka}
                    onChange={(e) => setInsideDhaka(e.target.value)}
                    required
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Cost in BDT">
                          <IconButton>
                            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1abc9c' }} />
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: '0 5px 15px rgba(0,0,0,0.05)', borderLeft: '3px solid #1abc9c' }}>
                <CardContent>
                  <StyledTextField
                    label="Outside Dhaka Shipping Cost"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={outsideDhaka}
                    onChange={(e) => setOutsideDhaka(e.target.value)}
                    required
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Cost in BDT">
                          <IconButton>
                            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1abc9c' }} />
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </CardContent>
              </Card>

              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <div className="spinner-border spinner-border-sm" style={{ color: '#ffffff' }} /> : <FontAwesomeIcon icon={faSave} />}
              >
                {loading ? 'Updating...' : 'Update Shipping Costs'}
              </StyledButton>
            </Box>
          </form>

          {/* Messages */}
          <Box sx={{ mt: 4 }}>
            {message && (
              <Alert
                severity="success"
                sx={{ borderRadius: 2, bgcolor: '#d1ece5', color: '#1abc9c', border: '1px solid #1abc9c' }}
              >
                {message}
              </Alert>
            )}
            {error && (
              <Alert
                severity="error"
                sx={{ borderRadius: 2, bgcolor: '#ffe6e6', color: '#e53e3e', border: '1px solid #e53e3e' }}
              >
                {error}
              </Alert>
            )}
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
}