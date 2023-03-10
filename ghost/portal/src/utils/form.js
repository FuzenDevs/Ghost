import * as Validator from './validator';

export const FormInputError = ({field}) => {
    if (field.required && !field.value) {
        switch (field.name) {
        case 'name':
            return `Ingresa tu nombre`;
        
        case 'email':
            return `Ingresa tu correo electrónico`;

        default:
            return `Por favor ingresa ${field.name}`;
        }
    }

    if (field.type === 'email' && !Validator.isValidEmail(field.value)) {
        return `Correo electrónico no válido`;
    }
    return null;
};

export const ValidateInputForm = ({fields}) => {
    const errors = {};
    fields.forEach((field) => {
        const name = field.name;
        const fieldError = FormInputError({field});
        errors[name] = fieldError;
    });
    return errors;
};