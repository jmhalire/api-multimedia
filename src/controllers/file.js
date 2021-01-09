const fs = require('fs');
const mongoose = require('mongoose');
const File = require('../models/file');
const { Readable } = require('stream');
const ObjectId = mongoose.Types.ObjectId;

const uploadFile = async(req, res) => {
    console.log(req.user._conditions._id);
    try {
        const file = req.files.file;
        const name = req.body.filename;
        const size = req.body.size;
        const type = file.mimetype.split('/');

        const conn = mongoose.connection;
        let opts = {
            bucketName: 'archive'
        };

        const readableFileStream = new Readable();
        readableFileStream.push(file.data)
        readableFileStream.push(null);
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, opts);
        let uploadStream = bucket.openUploadStream(name);
        const id = uploadStream.id;

        //save in mongod
        let typefile = 'other';
        let ext = 'other';

        if (type[0] == 'video' || type[0] == 'audio' || type[0] == 'image' || type[1] == 'pdf') {
            if (type[1] == 'pdf') {
                typefile = type[1];
                ext = type[1]
            } else {
                typefile = type[0];
                ext = type[1];
            }
        }

        const newFile = new File({ user_id: req.user._conditions._id, id_bucket: id, name: name, type: typefile, ext: ext, size: size });
        await newFile.save();

        //save mongo
        readableFileStream.pipe(uploadStream);
        uploadStream.on('error', () => {
            return res.status(500).json({ message: 'Error upload your file' });
        })
        uploadStream.on('finish', () => {
            console.log('Archive successfully uploaded!');
        })
        return res.json({ message: 'Archive successfully uploaded!' })

    } catch (error) {
        return res.status(500).json(error);
    }
};


const getFileID = async(req, res) => {

    const file = await File.findOne({ id_bucket: req.params.id });
    if (file) {
        const ext = file.ext;
        const existServer = fs.existsSync(`./src/public/archives/${req.params.id}.${ext}`);
        if (existServer) {
            return res.json({ path: `archives/${req.params.id}.${ext}` });
        } else {
            let fileID = ObjectId(req.params.id);

            const db = mongoose.connection.db;
            let opts = {
                bucketName: 'archive'
            };

            const bucket = new mongoose.mongo.GridFSBucket(db, opts);

            bucket.openDownloadStream(fileID).
            pipe(fs.createWriteStream(`src/public/archives/${fileID}.${ext}`))
                .on('error', function(error) {
                    console.log(":::error");
                    assert.ifError(error);
                })
                .on('finish', function() {
                    console.log('finish!');
                    return res.json({ path: '' });
                });

        }
    } else {
        return res.status(500).json({ message: `Error Id = ${req.params.id}` })
    };
}

const getFiles = async(req, res) => {
    const archive = await File.find({ user_id: req.user._conditions._id });
    return res.json({ archive });
}

const editfile = async(req, res) => {
    const { id, name } = req.body;
    const fileUpdate = await File.findByIdAndUpdate(id, { name: name });
    return res.json({ message: 'file edit successfully' })
}

const deletefile = async(req, res) => {
    const ids_file = req.body;
    if (ids_file) {
        await File.findByIdAndDelete(ids_file.id);
        const db = mongoose.connection.db;
        let opts = {
            bucketName: 'archive'
        };

        const bucket = new mongoose.mongo.GridFSBucket(db, opts);

        const id = ObjectId(ids_file.id_bucket)
        await bucket.delete(ObjectId(id));

        return res.json({ message: 'file delete succesfully' });

    } else {
        return res.json({ message: 'file not delete' })
    }
}

module.exports = { uploadFile, getFileID, getFiles, editfile, deletefile };