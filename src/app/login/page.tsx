'use client';

import PageLayout from '@/app/genericLayout';
import { Button, PasswordInput, SegmentedControl, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { clearCurrentUser, getCurrentUser, loginUser, registerUser, StoredUser } from '../lib/localStore';
import styles from './login.module.css';

export default function Login(): ReactNode {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setMessage('');

    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      setMessage('Enter a username and password.');
      return;
    }

    const user = mode === 'login'
      ? loginUser(cleanUsername, password)
      : registerUser(cleanUsername, password);

    if (!user) {
      setMessage(mode === 'login' ? 'Login details were not recognised.' : 'That username is already taken.');
      return;
    }

    setCurrentUser(user);
    router.push(user.role === 'admin' ? '/admin' : '/events');
  }

  function handleLogout(): void {
    clearCurrentUser();
    setCurrentUser(null);
    setMessage('You have been logged out.');
  }

  return (
    <PageLayout>
      <main className={styles.page}>
        <section className={styles.card}>
          <div>
            <h2>{currentUser ? 'Your account' : 'Login'}</h2>
            <p>
              Login to save your liked events. Admin users can also add new events.
            </p>
          </div>

          {currentUser ? (
            <div className={styles.accountPanel}>
              <p>
                Signed in as <strong>{currentUser.username}</strong> ({currentUser.role}).
              </p>
              <div className={styles.actions}>
                {currentUser.role === 'admin' && (
                  <Button component="a" href="/admin" className={styles.button}>
                    Admin page
                  </Button>
                )}
                <Button variant="light" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <SegmentedControl
                value={mode}
                onChange={setMode}
                data={[
                  { label: 'Login', value: 'login' },
                  { label: 'Register', value: 'register' },
                ]}
              />
              <TextInput
                label="Username"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
              <PasswordInput
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
              <Button type="submit" className={styles.button}>
                {mode === 'login' ? 'Login' : 'Create account'}
              </Button>
            </form>
          )}

          {message && <p className={styles.message}>{message}</p>}
          <p className={styles.hint}>Admin demo login: admin / admin123</p>
        </section>
      </main>
    </PageLayout>
  );
}
