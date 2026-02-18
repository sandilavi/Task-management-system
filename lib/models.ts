import { Schema, model, models } from 'mongoose';

// User Schema
const UserSchema = new Schema({
  name: { 
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String,
    required: true
  },
}, { timestamps: true });

// Task Schema
const TaskSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String,
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed'], 
    default: 'pending' 
  },
}, { timestamps: true });

// Model Export
export const User = models.User || model('User', UserSchema);
export const Task = models.Task || model('Task', TaskSchema);
