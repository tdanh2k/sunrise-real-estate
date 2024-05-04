export const notFoundHandler = (request, response, next) => {
    const message = "Not Found";
    response.status(404).json({ message });
};
