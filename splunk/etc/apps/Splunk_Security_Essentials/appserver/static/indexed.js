const DB_NAME = "SSEDB"
const OBJECT_STORE = "SSEData"
const KEY_SAVEDSEARCHES = "sse-savedsearches"
const DB_VERSION = 2

window.db = undefined

/**
 * Initialize the database
 * @returns
 */

function initDatabase() {
    return new Promise(function (resolve, reject) {
        // console.log("initDatabase called ", window.db)

        if (window.db) {
            resolve(window.db)
            return
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = (event) => {
            reject(window.db)
            console.error("Browser has no support for IndexedDB?!")
        }

        request.onsuccess = (event) => {
            window.db = event.target.result
            initializeDBHandlers()
            resolve(window.db)
        }

        // This event is only implemented in recent browsers
        request.onupgradeneeded = (event) => {
            // Save the IDBDatabase interface
            window.db = event.target.result

            initializeDBStore(window.db, OBJECT_STORE)
            resolve(window.db)
        }
    })
}

function initializeDBHandlers() {
    window.db.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`)
    }
}

function initializeDBStore(db, storeName) {
    if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName) // create it
    }
}

/**
 * Add data if doesn't exist
 * @param {*} key -> Key
 * @param {*} value -> Data
 * @returns
 */
async function addData(key, value) {
    return new Promise(async function (resolve, reject) {
        /**
         * Check data exist or not.
         */
        let dataExist = false

        try {
            let data = await getData(key)
            // console.log("Exist -> ", data)
            dataExist = true
        } catch (error) {
            console.log("Doesn't exist")
            dataExist = false
        }

        let transaction = window.db.transaction(OBJECT_STORE, "readwrite")

        /**
         * Add data into the db
         */
        let request

        if (dataExist) {
            request = transaction.objectStore(OBJECT_STORE).put(value, key)
        } else {
            request = transaction.objectStore(OBJECT_STORE).add(value, key)
        }

        request.onerror = function (event) {
            // ConstraintError occurs when an object with the same id already exists
            if (request.error.name == "ConstraintError") {
                console.log("Book with such id already exists") // handle the error
                event.preventDefault() // don't abort the transaction
                // use another key for the book?
            } else {
                // unexpected error, can't handle it
                // the transaction will abort
            }
        }

        request.onsuccess = function () {
            resolve()
        }

        request.onerror = function () {
            reject()
        }

        transaction.onabort = function () {
            console.log("Error", transaction.error)
            reject()
        }
    })
}

/**
 * Get data for the key
 * @param {*} key -> Key
 */
function getData(key) {
    return new Promise(function (resolve, reject) {
        let transaction = window.db.transaction(OBJECT_STORE, "readonly")

        let store = transaction.objectStore(OBJECT_STORE)
        let request = store.get(key)
        request.onsuccess = function () {
            resolve(request.result)
            // console.log("Result: ", request.result)
        }

        request.onerror = function () {
            console.log("Error: ", request.error)
            reject(request.error)
        }
    })
}

/**
 * Delete data for the key
 * @param {*} key -> Key
 */
function deleteData(key) {
    return new Promise(function (resolve, reject) {
        let transaction = window.db.transaction(OBJECT_STORE, "readwrite")

        let store = transaction.objectStore(OBJECT_STORE)
        let request = store.delete(key)
        request.onsuccess = function () {
            resolve()
        }

        request.onerror = function () {
            reject()
        }
    })
}

define([], function () {
    return {
        initDatabase,
        addData,
        deleteData,
        getData,
        KEY_SAVEDSEARCHES,
    }
})

// return {
//   initDatabase,
//   addData,
//   deleteData,
//   getData
// }
