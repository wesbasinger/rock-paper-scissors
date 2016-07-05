module.exports = {
  entry: './public/script.js',
  output: {
    filename: "public/client.min.js"
  },
  devServer: {
    inline: true,
    port: 3333
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
