'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './Button';
import { ManageDomain } from './features/ManageDomain';
import { DiffProfiles } from './features/DiffProfiles';
import { SyncLists } from './features/SyncLists';
import { CopyProfile } from './features/CopyProfile';
import styles from './Dashboard.module.scss';

type Tab = 'manage' | 'diff' | 'sync' | 'copy';

const TABS: { id: Tab; label: string; description: string }[] = [
  {
    id: 'manage',
    label: 'Manage Domains',
    description: 'Add, remove, enable or disable domains across profiles',
  },
  {
    id: 'diff',
    label: 'Compare Profiles',
    description: 'View differences between your profiles',
  },
  {
    id: 'sync',
    label: 'Sync Lists',
    description: 'Synchronize allowlists and denylists across profiles',
  },
  {
    id: 'copy',
    label: 'Copy Profile',
    description: 'Clone a profile to another account',
  },
];

export function Dashboard() {
  const { profiles, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('manage');

  const renderContent = () => {
    switch (activeTab) {
      case 'manage':
        return <ManageDomain />;
      case 'diff':
        return <DiffProfiles />;
      case 'sync':
        return <SyncLists />;
      case 'copy':
        return <CopyProfile />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brand}>
            <h1>NextDNS Manager</h1>
            <span className={styles.profileCount}>
              {profiles.length} profile{profiles.length !== 1 ? 's' : ''}
            </span>
          </div>
          <Button variant="ghost" size="small" onClick={logout}>
            Disconnect
          </Button>
        </div>
      </header>

      <nav className={styles.nav}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.tabHeader}>
          <h2>{TABS.find((t) => t.id === activeTab)?.label}</h2>
          <p>{TABS.find((t) => t.id === activeTab)?.description}</p>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
