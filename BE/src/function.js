const {
    query,
    where,
    updateDoc,
    serverTimestamp,
    deleteDoc,
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
} = require('firebase/firestore');
const { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } = require('firebase/auth');
const { db, auth, Timestamp } = require('./firebase');
const fs = require('fs');
const path = require('path');

const bcrypt = require('bcryptjs');
// Create

const addOrder = async (req, res) => {
    try {
        const list = [
            '9W4hJVtmthd8f4L2FmCY',
            'DuSw7deZWRah7lfShmlw',
            'KTwNeB3uriEYjz5MgDzP',
            'O05t1Nhfbyo2TqHVnBqw',
            'O8fTY2mKKRB0aKFkpA7S',
            'QFOi9cKmFdjpIBTTNmnY',
            'eHhrYwyX8WBtNexzLdS8',
            'hl8iBndqNO1nK8dkspTj',
            '0i0bSGInltaOt33sWMh9',
            '2tLZ0Q4dBMTpJZ5I7nYM',
        ];
        const filePath = path.join(__dirname, 'data.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                res.status(500).send('Error reading JSON file');
                return;
            } else {
                const jsonData = JSON.parse(data);
                const newData = jsonData.order;
                Array.isArray(newData) &&
                    newData.length > 0 &&
                    newData.map(async (item) => {
                        await addDoc(collection(db, 'order'), {
                            id_user: list[Math.floor(Math.random() * 10)],
                            total_amount: Math.floor(Math.random() * 100000),
                            shipping_address: item.shipping_address,
                            status: item.status,
                            weight: Math.floor(Math.random() * 10 + 1),
                            shipping_cost: Math.floor(Math.random() * 10000),
                            order_date: Date.now(),
                            deleted: false,
                        });
                    });
                return res.json('add data success');
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    // Đọc tệp tin JSON
};
// Middleware
const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Missing authentication token.' });
    }

    try {
        verifyIdToken(auth, token)
            .then((decodedToken) => {
                const uid = decodedToken.uid;
                console.log(uid);

                // Continue with the rest of your code
                const users = 0;

                if (users.length === 0) {
                    throw new Error('Invalid or expired token.');
                }

                req.user = users[0];
                next();
            })
            .catch((error) => {
                throw new Error('Invalid or expired token.');
            });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: error.message });
    }
};
const addCake = async (req, res) => {
    try {
        await addDoc(collection(db, 'cart'), {
            uid,
            cakeID,
            quantity: 1,
            deleted: false,
        });

        return res.json('create success');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Add cake by json file
const addAccounts = async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                res.status(500).send('Error reading JSON file');
                return;
            } else {
                const jsonData = JSON.parse(data);
                const newData = jsonData.account;
                Array.isArray(newData) &&
                    newData.length > 0 &&
                    newData.map(async (item) => {
                        const hash = bcrypt.hashSync(item.password, 8);
                        await addDoc(collection(db, 'account'), {
                            username: item.username,
                            password: hash,
                            active: item.active,
                            fullName: item.fullName,
                            address: item.address,
                            age: item.age,
                            salary: item.salary,
                            type_account: item.type_account,
                            timeCreate: serverTimestamp(),
                            deleted: false,
                        });
                    });
                return res.json('add data success');
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    // Đọc tệp tin JSON
};

const addCakes = async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                res.status(500).send('Error reading JSON file');
                return;
            } else {
                const jsonData = JSON.parse(data);
                const newData = jsonData.product;
                Array.isArray(newData) &&
                    newData.length > 0 &&
                    newData.map(async (item) => {
                        await db.collection('products').add({
                            name: item.name,
                            detail: item.detail,
                            quantity: item.quantity,
                            price: item.price,
                            sold: item.sold,
                            inventory: item.inventory,
                            weight: item.weight,
                            images: item.images,
                            type: item.type,
                            timeCreate: Timestamp.fromDate(new Date()),
                            deleted: false,
                        });
                    });
                return res.json('add data success');
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    // Đọc tệp tin JSON
};

