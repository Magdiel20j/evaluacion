import { Schema, model } from 'mongoose';

const emergencyContactSchema = new Schema({
    phone: { type: String, required: true },
    nameEmergencyContact: { type: String, required: true }
}, { _id: false });

const pacienteSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    phoneEmergencyContacts: [emergencyContactSchema],
    profilePhoto: { type: String, default: '' },
    public_id: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    timeOut: { type: Date, default: null }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Paciente', pacienteSchema);