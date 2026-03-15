import postgres from "postgres";
async function main() {
  const sql = postgres(process.env.DATABASE_URL!);
  const r = await sql`SELECT short_id, email, selected_model, status FROM users ORDER BY created_at DESC LIMIT 20`;
  console.log(JSON.stringify(r, null, 2));
  await sql.end();
}
main();
