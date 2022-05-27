import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Connect with server');
})

export default router