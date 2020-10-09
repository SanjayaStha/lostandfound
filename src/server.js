const cool = require('cool-ascii-faces');
var express = require('express');
var logger = require('morgan')
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
var admin = require('firebase-admin')
const session = require('express-session');
const path = require('path');

const nodemailer = require('nodemailer');

var PORT = process.env.PORT || 8888;

var serviceAccount = require('../service.json')

var firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore();
const csrfMiddleware = csrf({ cookie: true });

var app = express()
app.use(session({ secret: 'KV0AnuKISrUtZE2DqJYYBycjsUq2',resave: true,
saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(logger('dev'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(path.join(__dirname, 'views')))

function isAuthenticated(req, res, next) {
    if(req.session.uid){
        console.log("User authenticated");
        return next()
    }
    console.log("User Unauthenticated");

    return res.redirect("/")
}

app.get('/cool', (req, res) => res.send(cool()))
app.get('/times', (req, res) => res.send(showTimes()))

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.get('/', (req, res) => {
    res.render('index.ejs', { csrfToken: req.csrfToken() })
})

app.get('/home', (req, res) => {
    res.render('home.ejs', { csrfToken: req.csrfToken() })
})

app.get('/box', (req, res) => {
    res.render('box-model.ejs', { csrfToken: req.csrfToken() })
})

app.get('/edit', (req, res) => {
    res.render('edit-profile.ejs', { csrfToken: req.csrfToken() })
})

app.get('/example', (req, res) => {
    res.render('examples.ejs', { csrfToken: req.csrfToken() })
})

app.get('/explore', (req, res) => {
    res.render('explore.ejs', { csrfToken: req.csrfToken() })
})

app.get('/feed', (req, res) => {
    res.render('feed.ejs', { csrfToken: req.csrfToken() })
})

app.get('/image', (req, res) => {
    res.render('image-detail.ejs', { csrfToken: req.csrfToken() })
})

app.get('/index', (req, res) => {
    res.render('index.ejs', { csrfToken: req.csrfToken() })
})

app.get('/profile', (req, res) => {
    res.render('profile.ejs', { csrfToken: req.csrfToken() })
})

app.get('/newItem', async (req, res) => {
    res.render('newItem.ejs', { csrfToken: req.csrfToken() })
})


app.post("/sendMail",(req,res)=>{
    console.log(req.body)
    const email = req.body.userRef.email.toString();
    const name = req.body.userRef.name.toString();
    const photoURL = req.body.userRef.photoURL.toString();
    console.log("initiating mailing service")
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'ssanjayaiw@gmail.com',
            pass: "ssanjaya097@Iw"
        }
    });
    

    var mailoptions = {
        from: "ssanjaya097@gmail.com",
        to: email,
        subject: "Lost and Found Sign Up",
        html: `

        <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <!------ Include the above in your HEAD tag ---------->
        
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
        <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <!------ Include the above in your HEAD tag ---------->
       
        <div style="font-family: Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif;">
            <table style="width: 100%; padding:10px; margin:10px">
              <tr>
                <td></td>
                <td bgcolor="#eee">
                  <div style="padding: 15px; max-width: 600px;margin: 0 auto;display: block; border-radius: 0px;padding: 0px; border: 3px solid white;">
                    <table style="width: 100%;background: #FFFFFF">
                      <tr>
                        <td></td> 
                        <td>
                          <div>
                            <table width="100%">
                              <tr>
                                <td rowspan="2" style="text-align:center;padding:10px;">
                                    
                                    <span style="color:white;font-size: 13px;font-style: italic;margin-top: 20px; padding:10px; font-size: 14px; font-weight:normal;margin-left: auto; margin-right: auto;">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/worklist-a9d4f.appspot.com/o/logo.png?alt=media&token=201fae47-e1c5-4f3d-bd11-08c3bc2d6963" width="300px" />
                                    <span></span></span></td>
                              </tr>
                            </table>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                    </table>
                    <table style="padding: 10px;font-size:14px; width:100%;">
                      <tr>
                        <td style="padding:10px;font-size:14px; width:100%;">
                            <p>Hello ${name},</p>
                            <p><br /> Thank You for signing Up for <b>Lost and Found</b>. </p>
                             <p> Please be active and suggest your friends and family member to keep the community growing </p>
                            <p style="color:black"> <b>Thank you regard <br>
                Lost and Found pvt. ltd.<br>
                Kathmandu, Nepal </b></p>
                                      <!-- /Callout Panel -->
                          <!-- FOOTER -->
                         </td>
                      </tr>
                      <tr style="background-color:#fff" align="center" > 
                      <td style="background-color:#fff">
                         <div align="center" style="font-size:12px; margin-top:20px; padding:5px; width:100%; color:red;">
                            <b>@2020 LostAndFound</b>
                          </div>
                        </td>
                      </tr>
                      <tr style="background-color:#fff">
                    <center style="margin-left: auto; margin-right: auto; background-color:#fff">
                        <a href="#">
                        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmaxcdn.icons8.com%2FShare%2Ficon%2Fdotty%2FLogos%2Ffacebook1600.png" width="48px" />
                        </a>
                        <a href="#">
                        <img  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fsguru.org%2Fwp-content%2Fuploads%2F2018%2F02%2Ftwitter-logo_318-40459.jpg" width="48px />
                        </a>
                        <a href="#" >
                        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmaxcdn.icons8.com%2FShare%2Ficon%2Fp1em%2FLogos%2Finstagram_new1600.png" width="48px" />
                        </a>
                        </center>
                      </tr>
                    </table>
                  </div>
        `
    }

    console.log("sending mail...")


    transporter.sendMail(mailoptions, function(error, info){
        if(error){
            console.log(error)
        } else {
            console.log("Email sent: " + info.response);
        }
    })

    return res.send("success")
})


app.post('/newItem',isAuthenticated, async (req, res) => {
    let type = req.body.item_type
    let userRef = await db.collection('users').doc(req.session.uid).get()
    let todo = {
        "name": req.body.item_name,
        "description": req.body.item_desc,
        "images": req.body.uploadImages,
        "user": userRef.data(),
        "likes":[]
    }

    let docRef = db.collection('found_items')
    if(type == "lost"){
        docRef = db.collection('lost_items')
    }

    docRef.add(todo)
    res.redirect("/items")
})

app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
    let uid;
    sess = req.session;

    admin.auth().verifyIdToken(idToken)
        .then(async function(decodedToken) {
            uid = decodedToken.uid;
            sess.uid = uid

        }).catch(function(error) {
            console.log(error)
        });


    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn, uid })
        .then(
            (sessionCookie) => {

                const options = { maxAge: expiresIn, httpOnly: true };
                res.cookie("session", sessionCookie, options);
                res.end(JSON.stringify({ status: "success" }));
            },
            (error) => {
                res.status(401).send("UNAUTHORIZED REQUEST!");
            }
        );
});
app.get('/logout',isAuthenticated, (req, res) => {
    res.clearCookie('session');
    req.session.uid = '';
    return res.redirect("/")
    
});

