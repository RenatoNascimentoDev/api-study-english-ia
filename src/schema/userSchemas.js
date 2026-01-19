import * as yup from 'yup';

export const createLocalSchema = yup.object({
    name: yup.string().trim().min(2).required(),
    email: yup.string().trim().lowercase().email().required(),
    password: yup.string().min(6).required(),
});

export const createGoogleSchema = yup.object({
    name: yup.string().trim().min(2).required(),
    email: yup.string().trim().lowercase().email().notRequired(),
    googleId: yup.string().required(),
    avatarUrl: yup.string().url().notRequired(),
});

export const loginSchema = yup.object({
    email: yup.string().trim().lowercase().email().required(),
    password: yup.string().min(6).required(),
})

export const changePasswordSchema = yup.object({
    currentPassword: yup.string().min(6).required(),
    newPassword: yup.string().min(6).required(),
});