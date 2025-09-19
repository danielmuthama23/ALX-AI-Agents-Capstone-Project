"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const TaskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters'],
        minlength: [1, 'Title must be at least 1 character']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
        default: ''
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return !value || value > new Date();
            },
            message: 'Due date must be in the future'
        }
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        default: 'uncategorized',
        trim: true,
        maxlength: [50, 'Category cannot exceed 50 characters']
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
TaskSchema.index({ userId: 1, completed: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: 1 });
TaskSchema.index({ userId: 1, category: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.pre('save', function (next) {
    if (this.isModified('completed') && this.completed && !this.completedAt) {
        this.completedAt = new Date();
    }
    else if (this.isModified('completed') && !this.completed && this.completedAt) {
        this.completedAt = undefined;
    }
    next();
});
TaskSchema.statics.findOverdueTasks = function (userId) {
    return this.find({
        userId,
        completed: false,
        dueDate: { $lt: new Date() }
    });
};
TaskSchema.statics.findDueSoonTasks = function (userId, days = 7) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    return this.find({
        userId,
        completed: false,
        dueDate: {
            $gte: startDate,
            $lte: endDate
        }
    });
};
TaskSchema.methods.getStatus = function () {
    if (this.completed)
        return 'completed';
    if (this.dueDate && this.dueDate < new Date())
        return 'overdue';
    if (this.dueDate && this.dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        return 'due-soon';
    return 'pending';
};
exports.default = mongoose_1.default.model('Task', TaskSchema);
//# sourceMappingURL=Task.js.map