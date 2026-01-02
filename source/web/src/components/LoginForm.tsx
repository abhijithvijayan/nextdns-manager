'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import styles from './LoginForm.module.scss';

export function LoginForm() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    setIsLoading(true);
    setError('');

    const success = await login(apiKey.trim());

    if (!success) {
      setError('Invalid API key. Please check and try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>NextDNS Manager</h1>
          <p className={styles.subtitle}>
            Bulk manage your NextDNS profiles with ease
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your NextDNS API key"
            error={error}
            hint={
              <span>
                Get your API key from{' '}
                <a
                  href="https://my.nextdns.io/account"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  my.nextdns.io/account
                </a>
              </span>
            }
            fullWidth
            autoFocus
          />

          <Button type="submit" isLoading={isLoading} fullWidth size="large">
            Connect
          </Button>
        </form>

        <div className={styles.features}>
          <h4>Features</h4>
          <ul>
            <li>Manage domains across all profiles</li>
            <li>Compare profile settings side by side</li>
            <li>Sync allowlists and denylists</li>
            <li>Clone profiles to other accounts</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
