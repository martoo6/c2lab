/**
 * Created by martin on 7/4/17.
 */
const blobService = require('feathers-blob');
const fsbs = require('fs-blob-store');
const blobStorage = fsbs(__dirname + '/../../sketches-showcase');

const sketchesShowcase = blobService({Model: blobStorage});

module.exports = sketchesShowcase;