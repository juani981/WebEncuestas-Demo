export const deletionQueue = [];

export const addDeletion = (id) => {
  deletionQueue.push(id);
};

export const clearDeletionQueue = () => {
  deletionQueue.length = 0;
};

export const getDeletionQueue = () => {
  return deletionQueue;
};
