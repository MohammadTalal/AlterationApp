import { ref } from "vue";
import { projectFirestore } from "../firebase/config";

const useCollection = (collection) => {
    const error = ref(null);
    const isPending = ref(false);

    // add a new document
    const addDoc = async (doc) => {
        error.value = null;
        isPending.value = true;

        try {
            await projectFirestore.collection(collection).add(doc);
            isPending.value = false;
        } catch (err) {
            console.log(err.message);
            error.value = "could not send the message";
            isPending.value = false;
        }
    };

    // update an existing document
    const updateDoc = async (id, newData) => {
        error.value = null;
        isPending.value = true;

        try {
            const docRef = projectFirestore.collection(collection).doc(id);
            await docRef.update(newData);
            isPending.value = false;
        } catch (err) {
            error.value = "Could not update the document";
            isPending.value = false;
        }
    };

    // update an existing document
    const deleteDoc = async (id) => {
        error.value = null;
        isPending.value = true;

        try {
            const docRef = projectFirestore.collection(collection).doc(id);
            await docRef.delete()
            isPending.value = false;
        } catch (err) {
            error.value = "Could not update the document";
            isPending.value = false;
        }
    };

    return { error, addDoc, updateDoc, deleteDoc, isPending };
};

export default useCollection;
