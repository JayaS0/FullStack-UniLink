import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import programRoutes from './routes/programRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';



dotenv.config();

const app = express();  // **Initialize app first**

app.use(morgan("dev")); // "dev" gives colored concise output in console

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Swagger/OpenAPI setup
const swaggerServerUrl = process.env.SWAGGER_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FullStack-UniLink API',
      version: '1.0.0',
      description: 'API documentation for FullStack-UniLink backend'
    },
    servers: [
      { url: swaggerServerUrl }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './server.js',
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Then use your routes AFTER app is initialized
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/schools', schoolRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check
 *     description: Returns a simple confirmation that the API is running.
 *     responses:
 *       200:
 *         description: API is running.
 */
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
