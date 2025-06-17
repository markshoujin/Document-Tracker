import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Stack,
   
} from '@mui/material';
import axios from 'axios';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';

// Simulated API call

const View = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
 const data = useLocation();
const documentNo = data.state;  // Could be string, number, or whatever

function formatTimestampToReadable(dateString) {
  const date = new Date(dateString);
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  // Format the date
  const formatted = date.toLocaleString('en-US', options);

  // Remove ":00 " if minutes are zero (optional)
  return formatted.replace(/:00\s/, ' ');
}
useEffect(() => {
  const loadDocument = async () => {
    // Wrap documentNo inside an object with the correct key name expected by your API
    const params = typeof documentNo === 'object' && documentNo !== null
      ? documentNo
      : { documentNo: documentNo };

    try {
      const result = await axios.get("/auth/get-tracking", {
        params: params
      });
      setDocument(result.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  loadDocument();
}, [documentNo]);
const [documentTimeline,setDocumentTimeline] = useState()
useEffect(()=>{
 const params = typeof documentNo === 'object' && documentNo !== null
      ? documentNo
      : { documentNo: documentNo };

    const fetchData = async()=>{
        try {
      const result = await axios.get("/auth/get-timeline", {
        params: params
      });
      setDocumentTimeline(result.data);
    } catch (error) {
      console.error(error);
    }
    }
    fetchData()
},[])
console.log("document",documentTimeline)
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
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!document) {
    return <Typography variant="h6" color="error">Document not found.</Typography>;
  }

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant="h4" gutterBottom>
          {document[0]?.document_name}
        </Typography>
        <Box bgcolor={checkStatus(document[0]?.transaction_status)}  borderRadius={5}>
        <Typography variant="h6"padding={2}  >
          {document[0]?.transaction_status}
        </Typography>
        </Box>
       
        </Stack>
        

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" color="text.secondary">
          No: {document[0].document?.document_no}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Location: {document[0].user.user_department[0].department?.department_name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Last Recieved by: {document[0].user?.username}
        </Typography>

        <Box mt={3}>
          <Typography variant="h6">Description</Typography>
          <Typography variant="body1">{document[0].document?.document_desc}</Typography>
        </Box>
      </Paper>
      <Timeline position="alternate">
      {documentTimeline?.map((step, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent color="text.secondary">
            {formatTimestampToReadable(step?.transaction_time)}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            {index < documentTimeline?.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6">Recieved</Typography>
              <Typography>{step?.username}</Typography>
              <Typography variant="body2">{step?.department_name}</Typography>
              <Typography variant="body2" color={checkStatus(step?.transaction_status)}>{step?.transaction_status}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
    </Box>
  );
};

export default View;
