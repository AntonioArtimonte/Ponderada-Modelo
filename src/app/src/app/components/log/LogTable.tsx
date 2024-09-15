// components/LogTable.tsx

import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableCell,
} from '@mui/material';
import { Log } from './Log';
import LogTableRow from './LogTableRow';
import { AnimatePresence, motion } from 'framer-motion';

interface LogTableProps {
  logs: Log[];
}

const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Request Type</TableCell>
            <TableCell>Status Code</TableCell>
            <TableCell>Completion Time (ms)</TableCell>
            <TableCell>Crypto Name</TableCell>
            <TableCell>Error</TableCell>
          </TableRow>
        </TableHead>
        <TableBody component={motion.tbody}>
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <LogTableRow key={log.id} log={log} />
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogTable;
