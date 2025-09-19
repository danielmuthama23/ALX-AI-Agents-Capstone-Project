"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.get('/profile', userController_1.getUserProfile);
router.put('/profile', userController_1.updateUserProfile);
router.delete('/account', userController_1.deleteUserAccount);
router.get('/activity', userController_1.getUserActivity);
router.get('/export', userController_1.exportUserData);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map