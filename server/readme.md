# Server

This project contains the backend which is built upon prisma and GraphQL.

## Get it running

This is using mysql as a database so you need to have mysql installed somewhere and execute the [schema.sql](./schema.sql) script. Make it publicly available so you can access the database from your backend.

To get this running you need to create a ".env" file and declare 3 environment variables: `HASH_SALT`, `JWT_SECRET` and `DB_URL`.<br />
`DB_URL` is going to be the connection string that tells prisma where to look for the database. The Syntax for this url looks like `mysql://user:password@host:port/database`. If your mysql instance is running on your localhost than it could look like this: `mysql://user:password@localhost:3306/prisma`
