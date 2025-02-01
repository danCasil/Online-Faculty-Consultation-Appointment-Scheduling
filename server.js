const express = require("express")
const multer = require('multer')

const path = require('path');
const upload = multer()
const cors=require("cors")
const app = express()
const sessionConfig = require('./sessionConfig');
const port = 3000
app.use(upload.array()); //para sa maramihan na data sa form
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);
app.use(express.json()); // Parse JSON bodies
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'pages'));
app.use(express.static("publicfiles"))








const getroutes=require('./routes/getroutes')
const postroutes=require('./routes/postroutes')
const patchroutes=require('./routes/patchroutes')
const getload=require('./routes/getload')



app.use(patchroutes)
app.use(getroutes)
app.use(postroutes)
app.use(getload)


app.listen(port, () => {
    console.log(`App listening at http://your-domain-name.com:${port}`);
});

