import express from 'express';
import { signup, login } from '../controllers/authController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [student, faculty]
 *               program:
 *                 type: string
 *                 description: Program name (required for students)
 *               semester:
 *                 type: integer
 *                 description: Semester (required for students)
 *               programs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Program names (required for faculty)
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Course codes (required for faculty)
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/signup', signup);
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in a user and receive a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', login);




export default router;
