import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoPrintOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function ViewTransaction() {
  const [document, setDocument] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("This is User",user.user_idNo)
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/auth/get-user-document',{
        params: { user_idNo: user.user_idNo }
      });
      setDocument(result.data);
    };
    fetchData();
  }, []);
  function checkStatus(value)
{
    if(value==="Ongoing")
    {
        return " #f57c00"
    }
    else if(value==="Complete"){
        return " #388e3c"
    }
    else if(value==="Cancel"){
        return " #d32f2f"
    }
}
  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography
        sx={{
          fontSize: { xs: 24, sm: 32, md: 40 },
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 3,
        }}
      >
        My Transaction
      </Typography>

      {/* 📱 Mobile Layout (Cards) */}
      {isMobile ? (
        <Grid container spacing={2}>
          {document?.map((data, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography fontWeight="bold" variant="subtitle2">
                    Transaction No.
                  </Typography>
                  <Typography>{data.transaction_no}</Typography>

                  <Typography fontWeight="bold" variant="subtitle2" mt={1}>
                    Document Name
                  </Typography>
                  <Typography>{data.document_name}</Typography>

                  <Typography fontWeight="bold" variant="subtitle2" mt={1}>
                    Status
                  </Typography>
                  <Typography color={checkStatus(data.transaction_status)} mb={2}>{data.transaction_status}</Typography>

                  <Button
                    variant="outlined"
                    startIcon={<IoPrintOutline size={20} color="#1F2937" />}
                    onClick={()=>{navigate("/generate",{state:data})}}
                  >
                    Print
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // 💻 Desktop Layout (Table)
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer component={Paper}>
            <Table aria-label="transaction table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: 24 }}>
                    Transaction No.
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: 24 }}>
                    Document Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: 24 }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: 24 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {document?.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell align="center" sx={{ fontSize: 24 }}>
                      {data.transaction_no}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: 24 }}>
                      {data.document_name}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: 24 }} >
                      <Typography color={checkStatus(data?.transaction_status)}>{data.transaction_status}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button onClick={()=>{navigate("/generate",{state:data})}}>
                        <IoPrintOutline size={24} color="#1F2937" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}

export default ViewTransaction;