// Read
const getCake = async (req, res) => {
    try {
        const cakesRef = collection(db, 'cakes');
        const querySnapshot = await getDocs(query(cakesRef, where('deleted', '==', false))); // Replace "fieldName" with the field you want to order by

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
};

// Update

const updateCake = async (req, res) => {
    try {
        const { id, nameCake, price, quantity } = req.body;

        await updateDoc(doc(db, 'cart', id), {
            nameCake,
            price,
            quantity,
            timeUpdate: serverTimestamp(),
        });

        return res.json('update success');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update

const deleteCake = async (req, res) => {
    try {
        const { id } = req.body;
        await deleteDoc(doc(db, 'cart', id));
        return res.json('deleted!');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// const login = async (req, res) => {
//   // connectAuthEmulator(auth, "http://localhost:9099");
//   const { email, password } = req.body;
//   await signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       return res.json({
//         message: "login",
//         data: user,
//       });
//       // ...
//     })
//     .catch((error) => {
//       return res.status(401).json({ Error: error.message });
//     });
// };
const login = async (req, res) => {
    const { email, password } = req.body;
    const accountQuery = query(
        collection(db, 'account'),
        where('username', '==', email),
        where('password', '==', password),
    );
    const data = [];
    const querySnapshot = await getDocs(accountQuery);
    querySnapshot.docs.map(async (doc) => {
        const account = doc.data();
        data.push({ Id: doc.id, ...account });
    });
    if (Array.isArray(data) && data.length > 0) {
        return res.json({
            message: 'login',
            data: data[0],
        });
        // ...
    } else {
        return res.status(401).json({ Error: 'Invalid email or password' });
    }
};
const register = async (req, res) => {
    const { email, password } = req.body;
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            return res.json(user);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return res.json({ status: errorCode, message: errorMessage });
            // ..
        });
};

const getCartbyUser = async (req, res) => {
    const { uid } = req.params;
    try {
        const cartQuery = query(collection(db, 'cart'), where('uid', '==', uid), where('deleted', '==', false));
        const querySnapshot = await getDocs(cartQuery);
        const data = [];

        await Promise.all(
            querySnapshot.docs.map(async (doc2) => {
                const cartItem = doc2.data();
                const cakeDoc = await getDoc(doc(db, 'cakes', cartItem.cakeID));
                const cakeData = cakeDoc.data();
                data.push({ ...cartItem, cake: { ...cakeData }, id: doc2.id });
            }),
        );
        return res.json({
            count: data.length,
            data: data,
        });
    } catch (e) {
        return res.json(e.message);
    }
};

const addToCart = async (req, res) => {
    try {
        const { uid, cakeID } = req.body;
        const q = query(
            collection(db, 'cart'),
            where('cakeID', '==', cakeID),
            where('uid', '==', uid),
            where('deleted', '==', false),
        );

        const querySnapshot = await getDocs(q);
        const docSnap = [];
        querySnapshot.forEach((doc) => {
            docSnap.push(doc.data());
        });
        if (!docSnap[0]) {
            await addDoc(collection(db, 'cart'), {
                uid,
                cakeID,
                quantity: 1,
                deleted: false,
                createdDate: serverTimestamp(),
            }).then(() => {
                return res.json('ok');
            });
        } else {
            return res.json({ status: 409, message: 'tài nguyên tồn tại tồn tại' });
        }
    } catch (e) {
        return res.json(e.message);
    }
};

const updateCart = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { id } = req.params;
        await updateDoc(doc(db, 'cart', id), {
            quantity: quantity * 1,
            timeUpdate: serverTimestamp(),
        });

        return res.json('update success');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteShallowCart = async (req, res) => {
    try {
        const { id_cart } = req.query;
        await updateDoc(doc(db, 'cart', id_cart), {
            deleted: true,
            timeUpdate: serverTimestamp(),
        });

        return res.json('update success');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCake,
    addCake,
    updateCake,
    deleteCake,
    login,
    register,
    addCakes,
    addAccounts,
    getCartbyUser,
    authenticateToken,
    addToCart,
    updateCart,
    deleteShallowCart,
    addOrder,
};
