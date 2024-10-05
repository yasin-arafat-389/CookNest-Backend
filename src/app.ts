/* eslint-disable no-undef */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/utils/globalErrorHandler/globalErrorHandler';
import router from './app/routes';
import bodyParser from 'body-parser';

const app: Application = express();

//parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://cook-nest-client.vercel.app'],
    credentials: true,
  }),
);

// application routes
app.use('/api/v1/', router);

// Global error handler
app.use(globalErrorHandler);

// Catch all middleware for handling undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
