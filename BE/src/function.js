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
  setDoc,
  onSnapshot,
} = require("firebase/firestore");
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} = require("firebase/auth");
const { db, auth } = require("./firebase");
// const auth = require("./firebase");

const { signInWithPopup, GoogleAuthProvider } = require("firebase/auth");
const fs = require("fs");
const path = require("path");
// Create

const addCake = async (req, res) => {
  try {
    await addDoc(collection(db, "cart"), {
      uid,
      cakeID,
      quantity: 1,
      deleted: false,
    });

    return res.json("create success");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Add cake by json file
const addCakes = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "data.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading JSON file:", err);
        res.status(500).send("Error reading JSON file");
        return;
      } else {
        const jsonData = JSON.parse(data);
        Array.isArray(jsonData) &&
          jsonData.length > 0 &&
          jsonData.map(async (item) => {
            await addDoc(collection(db, "cakes"), {
              nameCake: item.nameCake,
              detail: item.detail,
              price: item.price,
              quantity: item.quantity,
              sold: item.sold,
              inventory: item.inventory,
              images: item.images,
              timeCreate: serverTimestamp(),
              deleted: false,
            });
          });
        return res.json("add data success");
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

// Update

const updateCake = async (req, res) => {
  try {
    const { id, nameCake, price, quantity } = req.body;

    await updateDoc(doc(db, "cart", id), {
      nameCake,
      price,
      quantity,
      timeUpdate: serverTimestamp(),
    });

    return res.json("update success");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update

const deleteCake = async (req, res) => {
  try {
    const { id } = req.body;
    await deleteDoc(doc(db, "cart", id));
    return res.json("deleted!");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  // connectAuthEmulator(auth, "http://localhost:9099");
  const { email, password } = req.body;
  console.log(email, password);
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return res.json({
        message: "login",
        data: user,
      });
      // ...
    })
    .catch((error) => {
      return res.status(401).json({ Error: error.message });
    });
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
const loginWithGoogle = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    await signInWithRedirect(auth, provider);

    // Handle the sign-in redirect result
    const result = await getRedirectResult(auth);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;

    console.log("Login success");
    // Return the user or perform any necessary actions
    return user;
  } catch (error) {
    console.log("Login failed", error.message);
    // Handle any errors that occurred during the login process
    throw error;
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

const change = async (req, res) => {
  // const { id } = req.params;
  // const q = query(
  //   collection(db, "cart"),
  //   where("uid", "==", "6aVaN7dlRJeqYb7DeamcUTowYxe2")
  // );
  // const unsubscribe = onSnapshot(q, (snapshot) => {
  //   snapshot.docChanges().forEach((change) => {
  //     if (change.type === "added") {
  //       console.log("New city: ", change.doc.data());
  //     }
  //     if (change.type === "modified") {
  //       console.log("Modified city: ", change.doc.data());
  //     }
  //     if (change.type === "removed") {
  //       console.log("Removed city: ", change.doc.data());
  //     }
  //   });
  // });
};
// change();
module.exports = {
  getCake,
  addCake,
  updateCake,
  deleteCake,
  login,
  register,
  loginWithGoogle,
  addCakes,
  getCartbyUser,
  addToCart,
  updateCart,
  deleteShallowCart,
};
