import pg from "pg";
import { config } from "../config.js";

// postgre
const Pgclient = new pg.Client({
  user: config.db.bcs_user,
  host: config.db.bcs_host,
  database: config.db.bcs_database,
  password: config.db.bcs_password,
  port: config.db.port,
});

Pgclient.connect();

export async function DbPlay(query, info) {
  try {
    let data = await Pgclient.query(query, info);
    return data.rows;
  } catch (err) {
    throw err;
  }
}
