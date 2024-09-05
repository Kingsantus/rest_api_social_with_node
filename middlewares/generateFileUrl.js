const generateFileUrl = (filename) => {
    // generate the file name with website address
    // uploads folder and filename
    return process.env.URL+`/uploads/${filename}`;
}

module.exports = generateFileUrl;