// Server-side GitHub Auto-Sync Module for Law & Legacy
// Synchronizes SQLite database state, site content, events, slides, and settings to GitHub via GitHub REST API

import fs from 'fs';
import path from 'path';
import db from './db.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || 'mahbubumithu/lawandlegacy_v2.0';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// Debounce timer to avoid multiple commits on rapid edits
let syncTimeout = null;

/**
 * Exports current database data to clean JSON snapshots
 */
export function exportDatabaseSnapshot() {
  const contentRows = db.prepare('SELECT section, key, value FROM site_content ORDER BY section, key').all();
  const groupedContent = {};
  for (const row of contentRows) {
    if (!groupedContent[row.section]) groupedContent[row.section] = {};
    try {
      groupedContent[row.section][row.key] = JSON.parse(row.value);
    } catch {
      groupedContent[row.section][row.key] = row.value;
    }
  }

  const events = db.prepare('SELECT * FROM events ORDER BY created_at DESC').all();
  const slides = db.prepare('SELECT * FROM slides ORDER BY display_order ASC, created_at ASC').all();
  const settings = db.prepare('SELECT key, value FROM admin_settings').all();

  return {
    last_synced_at: new Date().toISOString(),
    site_content: groupedContent,
    events,
    slides,
    settings,
  };
}

/**
 * Creates or updates a file in GitHub repository using GitHub Contents API
 */
async function commitFileToGitHub(filePath, fileContentBase64, commitMessage) {
  if (!GITHUB_TOKEN) {
    console.log('[GitHub Sync] Skipped: GITHUB_TOKEN environment variable is not configured.');
    return { skipped: true, reason: 'No GITHUB_TOKEN' };
  }

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'LawAndLegacy-SyncEngine/1.0',
    'Content-Type': 'application/json',
  };

  let sha = undefined;

  // Check if file exists to retrieve current SHA
  try {
    const getRes = await fetch(`${url}?ref=${GITHUB_BRANCH}`, { headers });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch (err) {
    console.warn('[GitHub Sync] Error checking existing file sha:', err.message);
  }

  const body = {
    message: commitMessage,
    content: fileContentBase64,
    branch: GITHUB_BRANCH,
  };
  if (sha) {
    body.sha = sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    console.error(`[GitHub Sync] Failed to commit ${filePath}:`, errText);
    throw new Error(`GitHub API error: ${putRes.status} ${errText}`);
  }

  const result = await putRes.json();
  console.log(`[GitHub Sync] Successfully committed ${filePath} (commit: ${result.commit?.sha?.substring(0, 7)})`);
  return result;
}

/**
 * Triggers asynchronous sync with debouncing (default 3 seconds)
 */
export function triggerGitHubSync(reason = 'Site content updated') {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(async () => {
    try {
      console.log(`[GitHub Sync] Initiating automatic sync to ${GITHUB_REPO} on branch ${GITHUB_BRANCH} (${reason})...`);
      const snapshot = exportDatabaseSnapshot();
      const snapshotJson = JSON.stringify(snapshot, null, 2);
      const snapshotBase64 = Buffer.from(snapshotJson, 'utf-8').toString('base64');

      // Commit data snapshot to data/database_backup.json in GitHub
      await commitFileToGitHub(
        'data/database_backup.json',
        snapshotBase64,
        `Auto-sync from live site: ${reason} [skip render]`
      );
    } catch (err) {
      console.error('[GitHub Sync] Error during automatic GitHub sync:', err.message);
    }
  }, 3000);
}

/**
 * Direct file upload synchronization (e.g. for slide images uploaded via admin)
 */
export async function syncImageFileToGitHub(relativeFilePath, fileBuffer, commitMessage) {
  if (!GITHUB_TOKEN) {
    return;
  }

  try {
    const base64Content = fileBuffer.toString('base64');
    await commitFileToGitHub(
      relativeFilePath,
      base64Content,
      commitMessage || `Upload asset: ${relativeFilePath} [skip render]`
    );
  } catch (err) {
    console.error(`[GitHub Sync] Error syncing image ${relativeFilePath} to GitHub:`, err.message);
  }
}

