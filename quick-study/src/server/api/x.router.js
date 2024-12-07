const express = require('express');
const upload = require('../middleware/multer');
const router = express.Router();











// REFRENCE ⬇️

// const { postsGet, postsUpdate, postsDelete, postsCreate } = require('./posts.controllers');
  
router.get('/', (req, res) => {
  res.json("Hello World")
});
// router.post('/', upload.single("image") ,postsCreate);

// router.delete('/:postId', postsDelete);

// router.put('/:postId', postsUpdate);

module.exports = router;