"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.get('/me', auth_1.authenticate, authController_1.getProfile);
router.put('/profile', auth_1.authenticate, authController_1.updateProfile);
router.put('/password', auth_1.authenticate, authController_1.changePassword);
router.post('/logout', auth_1.authenticate, authController_1.logout);
router.get('/check-email', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email parameter is required' });
        }
        const existingUser = await User_1.default.findOne({ email: email });
        return res.json({ available: !existingUser });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
router.get('/check-username', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ message: 'Username parameter is required' });
        }
        const existingUser = await User_1.default.findOne({ username: username });
        return res.json({ available: !existingUser });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map