class RequestError {
      message;
      statusCode;

    constructor(message ="Bad Request", statusCode = 400) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = RequestError;