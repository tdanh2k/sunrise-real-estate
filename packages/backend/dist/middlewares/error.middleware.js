import { InsufficientScopeError, InvalidTokenError, UnauthorizedError, } from "express-oauth2-jwt-bearer";
export const errorHandler = (error, request, response, next) => {
    request;
    next;
    if (error instanceof InsufficientScopeError) {
        const message = "Permission denied";
        response.status(error.status).json({ message });
        return;
    }
    if (error instanceof InvalidTokenError) {
        const message = "Bad credentials";
        response.status(error.status).json({ message });
        return;
    }
    if (error instanceof UnauthorizedError) {
        const message = "Requires authentication";
        response.status(error.status).json({ message });
        return;
    }
    const status = 500;
    const message = error;
    console.log({ message });
    response.status(status).json({ message });
    //return next()
};
