const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
    user: 'your-postgres-username',
    host: 'your-postgres-host',
    database: 'your-database-name',
    password: 'bofrost',
    port: 5432
});

module.exports = pool;
