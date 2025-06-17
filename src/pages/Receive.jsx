import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';
import QrScanner from './QrScanner';
import axios from 'axios';

function Receive() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [transactionNo, setTransactionNo] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [id,setId] = useState() 
   const [errors, setErrors] = useState({});
  const handleScan = (data) => {
    setTransactionNo(data);
    setShowScanner(false);
    setCameraEnabled(false);
  };

  const handleToggleCamera = (event) => {
    setCameraEnabled(event.target.checked);
    setShowScanner(event.target.checked);
  };
  const [data,setData] = useState()
  useEffect(()=>{
    
    const fetchData = async() =>{
      try {
        const res  = await axios.get(`/auth/get-last-transaction?q=${id}`)
        setData(res.data)
      } catch (error) {
      }
    }
    fetchData()
  },[id])
  const submitForm = async(e) =>{
 e.preventDefault();
    try {   
        await axios.post('/auth/add-tracking', {id}, { withCredentials: true });
        await axios.put('/auth/update-transaction',{data})
        
    } catch (error) {
        setErrors(error.response?.data?.message || 'Submit Failed');
    }
   // window.location.reload();
  }
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: isMobile ? '100%' : '40%',
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}
        >
          Receive Document
        </Typography>

        <TextField
          fullWidth
          label="Transaction No."
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter or scan Transaction No."
          variant="outlined"
          sx={{ mt: 3 }}
        />

        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
          onClick={submitForm}
        >
          Submit
        </Button>

        {isMobile && (
  <>
    <Button
      variant="outlined"
      size="large"
      fullWidth
      sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
      onClick={() => setShowScanner(true)}
    >
      Scan QR Code
    </Button>

    {showScanner && (
      <QrScanner
        onScanSuccess={handleScan}
        onClose={() => setShowScanner(false)}
      />
    )}
  </>
)}
      </Paper>
    </Box>
  );
}

export default Receive;
