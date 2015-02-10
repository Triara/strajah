module.exports = {
    strajah : {},
    req: {},
    res: {
        statusCode: 0,
        body: null,
        send: function(status,body) {
            this.statusCode = status;
            this.body = body
        }
    },
    chainCanContinue : null
};
