import React from 'react';
import styles from './styles.module.css';

type ClientType = 'claude' | 'cursor' | 'windsurf';

interface MCPInstallButtonsProps {
  /** The MCP server URL for deep links */
  mcpServerUrl?: string;
  /** The hosted .mcpb file URL for Claude Desktop */
  mcpbUrl?: string;
  /** Show only specific clients */
  clients?: ClientType[];
  /** Compact mode for inline usage */
  compact?: boolean;
  /** Show title header */
  showHeader?: boolean;
}

const CLIENT_CONFIG: Record<ClientType, {
  name: string;
  icon: JSX.Element;
  color: string;
  getUrl: (mcpbUrl: string, mcpServerUrl: string, name: string) => string;
  description: string;
}> = {
  claude: {
    name: 'Claude Desktop',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: '#D97706',
    getUrl: (mcpbUrl) => mcpbUrl,
    description: 'Download bundle',
  },
  cursor: {
    name: 'Cursor',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
        <path d="M13.325 3.05L8.667 20.432l1.932.518 4.658-17.382-1.932-.518zM7.612 18.36l1.36-1.448-.001-.019-5.094-4.78 5.095-4.779-.001-.02-1.36-1.447-6.482 6.245 6.483 6.247zM16.388 18.36l6.482-6.248-6.482-6.246-1.36 1.447-.001.02 5.095 4.779-5.095 4.78-.001.019 1.362 1.448z"/>
      </svg>
    ),
    color: '#00D4AA',
    getUrl: (_, mcpServerUrl, name) =>
      `cursor://install-mcp?url=${encodeURIComponent(mcpServerUrl)}&name=${encodeURIComponent(name)}`,
    description: 'One-click install',
  },
  windsurf: {
    name: 'Windsurf',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
        <path d="M3 17l6-6 4 4 8-8"/>
        <path d="M14 7h7v7"/>
      </svg>
    ),
    color: '#3B82F6',
    getUrl: (_, mcpServerUrl, name) =>
      `windsurf://install-mcp?url=${encodeURIComponent(mcpServerUrl)}&name=${encodeURIComponent(name)}`,
    description: 'One-click install',
  },
};

export default function MCPInstallButtons({
  mcpServerUrl = 'https://mcp.lanonasis.com/mcp',
  mcpbUrl = '/install.mcpb',
  clients = ['claude', 'cursor', 'windsurf'],
  compact = false,
  showHeader = true,
}: MCPInstallButtonsProps): JSX.Element {
  const serverName = 'Lanonasis';

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      {showHeader && !compact && (
        <div className={styles.header}>
          <h3 className={styles.title}>One-Click Install</h3>
          <p className={styles.subtitle}>
            Add Lanonasis MCP to your AI assistant
          </p>
        </div>
      )}

      <div className={styles.buttons}>
        {clients.map((clientId) => {
          const client = CLIENT_CONFIG[clientId];
          const url = client.getUrl(mcpbUrl, mcpServerUrl, serverName);

          return (
            <a
              key={clientId}
              href={url}
              className={styles.button}
              style={{ '--client-color': client.color } as React.CSSProperties}
              download={clientId === 'claude' ? 'lanonasis-mcp.mcpb' : undefined}
              target={clientId !== 'claude' ? '_self' : undefined}
            >
              <span className={styles.iconWrapper}>{client.icon}</span>
              <span className={styles.buttonContent}>
                <span className={styles.buttonName}>{client.name}</span>
                {!compact && (
                  <span className={styles.buttonDesc}>{client.description}</span>
                )}
              </span>
              <span className={styles.arrow}>→</span>
            </a>
          );
        })}
      </div>

      {!compact && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Manual setup: <code>{mcpServerUrl}</code>
          </p>
        </div>
      )}
    </div>
  );
}
