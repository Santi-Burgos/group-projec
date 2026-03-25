import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from '../middlewares/cors.js';

export const setupMiddlewares = (app, io) => {
  app.use(cookieParser());
  app.use(corsMiddleware());
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    req.io = io;
    next();
  });
};