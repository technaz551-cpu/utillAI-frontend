// Saves editor projects in the browser (IndexedDB), so they survive page reloads.
// IndexedDB is used instead of localStorage because a PDF page image is several MB.
//
// Two stores:
//   "projects"    -> small metadata (title, thumbnail, dates) used by Home / Projects lists
//   "projectData" -> the heavy page JSON, loaded only when a project is opened

export type ProjectMeta = {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    thumbnail: string;
    pageCount: number;
  };
  
  export type ProjectPage = {
    id: string;
    width: number;
    height: number;
    json: unknown;
  };
  
  const DB_NAME = 'utilai-pdf-editor';
  const DB_VERSION = 1;
  const META_STORE = 'projects';
  const DATA_STORE = 'projectData';
  
  let dbPromise: Promise<IDBDatabase> | null = null;
  
  const openDb = (): Promise<IDBDatabase> => {
    if (typeof indexedDB === 'undefined') {
      return Promise.reject(new Error('IndexedDB is not available'));
    }
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(META_STORE)) {
            db.createObjectStore(META_STORE, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(DATA_STORE)) {
            db.createObjectStore(DATA_STORE, { keyPath: 'id' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          dbPromise = null;
          reject(request.error);
        };
      });
    }
    return dbPromise;
  };
  
  const wrap = <T>(request: IDBRequest<T>) =>
    new Promise<T>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  
  const txDone = (tx: IDBTransaction) =>
    new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  
  export async function saveProjectRecord(meta: ProjectMeta, pages: ProjectPage[]) {
    const db = await openDb();
    const tx = db.transaction([META_STORE, DATA_STORE], 'readwrite');
    tx.objectStore(META_STORE).put(meta);
    tx.objectStore(DATA_STORE).put({ id: meta.id, pages });
    await txDone(tx);
  }
  
  export async function listProjects(): Promise<ProjectMeta[]> {
    const db = await openDb();
    const tx = db.transaction(META_STORE, 'readonly');
    const all = await wrap<ProjectMeta[]>(tx.objectStore(META_STORE).getAll());
    return all.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  
  export async function loadProject(id: string): Promise<{ meta: ProjectMeta; pages: ProjectPage[] } | null> {
    const db = await openDb();
    const tx = db.transaction([META_STORE, DATA_STORE], 'readonly');
    const meta = await wrap<ProjectMeta | undefined>(tx.objectStore(META_STORE).get(id));
    const data = await wrap<{ id: string; pages: ProjectPage[] } | undefined>(tx.objectStore(DATA_STORE).get(id));
    if (!meta || !data) return null;
    return { meta, pages: data.pages };
  }
  
  export async function deleteProject(id: string) {
    const db = await openDb();
    const tx = db.transaction([META_STORE, DATA_STORE], 'readwrite');
    tx.objectStore(META_STORE).delete(id);
    tx.objectStore(DATA_STORE).delete(id);
    await txDone(tx);
  }
  
  export async function renameProject(id: string, title: string) {
    const db = await openDb();
    const tx = db.transaction(META_STORE, 'readwrite');
    const store = tx.objectStore(META_STORE);
    const meta = await wrap<ProjectMeta | undefined>(store.get(id));
    if (meta) store.put({ ...meta, title });
    await txDone(tx);
  }
  
  export function formatEdited(timestamp: number) {
    const diff = Date.now() - timestamp;
    const minute = 60 * 1000;
    if (diff < minute) return 'Edited just now';
    if (diff < 60 * minute) return `Edited ${Math.floor(diff / minute)} min ago`;
    if (diff < 24 * 60 * minute) return `Edited ${Math.floor(diff / (60 * minute))} h ago`;
    return `Edited ${new Date(timestamp).toLocaleDateString()}`;
  }