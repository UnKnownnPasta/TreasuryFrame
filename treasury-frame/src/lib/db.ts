type storeName = "relicSchema" | "inventoryJson" | "treasuryData";

export function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("TFDatabase", 1);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			if (!db.objectStoreNames.contains("storage")) {
				db.createObjectStore("storage", {
					keyPath: "id",
					autoIncrement: true,
				});
			}
		};

		request.onsuccess = (event) => {
			resolve((event.target as IDBOpenDBRequest).result);
		};

		request.onerror = (event) => {
			reject((event.target as IDBOpenDBRequest).error);
		};
	});
}

export function addData(db: IDBDatabase, data: any): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction("storage", "readwrite");
		const objectStore = transaction.objectStore("storage");
		const request = objectStore.add(data);

		request.onsuccess = () => {
			resolve();
		};

		request.onerror = (event) => {
			reject((event.target as IDBRequest).error);
		};
	});
}

export function getData(db: IDBDatabase, key: storeName): Promise<any> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction("storage", "readonly");
		const objectStore = transaction.objectStore("storage");
		const request = objectStore.get(key);

		request.onsuccess = (event) => {
			resolve((event.target as IDBRequest).result);
		};

		request.onerror = (event) => {
			reject((event.target as IDBRequest).error);
		};
	});
}

export function updateData(db: IDBDatabase, data: any): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction("storage", "readwrite");
		const objectStore = transaction.objectStore("storage");
		const request = objectStore.put(data);

		request.onsuccess = () => {
			resolve();
		};

		request.onerror = (event) => {
			reject((event.target as IDBRequest).error);
		};
	});
}
