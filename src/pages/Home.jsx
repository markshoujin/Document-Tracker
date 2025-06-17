import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Avatar,
  Box,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  HourglassEmpty,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { green, orange, red, blueGrey } from '@mui/material/colors';

const summaryData = [
  {
    title: 'Total Documents',
    value: 128,
    icon: <DescriptionIcon />,
    color: blueGrey[700],
  },
  {
    title: 'Pending Review',
    value: 24,
    icon: <HourglassEmpty />,
    color: orange[700],
  },
  {
    title: 'Approved',
    value: 85,
    icon: <CheckCircle />,
    color: green[700],
  },
  {
    title: 'Rejected',
    value: 19,
    icon: <Cancel />,
    color: red[700],
  },
];

const recentDocuments = [
  { name: 'Proposal.docx', status: 'Pending', date: '2025-05-20' },
  { name: 'Report.pdf', status: 'Approved', date: '2025-05-18' },
  { name: 'Invoice.xlsx', status: 'Rejected', date: '2025-05-17' },
  { name: 'Summary.docx', status: 'Approved', date: '2025-05-15' },
];

// Helper: map status to color chip
const getStatusChip = (status) => {
  const chipColors = {
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'error',
  };

  return <Chip label={status} color={chipColors[status]} size="small" />;
};

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  console.log("Token",user)
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Home
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={4}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Avatar
                sx={{
                  bgcolor: item.color,
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                {item.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {item.title}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {item.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Documents Table */}
      <Typography variant="h6" gutterBottom>
        Recent Documents
      </Typography>
      <Paper elevation={3} sx={{ overflow: 'auto' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentDocuments.map((doc, index) => (
              <TableRow key={index}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{getStatusChip(doc.status)}</TableCell>
                <TableCell>{doc.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Home;
