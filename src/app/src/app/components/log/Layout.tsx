// components/Layout.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const MotionContainer = motion(Container);

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
      <>
        <AppBar
          position="static"
          className="mt-10 mx-auto w-1/2"
          style={{
            backgroundColor: 'transparent',
            boxShadow: 'none', 
          }}
        >
          <Toolbar
            className="flex justify-center items-center"
            style={{ minHeight: '64px' }}
          >
            <Typography
              variant="h6"
              className="text-center text-3xl"
              style={{
                color: '#333',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', 
              }}
            >
              Logs De Uso do Sistema
            </Typography>
          </Toolbar>
        </AppBar>
  
        <MotionContainer
          maxWidth="lg"
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </MotionContainer>
      </>
    );
  };
  
  export default Layout;
  