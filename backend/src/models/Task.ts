import mongoose, { Document, Schema } from 'mongoose';

/**
 * @interface ITask
 * @description Interface representing a Task document in MongoDB
 */
export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/**
 * Task Schema definition
 */
const TaskSchema: Schema = new Schema(
  {
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
        validator: function(value: Date) {
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Index for better query performance
TaskSchema.index({ userId: 1, completed: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: 1 });
TaskSchema.index({ userId: 1, category: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });

// Middleware to set completedAt when task is marked as completed
TaskSchema.pre('save', function(next) {
  if (this.isModified('completed') && this.completed && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.isModified('completed') && !this.completed && this.completedAt) {
    this.completedAt = undefined;
  }
  next();
});

// Static method to find overdue tasks
TaskSchema.statics.findOverdueTasks = function(userId: mongoose.Types.ObjectId) {
  return this.find({
    userId,
    completed: false,
    dueDate: { $lt: new Date() }
  });
};

// Static method to find tasks due soon
TaskSchema.statics.findDueSoonTasks = function(userId: mongoose.Types.ObjectId, days: number = 7) {
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

// Instance method to get task status
TaskSchema.methods.getStatus = function(): string {
  if (this.completed) return 'completed';
  if (this.dueDate && this.dueDate < new Date()) return 'overdue';
  if (this.dueDate && this.dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) return 'due-soon';
  return 'pending';
};

export default mongoose.model<ITask>('Task', TaskSchema);