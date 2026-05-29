import { describe, expect, it } from 'vitest';

import { isDisplayableMcpAgentSource, sanitizeMcpAgentInstallStatus } from '@/renderer/hooks/mcp/mcpAgentStatusUtils';

describe('mcpAgentStatusUtils', () => {
  it('hides the internal PanAI config source from install status', () => {
    expect(isDisplayableMcpAgentSource('panai')).toBe(false);
    expect(isDisplayableMcpAgentSource('PanAI')).toBe(false);
    expect(isDisplayableMcpAgentSource('claude')).toBe(true);
  });

  it('removes PanAI from cached agent install status', () => {
    expect(
      sanitizeMcpAgentInstallStatus({
        'chrome-devtools': ['claude', 'panai', 'codex'],
        'db-only-server': ['panai'],
      })
    ).toEqual({
      'chrome-devtools': ['claude', 'codex'],
    });
  });
});
