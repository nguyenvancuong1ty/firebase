const express = require('express');

const router = express.Router();
router.get('/', (req, res) => {
    res.send('<h1>Chào chúng mày</h1>');
});

router.get('/cake', async (req, res) => {
    try {
        const cakesRef = db.collection('products');
        // const querySnapshot = await getDocs(query(cakesRef, where('deleted', '==', false)));
        const querySnapshot = await cakesRef.where('deleted', '==', false).where('type', '==', req.query.type).get();
        const data = [];
        querySnapshot.forEach((doc) => {
            const cake = doc.data();
            const cakeWithDocId = {
                Id: doc.id,
                ...cake,
            };
            data.push(cakeWithDocId);
        });

        return res.json({
            count: data.length,
            userAgent: req.header('User-Agent'),
            data: data,
        });
    } catch (e) {
        return res.json(e.message);
    }
});
module.exports = router;
