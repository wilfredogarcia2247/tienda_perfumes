import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS mensajes (
        id SERIAL PRIMARY KEY,
        texto VARCHAR(255)
      );
    `);

    await client.query("INSERT INTO mensajes (texto) VALUES ($1)", ["Hola Neon desde Next.js"]);

    const result = await client.query("SELECT * FROM mensajes");

    client.release();

    return NextResponse.json({ data: result.rows });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en la base de datos", detail: error.message },
      { status: 500 }
    );
  }
}
