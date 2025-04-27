import { Model, model, models, Schema } from 'mongoose';

export interface IUser {
    name: string,
    email: string,
    password: string,
    isVerified:boolean,
    role: string,
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, required: true, default: 'user' },
}, { timestamps: true });

const User = models?.user as Model<IUser> || model('user', UserSchema);

export default User;