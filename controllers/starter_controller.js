exports.getStart = async (req, res) => {

    return res.status(200).json({
        status: true,
        message: "Welcome to Starter API!!",
    });


};