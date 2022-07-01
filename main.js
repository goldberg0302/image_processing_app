/*
 * Project: COMP1320 Milestone 1
 * File Name: main.js
 * Description: 
 * 
 * Created Date: June 30, 2022
 * Author: Shota Nakajo
 * Student ID: A00888785
 * 
 */

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

  IOhandler.unzip("", "")
  .then(()=>IOhandler.readDir(pathUnzipped))
  // .then((filePaths)=> console.log(filePaths)) ["*.png", "*.png"]
  .then((filePaths)=>
    filePaths.forEach(path=>IOhandler.grayScale(path,pathProcessed))
  )
  .catch(err=>console.log(err))


