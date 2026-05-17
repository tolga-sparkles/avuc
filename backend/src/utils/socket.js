let io = null;

function setIoInstance(instance) {
  io = instance;
}

function getIoInstance() {
  return io;
}

function emitToAll(event, data) {
  if (io) {
    io.emit(event, data);
  }
}

module.exports = {
  setIoInstance,
  getIoInstance,
  emitToAll,
};
