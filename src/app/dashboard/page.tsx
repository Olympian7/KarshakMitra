
'use client';

// This file is no longer needed as the dashboard content is now served from the root page.tsx.
// It is kept to prevent breaking existing navigation links, but it simply informs the user.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardRedirect() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md text-center">
            <CardHeader>
                <CardTitle>Page Moved</CardTitle>
            </CardHeader>
            <CardContent>
                <p>The dashboard is now the home page.</p>
                <Link href="/" className="text-primary underline mt-4 inline-block">
                    Go to Dashboard
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}
