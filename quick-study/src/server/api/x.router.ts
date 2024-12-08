import express from 'express';
import upload from '../middleware/multer';
const router = express.Router();











// REFRENCE ⬇️

// const { postsGet, postsUpdate, postsDelete, postsCreate } = require('./posts.controllers');
  
router.get('/test', (req, res) => {
  res.json("Hello World")
});
// router.post('/', upload.single("image") ,postsCreate);

// router.delete('/:postId', postsDelete);

// router.put('/:postId', postsUpdate);

export default router;