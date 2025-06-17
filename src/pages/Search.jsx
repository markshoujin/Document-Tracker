import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import { useLocation, useNavigate } from 'react-router-dom';



console.log(document)
const Search = () => {
  const [query, setQuery] = useState('');
  const [document , setDocument] = useState()
const navigate = useNavigate()
  const filteredDocs = document?.filter((doc) =>
    doc.document_name.toLowerCase().includes(query.toLowerCase())
  );

useEffect(()=>{

const fetchdata = async () =>{
        try {
            const result = await axios.get("/auth/get-document")
            setDocument(result.data)
        } catch (error) {
            
        }
}
fetchdata()
},[])

console.log(filteredDocs)
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Search Documents</Typography>
      <TextField
        fullWidth
        label="Search by title..."
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 3, maxWidth: 500 }}
      />
      <Paper>
        <List>
         {filteredDocs?.map((doc, index) => (
  <ListItem key={index} divider>
    <Box width="100%">
      {/* Top Row: Name on left, No. on right with view button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 'bold' }}>
          {doc.document_name}
        </Typography>
        
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontWeight: 'bold' }}>
            {doc.document_no}
          </Typography>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate("/view",{state:doc.document_no})}
          >
            <VisibilityIcon sx={{ color: '#000000' }} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Bottom Row: Description */}
      <Typography sx={{ mt: 1 }}>
        {doc.document_desc}
      </Typography>
    </Box>
  </ListItem>
))}

          {filteredDocs?.length === 0 && (
            <ListItem>
              <ListItemText primary="No documents found." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Search;
