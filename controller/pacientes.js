import jsonwebtoken from 'jsonwebtoken';
import { cloudinary } from '../utils/cloudinary.js';
import pacientesModel from '../models/pacientes.js';

export const processLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const record = await pacientesModel.findOne({ email });

        if (!record) {
            return res.status(404).json({ message: 'Paciente No Encontrado' });
        }

        if (password !== record.password) {
            return res.status(400).json({ message: 'Contraseña Incorrecta' });
        }

        const userToken = jsonwebtoken.sign(
            { id: record._id, userType: 'paciente' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.cookie('AuthCookie', userToken, { httpOnly: true });
        return res.status(200).json({ message: 'Login Exitoso' });

    } catch (err) {
        console.log('error' + err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const processLogout = (req, res) => {
    try {
        res.clearCookie('AuthCookie');
        return res.status(200).json({ message: 'Sesion Cerrada' });
    } catch (err) {
        console.log('error' + err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const fetchAllRecords = async (req, res) => {
    try {
        const data = await pacientesModel.find();
        return res.status(200).json(data);
    } catch (err) {
        console.log('error' + err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const removeRecord = async (req, res) => {
    try {
        const target = await pacientesModel.findById(req.params.id);

        if (!target) {
            return res.status(404).json({ message: 'Paciente No Encontrado' });
        }

        if (target.public_id) {
            await cloudinary.uploader.destroy(target.public_id);
        }

        await pacientesModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Paciente Eliminado Correctamente' });
    } catch (err) {
        console.log('error' + err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const modifyRecord = async (req, res) => {
    try {
        const { name, lastName, email, password, phone, address, phoneEmergencyContacts } = req.body;
        const target = await pacientesModel.findById(req.params.id);

        if (!target) {
            return res.status(404).json({ message: 'Paciente No Encontrado' });
        }

        const dataToUpdate = {
            name,
            lastName,
            email,
            password,
            phone,
            address,
            phoneEmergencyContacts
        };

        if (req.file) {
            if (target.public_id) {
                await cloudinary.uploader.destroy(target.public_id);
            }
            dataToUpdate.profilePhoto = req.file.path;
            dataToUpdate.public_id = req.file.filename;
        }

        await pacientesModel.findByIdAndUpdate(
            req.params.id,
            dataToUpdate,
            { new: true }
        );

        return res.status(200).json({ message: 'Paciente Actualizado Correctamente' });
    } catch (err) {
        console.log('error' + err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};