import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || '');

const reassigned = [
  { pattern: 'user_39fGbuk', newVpsIp: '178.156.252.255:19003' },
  { pattern: 'user_3A8Yhwy', newVpsIp: '178.156.252.255:19004' },
  { pattern: 'user_3A5j1eR', newVpsIp: '178.156.252.255:19005' },
  { pattern: 'user_39tQ67G', newVpsIp: '178.156.252.255:19009' },
];

for (const r of reassigned) {
  const rows = await sql`SELECT id, clerk_id, vps_ip FROM users WHERE clerk_id LIKE ${r.pattern + '%'}`;
  if (rows.length === 0) { console.log('NOT FOUND:', r.pattern); continue; }
  for (const row of rows) {
    await sql`UPDATE users SET vps_ip = ${r.newVpsIp} WHERE id = ${row.id}`;
    console.log('✅ Updated:', row.clerk_id?.slice(0, 20), '|', row.vps_ip, '→', r.newVpsIp);
  }
}
console.log('DB update done');
