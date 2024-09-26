'use client';
// pages/logs.tsx

// app/logs/page.tsx

import React from 'react';
import { Typography } from '@mui/material';
import Layout from '../components/log/Layout';
import LogTable from '../components/log/LogTable';
import { Log } from '../components/log/Log';

const LogsPage = async () => {
  let logs: Log[] = [];
  let error: string | null = null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  try {
    const res = await fetch(`${apiUrl}/api/db`, {
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch logs: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    logs = data.data;
  } catch (err) {
    console.error('Error fetching logs:', err);
    error = 'Failed to load logs.';
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Logs
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : logs.length === 0 ? (
        <Typography>Sem logs disponíveis.</Typography>
      ) : (
        <LogTable logs={logs} />
      )}
    </Layout>
  );
};

export default LogsPage;
