import './dotenv';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { IS_DEV } from './utils';
import { errorHandler } from './error-handler/error-handler';

const app = express().disable('etag').disable('x-powered-by');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(helmet());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

if (IS_DEV) {
  app.use(cors());
}

// Routes
app.use(errorHandler());

// health check for Gateway
app.get('/', (req: Request, res: Response) => {
  res.send('Server is up and running');
});

// For SPA (TODO: maybe)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

export { app };
