/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: July 04, 2022
 * Author: Shota Nakajo
 * Student ID: A00888785
 * Course: COMP3012
 * 
 */

const { resolve } = require('path');
const { on } = require('stream');
const { createReadStream, createWriteStream} = require('fs');

// const { resolve } = require('path');
const unzipper = require('unzipper'),
  fs = require("fs"),
  PNG = require('pngjs').PNG,
  path = require('path');


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */
// const unzip = (pathIn, pathOut) => {
//   return new Promise((resolve,reject) => {
//     fs.createReadStream(pathIn)
//     .pipe(unzipper.Extract({path:pathOut}))
//     .on('error', reject)
//     .on('finish',resolve)
//   });
// }

// const unzip = (pathIn, pathOut) => {
//   (async function() {
//     try {
//       const duplex = await fs.createReadStream(pathIn)
//                     .pipe(unzipper.Extract({path:pathOut}))
//       return resolve(duplex);
//     }catch(err){
//       return await reject(err);
//     }
//   })();
// }

// try it without wrapping with promise (read documentation)
const unzip = (pathIn, pathOut) => {
  return fs.createReadStream(pathIn)
    .pipe(unzipper.Extract({path:pathOut}))
    .promise();
}


/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 */
const readDir = (dir) => {
   return new Promise((resolve,reject) => {
    fs.readdir(dir, (err, files) =>{
      if (err) {
        reject(err);
      } else {
        resolve(files.filter(file => path.extname(file) === '.png'));
      }
    })
  });
};

/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {string} filePath 
 * @param {string} pathProcessed 
 * @return {promise}
 */
const grayScale = (file, pathProcessed) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname,'unzipped',file))
    .pipe(
      new PNG({
        filterType: 4,
      })
    )
    
    .on('parsed', function(){
      for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            // change to grayscale
            let luma_component = 0.2627 * this.data[idx]
                  + 0.6780 * this.data[idx + 1]
                  + 0.0593 * this.data[idx + 2];
            this.data[idx] = luma_component;
            this.data[idx + 1] = luma_component;
            this.data[idx + 2] = luma_component;

            // and reduce opacity
            // this.data[idx + 3] = this.data[idx + 3] >> 1;
          }
        }
        this.pack() 
        .pipe(fs.createWriteStream(path.resolve(__dirname,pathProcessed, file)))
        .on('error', function(e){console.log(e)})
    })
    .on('error', function(e){console.log(e)})
  });
};


module.exports = {
  unzip,
  readDir,
  grayScale
};