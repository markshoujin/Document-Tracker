import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { IoLocationOutline } from 'react-icons/io5';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false)
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true)
  try {
    const res = await axios.post('/auth/login', form, { withCredentials: true });
    const data = res.data;

    if (res.status === 200) {
      // Save token in localStorage
      localStorage.setItem('token', data.token);

      // Optionally save user info too
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Login successful, token saved.');

      // Navigate after successful login
      navigate('/');
      setLoading(false)
    } else {
      console.error('Login failed:', data.message);
      setError(data.message);
      setLoading(false)
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
    setLoading(false)
  }
};


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1F2937', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{ p: 4, backgroundColor: '#374151', color: '#FFFFFF' }}
        >
          <Box mb={2}>
            <Stack direction="row" alignItems="center" justifyContent="center" gap={2}>
              <Typography variant="h4" noWrap color="inherit">
                Document Track
              </Typography>
              <IconContext.Provider value={{ color: 'red', size: '24px' }}>
                <div><IoLocationOutline /></div>
              </IconContext.Provider>
            </Stack>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}  autoComplete="off">
           <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="off"
                margin="normal"
                InputLabelProps={{ style: { color: '#9CA3AF' } }}
                InputProps={{
                    style: { color: '#FFFFFF' },
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#6B7280',
                    },
                    '&:hover fieldset': {
                        borderColor: '#9CA3AF',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#9CA3AF',
                    },
                    },
                }}
                />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              autoComplete="off"
              margin="normal"
              InputLabelProps={{ style: { color: '#9CA3AF' } }}
              InputProps={{
                style: { color: '#FFFFFF' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#6B7280',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9CA3AF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#9CA3AF',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              loading={loading}
              
              fullWidth
              sx={{
                mt: 2,
                bgcolor: '#2563EB',
                '&:hover': {
                  bgcolor: '#1D4ED8',
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
