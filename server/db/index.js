// import { Pool } from "pg";
const pg = require("pg");

const { Pool } = pg;

const pool = new Pool();
const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
};
