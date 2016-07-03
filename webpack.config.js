module.exports = {
  entry: './public/script.js',
  output: {
    filename: "public/client.min.js"
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query:
          {
            presets:['react']
          }
      }
    ]
  }
}
