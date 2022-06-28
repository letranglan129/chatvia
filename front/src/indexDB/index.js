import { openDB } from 'idb'

const createDB = (nameDB, nameTable) => {
	return openDB(nameDB, 1, {
		upgrade(db) {
			db.createObjectStore(nameTable)
		},
	})
}

export async function get(key, nameDB, nameTable) {
	return (await createDB(nameDB, nameTable)).get(nameTable, key)
}
export async function set(key, val, nameDB, nameTable) {
	return (await createDB(nameDB, nameTable)).put(nameTable, val, key)
}
export async function add(key, val, nameDB, nameTable) {
	return (await createDB(nameDB, nameTable)).add(nameTable, val, key)
}
export async function del(key, nameDB, nameTable) {
	return (await createDB(nameDB, nameTable)).delete(nameTable, key)
}
export async function clear(nameDB, nameTable) {
	return (await createDB(nameDB, nameTable)).clear(nameTable)
}
export async function getAll(nameDB, nameTable) {
	return (await createDB(nameDB, nameTable)).getAll(nameTable)
}
