import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger, errorLogger } from './middleware/logger.js';

// Routes
import authRoutes from './routes/auth.js';
import childrenRoutes from './routes/children.js';
import onboardingRoutes from './routes/onboarding.js';
import booksRoutes from './routes/books.js';
import missionsRoutes from './routes/missions.js';
import roadmapRoutes from './routes/roadmap.js';
import reportsRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (모든 요청 로깅)
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/missions', missionsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorLogger); // 에러 로깅 (에러 핸들러 전에)
app.use(errorHandler); // 에러 응답 처리

// Start server
// 0.0.0.0으로 바인딩하여 모든 네트워크 인터페이스에서 접근 가능하도록 설정
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 백엔드 서버가 시작되었습니다!');
  console.log('='.repeat(80));
  console.log(`📍 Port: ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Network Access: http://0.0.0.0:${PORT}/api`);
  console.log('='.repeat(80));
  console.log('💡 모든 요청과 응답이 로깅됩니다.');
  console.log('💡 모든 네트워크 인터페이스에서 접근 가능합니다.\n');
});

export default app;

