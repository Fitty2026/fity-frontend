import { execFileSync } from 'node:child_process';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const resolveCommitSha = () => {
  const configuredCommitSha = process.env.VITE_COMMIT_SHA?.trim();
  if (configuredCommitSha) return configuredCommitSha;

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
};

const frontendVersionPlugin = (): Plugin => ({
  name: 'fitty-frontend-version',
  apply: 'build',
  generateBundle() {
    const commitSha = resolveCommitSha();
    this.emitFile({
      type: 'asset',
      fileName: 'version.json',
      source: `${JSON.stringify({
        service: 'frontend',
        commitSha,
        commitShort: commitSha.slice(0, 7),
      }, null, 2)}\n`,
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), frontendVersionPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
