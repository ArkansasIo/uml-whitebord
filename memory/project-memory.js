const DB_NAME = 'uml-whiteboard-memory'; const STORE = 'records';
export class ProjectMemory {
  constructor(projectId = 'default') { this.projectId = projectId; this.records = new Map(); this.db = null; }
  async open() {
    if (!globalThis.indexedDB) return this;
    this.db = await new Promise((resolve, reject) => { const request = indexedDB.open(DB_NAME, 1); request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' }); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    return this;
  }
  async save(record) {
    const value = { id: record.id ?? crypto.randomUUID(), projectId: this.projectId, type: record.type ?? 'note', value: structuredClone(record.value ?? record), updatedAt: new Date().toISOString() }; this.records.set(value.id, value);
    if (this.db) await new Promise((resolve, reject) => { const tx = this.db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(value); tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); });
    return value;
  }
  async list(type) { const local = [...this.records.values()].filter(x => x.projectId === this.projectId && (!type || x.type === type)); if (!this.db) return local; return new Promise((resolve, reject) => { const tx = this.db.transaction(STORE, 'readonly'); const request = tx.objectStore(STORE).getAll(); request.onsuccess = () => resolve(request.result.filter(x => x.projectId === this.projectId && (!type || x.type === type))); request.onerror = () => reject(request.error); }); }
}
