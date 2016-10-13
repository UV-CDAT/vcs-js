import Promise from './promise';

export default (session, fileName) => {
  // file prototype
  const file = {
    session,
    fileName,

    variables() {
      return this.session.client()
        .then((client) => { client.session.call('cdat.file.variables', [fileName]); });
    },

    createData(variable, subset) {
      // This should be some object that unifies client/server rendering
      // methods...  For now, the interface is undefined.
      const data = {
        session,
        file: this,
        variable,
        subset,
      };
      return Promise.delay(0, data);
    },

    set(data) { // ?
      return Promise.reject('Not implemented');
    },
  };
  return file;
};
