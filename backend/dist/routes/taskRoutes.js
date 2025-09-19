"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.get('/', taskController_1.getTasks);
router.get('/stats/overview', taskController_1.getTaskStats);
router.get('/due-soon', taskController_1.getDueSoonTasks);
router.get('/:id', taskController_1.getTask);
router.post('/', validation_1.validateTask, taskController_1.createTask);
router.put('/:id', validation_1.validateTask, taskController_1.updateTask);
router.delete('/:id', taskController_1.deleteTask);
router.patch('/:id/toggle', taskController_1.toggleTaskCompletion);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map