const RequestError = require('./RequestError');

function ExceptionHandler(
    error,
    _request,
    response,
    _nextFunction
) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    if (error instanceof RequestError) {
        return response
            .status(error.statusCode)
            .json({ message: error.message });
    }

    return response.status(500).json({ message: 'Internal Server Error' });
};
module.exports = ExceptionHandler;