import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Menu,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactMailIcon,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { IoLocationOutline } from "react-icons/io5";
import { IconContext } from 'react-icons';
import { TiDocumentAdd } from "react-icons/ti";
import { FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { TiDocumentText } from "react-icons/ti";
import { RiFolderReceivedLine } from "react-icons/ri";
const drawerWidth = 240;

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  
const handleLogout = async () => {
  try {
    await axios.post('/auth/logout', {}, { withCredentials: true });
    navigate('/login');
  } catch (err) {
    console.error('Logout failed:', err);
  }
};
const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
     { text: 'Search', icon: <SearchIcon />, path: '/search-document' },
    { text: 'Add Document', icon: <TiDocumentAdd />, path: '/add-document' },
    { text: 'Receive', icon: <RiFolderReceivedLine />, path: '/view-receive' },
    { text: 'My Transaction', icon: <TiDocumentText />, path: '/view-transaction' },
    { text: 'Logout', icon: <FiLogOut />, action: handleLogout },
    
  ];
useEffect(() => {
  axios.get('/auth/profile', { withCredentials: true })
    .then(() => {
      console.log('User authenticated');
   
    })
    .catch(() => {
      console.log('User not authenticated');
  
    });
}, []);

  const drawer = (
    <Box sx={{ color: '#fff', bgcolor: '#1F2937', height: '100%' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        MyApp
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={item.path ? NavLink : 'div'}
            to={item.path}
            onClick={() => {
              if (item.action) item.action();
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              '&.active': {
                bgcolor: '#374151',
              },
              color: '#fff',
              '&:hover': {
                bgcolor: item.path ? '#4B5563' : '#9CA3AF', // make logout hover look different if you want
              },
              cursor: 'pointer'
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>

        ))}
      </List>
    </Box>
  );



  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: '#1F2937', // Dark blue-gray
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <Menu />
            </IconButton>
          )}
          <Stack direction="row" alignItems={"center"} gap={2}>
             <Typography variant="h6" noWrap>
             
            Document Track
             
          </Typography>
            <IconContext.Provider
              value={{ color: 'red', size: '24px' }}
            >
              <div>
                <IoLocationOutline />
              </div>
            </IconContext.Provider>
          </Stack>
         
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
