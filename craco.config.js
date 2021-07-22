const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
  babel: {
    plugins: [
      [
        "import",
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,//设置为true即是less 
        }
      ],
    ],
  },

  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      }
    },
  ],

  webpack: {
    // 别名
    alias: {
      "@": path.resolve("src"),
      "@utils": path.resolve("src/utils"),
      "@pages": path.resolve("src/pages"),
    }
  },
};