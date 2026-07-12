import type { RegistrationFormData } from "@/components/forms/MultiStepRegistrationForm";

export type RegistrationDraftType = "guest" | "volunteer";

const DRAFT_VERSION = 1;
const DRAFT_TTL_MS = 48 * 60 * 60 * 1000;
const DB_NAME = "casa-de-bloom-registration";
const DB_VERSION = 1;
const PHOTO_STORE = "draft-photos";
const SENSITIVE_FIELDS = new Set([
  "password",
  "confirmPassword",
  "reality_show_understood",
  "photoReleaseAccepted",
  "positive_experience_agreed",
  "ageConfirmed",
  "guidelinesAccepted",
]);

interface StoredDraft {
  version: number;
  savedAt: number;
  currentIndex: number;
  formData: RegistrationFormData;
}

interface StoredPhotoDraft {
  key: string;
  savedAt: number;
  files: File[];
}

function storageKey(type: RegistrationDraftType) {
  return `casa-registration-draft-v${DRAFT_VERSION}-${type}`;
}

export function sanitizeRegistrationDraftData(formData: RegistrationFormData) {
  return Object.fromEntries(
    Object.entries(formData).filter(([key]) => !SENSITIVE_FIELDS.has(key)),
  ) as RegistrationFormData;
}

export function saveRegistrationDraft(
  type: RegistrationDraftType,
  formData: RegistrationFormData,
  currentIndex: number,
) {
  try {
    const draft: StoredDraft = {
      version: DRAFT_VERSION,
      savedAt: Date.now(),
      currentIndex,
      formData: sanitizeRegistrationDraftData(formData),
    };
    window.localStorage.setItem(storageKey(type), JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function loadRegistrationDraft(type: RegistrationDraftType): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem(storageKey(type));
    if (!raw) return null;
    const draft = JSON.parse(raw) as StoredDraft;
    if (
      draft.version !== DRAFT_VERSION ||
      !draft.formData ||
      Date.now() - draft.savedAt > DRAFT_TTL_MS
    ) {
      window.localStorage.removeItem(storageKey(type));
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

function openDraftDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(PHOTO_STORE)) {
        database.createObjectStore(PHOTO_STORE, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runPhotoStoreRequest<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const database = await openDraftDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(PHOTO_STORE, mode);
      const request = action(transaction.objectStore(PHOTO_STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}

export async function saveRegistrationDraftPhotos(
  type: RegistrationDraftType,
  files: File[],
) {
  try {
    await runPhotoStoreRequest("readwrite", (store) =>
      store.put({ key: storageKey(type), savedAt: Date.now(), files }),
    );
    return true;
  } catch {
    return false;
  }
}

export async function loadRegistrationDraftPhotos(type: RegistrationDraftType) {
  try {
    const record = await runPhotoStoreRequest<StoredPhotoDraft | undefined>(
      "readonly",
      (store) => store.get(storageKey(type)),
    );
    if (!record) return [];
    if (Date.now() - record.savedAt > DRAFT_TTL_MS) {
      await clearRegistrationDraftPhotos(type);
      return [];
    }
    return Array.isArray(record.files) ? record.files : [];
  } catch {
    return [];
  }
}

export async function clearRegistrationDraftPhotos(type: RegistrationDraftType) {
  try {
    await runPhotoStoreRequest("readwrite", (store) =>
      store.delete(storageKey(type)),
    );
  } catch {
    // IndexedDB may be unavailable in private browsing; text cleanup still succeeds.
  }
}

export async function clearRegistrationDraft(type: RegistrationDraftType) {
  try {
    window.localStorage.removeItem(storageKey(type));
  } catch {
    // Storage can be unavailable; there is nothing else to clear locally.
  }
  await clearRegistrationDraftPhotos(type);
}
