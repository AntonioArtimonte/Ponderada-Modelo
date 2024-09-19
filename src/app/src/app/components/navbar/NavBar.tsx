"use client";

import { FC, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Search, Person } from '@mui/icons-material';
import NavMenu from './NavMenu';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SearchBar from './SearchBar';

const Navbar: FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { label: 'DASHBOARD', href: '/dashboard' },
    { label: 'TREINO', href: '/train' },
    { label: 'TESTE', href: '/test' },
    { label: "LOGS", href: '/logs' },
    { label: 'SOBRE', href: '/about' },
  ];

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <AppBar
      position="relative"
      className="bg-[#FAF3E0] shadow-xl rounded-xl mx-4"
      style={{
        marginTop: '20px', 
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.1)',
        borderRadius: '15px',
        padding: '0 20px',
        backgroundColor: '#FAF3E0',
      }}
    >
      <Toolbar className="!flex !justify-between">
        <Typography
          variant="h6"
          className="!font-playfair !text-[#3E2723] !text-3xl"
        >
          <CurrencyExchangeIcon className="!me-3 !mb-1"/>
          Crypto
        </Typography>
        <NavMenu items={navItems} />
        <Box className="!flex !space-x-4 !items-center">
        </Box>
      </Toolbar>

    </AppBar>
  );
};

export default Navbar;
