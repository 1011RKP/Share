'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

//commnet
// build.tslint = false;

// const webpack = require('webpack');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

//commnet
// build.configureWebpack.mergeConfig({
//   additionalConfiguration: (generatedConfiguration) => {

//     generatedConfiguration.devtool = undefined;

//     generatedConfiguration.plugins.push(new webpack.SourceMapDevToolPlugin({
//       append: '\n//# sourceMappingURL=https://localhost:4321/dist/[url]',
//       filename: '[name].map'
//     }));

//     for (var i = 0; i < generatedConfiguration.plugins.length; i++) {
//       const plugin = generatedConfiguration.plugins[i];
//       if (plugin instanceof webpack.optimize.minimizer) {
//         plugin.options.sourceMap = true;
//         break;
//       }
//     }

//     return generatedConfiguration;
//   }
// });
//commnet End

build.initialize(gulp);
