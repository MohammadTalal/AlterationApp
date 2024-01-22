import { ref, watchEffect } from "vue";
import { projectFirestore } from "../firebase/config";

const getOrders = (collection, filterOption = null, todaysPickup = false ) => {
    const orders = ref(null);
    const error = ref(null);

    // register the firestore collection reference
    let collectionRef = projectFirestore.collection(collection).orderBy("pickupDate");

    const unsub = collectionRef.onSnapshot(
        (snap) => {
            let results = [];
            snap.docs.forEach((doc) => {
                // must wait for the server to create the timestamp & send it back
                doc.data() && results.push({ ...doc.data(), id: doc.id });
            });

            if(filterOption){
                results = results.filter((o) => o.customerID === filterOption)
            }

            if(todaysPickup){
                results = results.filter((o) => 
                    o.pickupDate.toDate().toLocaleDateString() === (new Date()).toLocaleDateString()
                )
            }

            // update values
            orders.value = results;
            error.value = null;
        },
        (err) => {
            console.log(err.message);
            orders.value = null;
            error.value = "could not fetch the data";
        }
    );

    watchEffect((onInvalidate) => {
        onInvalidate(() => unsub());
    });

    return { error, orders };
};

export default getOrders;
