import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import React from 'react';

const Settings = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card padding="lg" className="flex flex-col justify-between gap-y-8">
        <div className="flex w-full items-center justify-between gap-y-6">
          <Header>Settings</Header>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
