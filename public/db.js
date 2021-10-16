let db
let dbVersion

const request = indexedDB.open("budgetDb", dbVersion || 1);

request.onupgradeneeded = event => {
    console.log("Upgrading DB")

    db = event.target.result

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('budgetStore', {autoIncrement: true })
    }
}

request.onerror = event => {
    console.log(`Error: ${event.target.errorCode}`)
}

function checkDatabase() {

    // open a transaction
    let transaction = db.transaction(['budgetStore'], 'readwrite')

    const store = transaction.objectStore('budgetStore');

    const getData = store.getAll()

    // on success
    if (getData.result.length > 0) {
        fetch('api/transaction/bulk', {
            method: 'POST',
            body: JSON.stringify(getData.result),
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(res => {
            if (res.length !== 0) {
                transaction = db.transaction(['budgetStore'], 'readwrite')

                const curStore = transaction.objectStore('budgetStore')

                currentStore.clear()
            }
        }) 
    }

}

request.onsuccess = event => {
    db = event.target.result

    if (navigator.onLine) {
        checkDatabase();
    }
}

const saveRecord = record => {
    const transaction = db.transaction(['budgetStore'], 'readwrite')

    const store = transaction.objectStore('budgetStore')

    store.add(record)

}

//Listen for Online
window.addEventListener('online', checkDatabase)