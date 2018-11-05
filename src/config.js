const config = {
  express: {
      url: `http://120.78.71.240:`,   
      port: '3001'     
  },

  db: {
      testUrl:`mongodb://localhost:27017/test`,
      usersUrl:`mongodb://localhost:27017/users`
  },
  ipfsApi: {
    host: `120.78.71.240`
}
}

module.exports = config;
