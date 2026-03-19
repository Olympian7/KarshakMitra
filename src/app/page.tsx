
import React from 'react';
import DashboardContent from './dashboard-content';

// Data fetching has moved into the client component (dashboard-content.tsx)
// so it can use useAuth() to enforce authentication and scope data to the
// logged-in user's UID.
export default function DashboardPage() {
  return <DashboardContent />;
}
