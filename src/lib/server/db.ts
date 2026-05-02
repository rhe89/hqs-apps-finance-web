/**
 * Server-only SQLite database for frontend-specific persistence.
 * Uses the built-in node:sqlite module (Node.js 22+) — no native compilation needed.
 * Stores favorites and user preferences — never exposed to the browser.
 */
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { env } from '$env/dynamic/private';

const dbPath = env.FINANCE_WEB_DB_PATH ?? env.SQLITE_DB_PATH ?? path.join(process.cwd(), 'data', 'finance-web.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    account_id    TEXT PRIMARY KEY,
    bank          TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    added_at      TEXT DEFAULT (datetime('now'))
  );
`);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Favorite {
accountId: string;
bank: string;
displayOrder: number;
addedAt: string;
}

// ── Queries ───────────────────────────────────────────────────────────────────

const getFavorites = db.prepare('SELECT * FROM favorites ORDER BY display_order ASC, added_at ASC');
const addFavorite = db.prepare('INSERT OR IGNORE INTO favorites (account_id, bank, display_order) VALUES (?, ?, ?)');
const removeFavorite = db.prepare('DELETE FROM favorites WHERE account_id = ?');
const countFavorites = db.prepare('SELECT COUNT(*) as count FROM favorites');
const reorderFavorite = db.prepare('UPDATE favorites SET display_order = ? WHERE account_id = ?');

function mapFavorite(row: { account_id: string; bank: string; display_order: number; added_at: string }): Favorite {
return { accountId: row.account_id, bank: row.bank, displayOrder: row.display_order, addedAt: row.added_at };
}

export const favoritesDb = {
getAll: (): Favorite[] =>
(getFavorites.all() as { account_id: string; bank: string; display_order: number; added_at: string }[]).map(mapFavorite),

add: (accountId: string, bank: string): { ok: boolean; error?: string } => {
const row = countFavorites.get() as { count: number };
if (row.count >= 10) return { ok: false, error: 'Maximum 10 favorites allowed.' };
addFavorite.run(accountId, bank, row.count);
return { ok: true };
},

remove: (accountId: string): void => {
removeFavorite.run(accountId);
},

reorder: (accountId: string, displayOrder: number): void => {
reorderFavorite.run(displayOrder, accountId);
}
};
