let db;

// create the database
const request = indexedDB.open('budgetdb', 1);

request.onupgradeneeded = event => {
    console.log('Upgrade is needed!');
    db = event.target.result;

  // object store created
    if (db.objectStoreNames.length === 0) {
    db.createObjectStore('transactions', { autoIncrement: true });
    console.log('Object Store has been created!')
    }
};

request.onsuccess = event => {
    console.log('Request successful!');
    db = event.target.result;

    if (navigator.onLine) {
    console.log('App is online!');
    checkDatabase();
    }
};

// in case of error
request.onerror = event => {
    console.log(`Error code: ${event.target.errorCode}`);
};

// check database for previous transactions
function checkDatabase() {
    let transaction = db.transaction(['transactions'], 'readwrite');
    const objectStore = transaction.objectStore('transactions');

    const getAll = objectStore.getAll();
    getAll.onsuccess = () => {

    // fetch records
    if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(response => {
            if (response.length !== 0) {
            
            transaction = db.transaction(['transactions'], 'readwrite');
            const currentStore = transaction.objectStore('transactions');

            // clear the existing records in db
            currentStore.clear();
            console.log('IndexedDB has been cleared!');
        }
        });
    }
};

    getAll.onerror = () => {
    console.log(`Error code: ${target.errorCode}`);
    };
}

const saveRecord = record => {

    const transaction = db.transaction(['transactions'], 'readwrite');
    const objectStore = transaction.objectStore('transactions');

    objectStore.add(record);
    console.log('Record Added!');
};
window.addEventListener('online', checkDatabase);