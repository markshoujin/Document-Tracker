import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  useMediaQuery,
  FormHelperText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

const Add = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({
    id:'',
    title: '',
    description: '',
    file: null,
    
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

    function generateTimestamp() {
    const now = new Date();

    const pad = (n) => n.toString().padStart(2, '0');

    const year = now.getFullYear().toString().slice(2); // Get last 2 digits of year
    const month = pad(now.getMonth() + 1);              // Months are 0-based
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }



  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.file) newErrors.file = 'Please upload a document file';
    return newErrors;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();

  const id = await generateTimestamp();
  const updatedForm = { ...form, id };

  if (Object.keys(validationErrors).length) {
    console.log(updatedForm); 

    try {
      await axios.post('/auth/add-document', updatedForm, { withCredentials: true });
      await axios.post('/auth/add-tracking', updatedForm, { withCredentials: true });
    } catch (err) {
      setErrors(err.response?.data?.message || 'Login failed');
    }
    window.location.reload();

    return;
  }

  // Submit logic here
  console.log('Document Submitted:', updatedForm);
  alert(`Document "${updatedForm.title}" submitted!`);

  // Reset form
  setForm({ title: '', description: '', file: null });
};


  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: 'auto',
        p: isMobile ? 2 : 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 3 : 5,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={3} align="center">
          Add New Document
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Document Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                placeholder="Enter document title"
                variant="outlined"
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Add an optional description"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                fullWidth={isMobile}
                sx={{
                  borderColor: errors.file ? 'error.main' : 'grey.500',
                  color: errors.file ? 'error.main' : 'text.primary',
                  '&:hover': {
                    borderColor: errors.file ? 'error.dark' : 'primary.main',
                    backgroundColor: errors.file ? 'rgba(211, 47, 47, 0.08)' : 'transparent',
                  },
                  py: 1.5,
                }}
              >
                {form.file ? `Selected: ${form.file.name}` : 'Upload Document'}
                <input
                  hidden
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
              </Button>
              {errors.file && (
                <FormHelperText error sx={{ ml: 1 }}>
                  {errors.file}
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} textAlign="center" mt={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ minWidth: 160 }}
              >
                Submit Document
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Add;
