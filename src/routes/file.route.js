const { Router } = require('express');
const { uploadFile, getFileID, getFiles, editfile, deletefile } = require('../controllers/file')
const { authenticate } = require('../controllers/passport');

const router = Router();

router.get('/', (req, res) => {
    res.set('content-type', 'text/html');
    res.render('index.html')
});

router.post('/upload', authenticate, uploadFile);

router.get('/files', authenticate, getFiles);

router.get('/file/:id', authenticate, getFileID);

router.post('/edit', authenticate, editfile);
router.post('/delete', authenticate, deletefile);


module.exports = router;