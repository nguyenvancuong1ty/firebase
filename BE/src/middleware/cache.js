const { createClient } = require('redis');

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
const cache = async (req, res, next) => {
    try {
        !client.isOpen && (await client.connect());
        const key = '__express__' + (req.originalUrl || req.url);
        console.log(key);
        const data = await client.get(key);

        if (data) {
            await client.disconnect();
            return res.json({
                count: JSON.parse(data).length,
                userAgent: req.header('User-Agent'),
                data: JSON.parse(data),
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        await client.disconnect();
    }
};
const deleteCache = async () => {
    await client.connect();
    await client.del();
};
module.exports = { cache, client };
