import { FC } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Search, Person, ShoppingCart } from '@mui/icons-material';
import NavMenu from './NavMenu';

const Navbar: FC = () => {
  const navItems = [
    { label: 'SHOP', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'BLOG', href: '/blog' },
  ];

  return (
    <AppBar
      position="relative"
      className="bg-[#FAF3E0] shadow-xl rounded-xl mx-4"
      style={{
        marginTop: '20px',  // Adds space at the top
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.1)',
        borderRadius: '15px',
        padding: '0 20px',
      }}
    >
      <Toolbar className="flex justify-between">
        <Typography
          variant="h6"
          className="font-playfair text-[#3E2723] text-3xl"
        >
          Xablau
        </Typography>
        <NavMenu items={navItems} />
        <Box className="flex space-x-4">
          <IconButton>
            <Search className="text-[#3E2723]" />
          </IconButton>
          <IconButton>
            <Person className="text-[#3E2723]" />
          </IconButton>
          <IconButton>
            <ShoppingCart className="text-[#3E2723]" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
