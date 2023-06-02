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
} = require("firebase/firestore");
const { createUserWithEmailAndPassword } = require("firebase/auth");
const { db, auth } = require("./firebase");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
// Create

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Missing authentication token." });
  }

  try {
    verifyIdToken(auth, token)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        console.log(uid);

        // Continue with the rest of your code
        const users = 0;

        if (users.length === 0) {
          throw new Error("Invalid or expired token.");
        }

        req.user = users[0];
        next();
      })
      .catch((error) => {
        throw new Error("Invalid or expired token.");
      });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: error.message });
  }
};

const getCake = async (req, res) => {
  try {
    const cakesRef = collection(db, "cakes");
    const querySnapshot = await getDocs(
      query(cakesRef, where("deleted", "==", false))
    ); // Replace "fieldName" with the field you want to order by

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
      userAgent: req.header("User-Agent"),
      data: data,
    });
  } catch (e) {
    return res.json(e.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const accountQuery = query(
    collection(db, "account"),
    where("username", "==", email)
  );
  const data = [];
  const querySnapshot = await getDocs(accountQuery);
  querySnapshot.docs.map(async (doc) => {
    const account = doc.data();
    data.push({ Id: doc.id, ...account });
  });
  if (
    Array.isArray(data) &&
    data.length > 0 &&
    bcrypt.compareSync(password, data[0].password)
  ) {
    return res.json({
      message: "login",
      data: data[0],
    });
    // ...
  } else {
    return res.status(401).json({ Error: "Invalid email or password" });
  }
};

const getCartbyUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const cartQuery = query(
      collection(db, "cart"),
      where("uid", "==", uid),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(cartQuery);
    const data = [];

    await Promise.all(
      querySnapshot.docs.map(async (doc2) => {
        const cartItem = doc2.data();
        const cakeDoc = await getDoc(doc(db, "cakes", cartItem.cakeID));
        const cakeData = cakeDoc.data();
        data.push({ ...cartItem, cake: { ...cakeData }, id: doc2.id });
      })
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
      collection(db, "cart"),
      where("cakeID", "==", cakeID),
      where("uid", "==", uid),
      where("deleted", "==", false)
    );

    const querySnapshot = await getDocs(q);
    const docSnap = [];
    querySnapshot.forEach((doc) => {
      docSnap.push(doc.data());
    });
    if (!docSnap[0]) {
      await addDoc(collection(db, "cart"), {
        uid,
        cakeID,
        quantity: 1,
        deleted: false,
        createdDate: serverTimestamp(),
      }).then(() => {
        return res.json("ok");
      });
    } else {
      return res.json({ status: 409, message: "tài nguyên tồn tại tồn tại" });
    }
  } catch (e) {
    return res.json(e.message);
  }
};

const updateOrder = async (req, res) => {
  const { id, id_user_shipper, status } = req.query;
  try {
    const docRef = doc(db, "order", id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (status === "shipping") {
      if (data.status === "shipping") {
        return res.status(409).json({
          statusCode: 409,
          message: "Có người đã nhận đơn này",
        });
      } else {
        await updateDoc(doc(db, "order", id), {
          id_user_shipper,
          status,
          start_shipping_date: serverTimestamp(),
        });
        return res.json({ message: "Thành công" });
      }
    } else if (status === "shipped") {
      await updateDoc(doc(db, "order", id), {
        status,
        shipped_date: serverTimestamp(),
      });
      return res.json({});
    }
  } catch (e) {
    return res.json(e.message);
  }
};

const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;
    await updateDoc(doc(db, "cart", id), {
      quantity: quantity * 1,
      timeUpdate: serverTimestamp(),
    });

    return res.json("update success");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteShallowCart = async (req, res) => {
  try {
    const { id_cart } = req.query;
    await updateDoc(doc(db, "cart", id_cart), {
      deleted: true,
      timeUpdate: serverTimestamp(),
    });

    return res.json("update success");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id, type } = req.query;
    const cakesRef = collection(db, "order");
    const querySnapshot = await getDocs(
      query(
        cakesRef,
        where("deleted", "==", false),
        where("id_user_shipper", "==", id),
        where("status", "==", type)
      )
    ); 

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
      userAgent: req.header("User-Agent"),
      data: data,
    });
  } catch (e) {
    return res.json(e.message);
  }
};



const addOrder = async (req, res) => {
  const { uid, shipping_address, detail, weight, shipping_cost, total_amount } =
    req.body;
  try {
    await addDoc(collection(db, "order"), {
      user_order: uid,
      total_amount: total_amount,
      shipping_address: shipping_address,
      status: "pending",
      weight: weight,
      id_user_shipper: "",
      shipping_cost: shipping_cost,
      detail: detail,
      order_date: serverTimestamp(),
      start_shipping_date: "",
      shipped_date: "",
      deleted: false,
    });
    return res.json("add data success");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  // Đọc tệp tin JSON
};

const getNewOrder = async (req, res) => {
  try {
    const cakesRef = collection(db, "order");
    const querySnapshot = await getDocs(
      query(cakesRef, where("status", "==", "pending"))
    ); 

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
      userAgent: req.header("User-Agent"),
      data: data,
    });
  } catch (e) {
    return res.json(e.message);
  }
};

const distance = (req, res) => {
  const apiKey = "AIzaSyAzaga_IWnHVoBVEMGXazTE3HbFZ_uBkg4";
  const origin = req.query.origin;
  const destination = req.query.destination;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
  axios
    .get(url)
    .then((response) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.json(response.data.rows[0].elements[0].distance.value);
    })
    .catch((error) => {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    });
};
module.exports = {
  getCake,
  login,
  addOrder,
  getCartbyUser,
  authenticateToken,
  addToCart,
  distance,
  updateCart,
  deleteShallowCart,
  getOrder,
  getNewOrder,
  updateOrder,
};
