import { resolve } from 'path';

import Dotenv from 'dotenv-webpack';
import { Configuration } from 'webpack';

type Mode = 'production' | 'development';

type Environment = {
  mode: Mode;
};

export default (env: Environment) => {
  const config: Configuration = {
    mode: env.mode,
    devtool: false,
    target: 'node',
    entry: resolve(__dirname, 'server.ts'),
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'build'),
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    plugins: [
      new Dotenv({
        safe: true,
      }),
    ],
  };

  return config;
};