app.post('/logout',isAuthenticated, (req, res) => {
    res.clearCookie('session');
    req.session.uid = '';
    return res.redirect("/")
    
});

app.get('/items',isAuthenticated, async (req, res) => {
    try{
    let lostItems = []
    let foundItems = []
    let userRef = await db.collection('users').doc(req.session.uid).get()
    let userData = userRef.data()
    let lostData = await db.collection('lost_items').get()
    let foundData = await db.collection('found_items').get()
    lostData.forEach(async (doc) =>{
        let data = doc.data() 
        data['uid'] = doc.id

        lostItems.push(data)
    })
    foundData.forEach(async doc =>{ 
        let data = doc.data() 
        data['uid'] = doc.id
        
        foundItems.push(data)
    })
    console.log("=================")
    console.log(lostItems, foundItems, userData)
    return res.render('feed.ejs',{lostItems, foundItems, userData,csrfToken: req.csrfToken()} )

    }catch(err){
        console.log(err)
    }

})
  

app.get('/:id',isAuthenticated, async (req,res)=>{
    let dataRef
    console.log(req.params.id)
    try {
        dataRef =  db.collection('lost_items').doc(req.params.id)
        let doc = await dataRef.get()
        if(!doc.exists){
            dataRef = db.collection('found_items').doc(req.params.id)
            doc = await dataRef.get()
        }
        let data = doc.data()
        data['uid'] = doc.id
        let like = false
        if(data['likes'].includes(req.session.uid)){
            like = true
        }
        let likeCount = data['likes'].length
        let commentRef = await dataRef.collection('comments').get()
        let commentData = []
        commentRef.forEach(doc=>commentData.push(doc.data()))


        return res.render("image-detail.ejs",{data,commentData,like, likeCount,csrfToken: req.csrfToken()})
    } catch (error) {
        console.log(error)
    }
})

app.post('/:id', isAuthenticated,async (req,res)=>{
    try {
        let uid = req.params.id
        let comment = req.body.comment
        let userRef = await db.collection('users').doc(req.session.uid).get()
        let userData = userRef.data()
        let data = {
            "comment": comment,
            "user": userData,
            "timestamp": Date.now()
        }
        dataRef =  db.collection('lost_items').doc(uid)
        let doc = await dataRef.get()
        if(!doc.exists){
            dataRef = db.collection('found_items').doc(uid)
            
        }

        await dataRef.collection('comments').add(data)
        console.log(data)

    return res.redirect(`/${uid}`)
    } catch (error) {
        console.log(error)
    }
})

app.get("/like/:id",isAuthenticated, async (req,res)=>{
    console.log("__________________")
    try {
        let uid = req.params.id

        dataRef =  db.collection('lost_items').doc(uid)
        let doc = await dataRef.get()
        if(!doc.exists){
            dataRef = db.collection('found_items').doc(uid)
            doc = await dataRef.get()
        }

        let items = doc.data()
        if(items['likes'].includes(req.session.uid)){
            items['likes'] = items['likes'].filter(item => item !== req.session.uid)
        } else {
            items['likes'].push(req.session.uid)
        }
        console.log("===============")
        dataRef.set(items)
       
        return res.redirect(`/${uid}`)
    } catch (error) {
        
    }
})

showTimes = () => {
    let result = '';
    const times = process.env.TIMES || 5;
    for (i = 0; i < times; i++) {
      result += i + ' ';
    }
    return result;
  }

app.listen(PORT, function() {
    console.log(`App running on port ${PORT}`)
})