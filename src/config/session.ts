import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const PgSession = connectPgSimple(session);

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URI as string,
    ssl: { rejectUnauthorized: false },
});

const isProduction = process.env.NODE_ENV === "production";

export const sessionMiddleware = session({
    store: new PgSession({
        pool,
        tableName: "sessions",
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 1000 * 60 * 60 * 24
    },
});