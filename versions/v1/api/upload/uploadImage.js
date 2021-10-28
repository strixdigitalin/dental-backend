const express = require("express");
const router = express.Router();
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const upload = require('../../configs/multer')

let uploadImage = upload.single('image')

router.post('/image', async (req, res, next) => {
    try {
        uploadImage(req, res, async function (err) {
            if (err) {
                return res.status(500).json({
                    error: {
                        message: err.message
                    }
                })
            } else {
                if (req.file) {
                    cloudinary.uploader.upload(
                        req.file.path,
                        { public_id: `Varlyq/dworld/${req.file.originalname}`, tags: `dworld` }, // directory and tags are optional
                    ).then(result => {
                        res.status(200).json({
                            url: result.secure_url
                        });
                    }).catch(error => {
                        return res.status(500).json({
                            error: {
                                message: error.message
                            }
                        })
                    });
                } else {
                    res.status(500).json({
                        error: {
                            message: "File Not Found"
                        }
                    })
                }
            }
        })
    } catch (error) {
        next(error)
    }
});

module.exports = router;