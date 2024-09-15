import React from 'react';
import { TableCell } from '@mui/material';
import { Log } from './Log';
import { motion } from 'framer-motion';

interface LogTableRowsProps {
    log: Log;
}

const MotionTableRow = motion.tr;

const LogTableRow: React.FC<LogTableRowsProps> = ({ log }) => {
    const completionTimeMs = (log.completion_time / 1e6).toFixed(2);

    return (
        <MotionTableRow
            initial={{ opacity: 0, y: 10}}
            animate={{ opacity: 1, y: 0}}
            exit={{ opacity: 0, y: -10}}
            transition={{ duration: 0.3}}
        >
            <TableCell>{new Date(log.time).toLocaleString()}</TableCell>
            <TableCell>{log.request_type}</TableCell>
            <TableCell>{log.status_code}</TableCell>
            <TableCell>{completionTimeMs}</TableCell>
            <TableCell>{log.crypto_name || 'N/A'}</TableCell>
        </MotionTableRow>
    )
}

export default LogTableRow;