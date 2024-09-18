'use client';

import { FC } from 'react';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage: FC = () => {
  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
