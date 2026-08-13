import React, { useState } from 'react';
import { PERSONAS, matchPersonaAccount, useChatContext } from '../agentic';

export default function LoginPage() {
  const { login } = useChatContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const fillAccount = (cfg) => {
    setSelectedId(cfg.id);
    setUsername(cfg.username);
    setPassword(cfg.password);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const account = matchPersonaAccount(username, password);
    if (!account) {
      setError('Username and password must both match a persona name.');
      return;
    }
    login(account.id);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-mark">RP</span>
          <div>
            <h1>Welcome back</h1>
            <p>Sign in to Vision AI</p>
          </div>
        </div>

        <div className="login-accounts" role="list">
          {Object.values(PERSONAS).map((cfg) => (
            <button
              key={cfg.id}
              type="button"
              role="listitem"
              className={`login-account ${selectedId === cfg.id ? 'active' : ''}`}
              onClick={() => fillAccount(cfg)}
            >
              <span
                className="login-account-avatar"
                style={{ borderColor: cfg.color, background: `${cfg.color}18` }}
                aria-hidden
              >
                {cfg.icon}
              </span>
              <span className="login-account-copy">
                <strong>{cfg.shortLabel}</strong>
                <span>{cfg.role}</span>
              </span>
            </button>
          ))}
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Leadership"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Leadership"
            />
          </label>
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="login-submit">
            Sign in
          </button>
        </form>

        <p className="login-hint">Username and password are the persona name.</p>
      </div>
    </div>
  );
}
