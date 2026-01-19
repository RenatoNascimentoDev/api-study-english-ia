const formatYupErrors = (validationError) => {
    const errorList = validationError.inner?.length
        ? validationError.inner
        : [validationError];

    return errorList.map((errorItem) => ({
        field: errorItem.path ?? 'body',
        message: errorItem.message,
    }));
};

export const validate = (schema) => async (req, res, next) => {
    try {
        req.body = await schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        return next();
    } catch (err) {
        const details = formatYupErrors(err);
        return res.status(400).json({ error: 'Validation error', details });
    }
};
