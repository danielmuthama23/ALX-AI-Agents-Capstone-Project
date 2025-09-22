"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const taskRoutes_1 = __importDefault(require("./taskRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const router = express_1.default.Router();
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
router.use('/auth', authRoutes_1.default);
router.use('/tasks', taskRoutes_1.default);
router.use('/users', userRoutes_1.default);
router.use('*', (req, res) => {
    res.status(404).json({
        message: 'API endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map