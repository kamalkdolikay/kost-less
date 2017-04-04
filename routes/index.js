var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var multer = require('multer');

var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Order = mongoose.model('Order');
var ProductCat = mongoose.model('ProductCat');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET dashboard page. */
router.get('/dashboard', function(req, res, next) {
    res.render('dashboard');
});

/* GET admin dashboard page. */
router.get('/admin', function(req, res, next) {
    console.log("session ", req.session)
    if (req.session) {
        if (req.session.passport.user == '58d3b91a306f5b1de2628183') {
            res.render('admin_dash');
        } else {
            res.render('error')
        }
    }
});

/* GET posts page. */
router.get('/posts', function(req, res) {
    User.find({}, function(err, docs) {
        res.send(docs);
    });
});

/* GET posts page. */
router.get('/products', function(req, res) {
    Product.find({ status: "ok" }, function(err, docs) {
        res.send(docs);
    });
});

/* POST posts page. */
router.post('/cproduct', function(req, res) {
    console.log("all ", req.body)
    Product.find({ product_id: req.body.id }, function(err, docs) {
        console.log("err", err)
        console.log("docs", docs)
        res.send(docs);
    });
});

/* GET orders page. */
router.get("/orders", function(req, res) {
    Order.find({}, function(err, data) {
        res.send(data);
    });
});

/* GET orders page. */
router.get("/getcat", function(req, res) {
    ProductCat.find({}, function(err, data) {
        res.send(data);
    });
});

/* GET orders page. */
router.get("/corders", function(req, res) {
    Order.find({ "user_id": req.session.passport.user }).populate("user_id").populate("product_id").exec(function(err, docs) {
        if (err) {
            res.json({ "err": err });
        } else {
            res.json(docs);
        }
    });
});

/* GET posts page. */
router.get("/cpost", function(req, res) {
    User.findById({ "_id": req.session.passport.user }, function(err, data) {
        res.send(data);
    });
});

router.get("/lastid", function(req, res) {
    Product.find().limit(1).sort({ $natural: -1 }).exec(function(err, docs) {
        if (err) {
            res.json({ "err": err });
        } else {
            res.json(docs);
        }
    });
});

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
});

router.get('/pagination', function(req, res) {
    res.render('pagination');
});

router.get('/select', function(req, res) {
    res.render('ui-select');
});

router.get('/test', function(req, res) {
    res.render('test');
});

router.get('/dashboard/user', function(req, res) {
    res.render('user');
});

router.get('/dashboard/orders', function(req, res) {
    res.render('orders');
});

router.post("/productcat", function(req, res) {
    console.log("product cat ", req.body)
    ProductCat({
        category: req.body.category
    }).save(function(err, docs) {
        if (docs == null) {
            res.json({ "message": err })
        } else {
            res.json({ "message": "success" })
        }
    })
})

/* POST cpost page. */
router.post("/cpost", function(req, res) {
    console.log("values ", req.body);
    User.findByIdAndUpdate(req.session.passport.user, {
        $set: {
            firstname: req.body.first,
            lastname: req.body.last,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            postalcode: req.body.postal,
            aboutme: req.body.about
        }
    }, function(err, docs) {
        console.log(docs);
        console.log(err);
        if (docs == null) {
            res.json({ "err": err });
        } else {
            res.json({ "message": "success" });
        }

    });
});

/* POST register page. */
router.post('/register', function(req, res, next) {
    passport.authenticate('register', function(err, user, info) {
        console.log("err ", err);
        console.log("user ", user);
        if (err) {
            return next(err);
        }
        if (!user) {
            var lol = info.alert.code;
            return res.send({ success: false, message: lol });
        } else {
            return res.send({ success: true, message: 'user registered' });
        }
    })(req, res, next);
});

/* POST login page. */
router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        console.log("err ", err);
        console.log("user ", user);
        console.log("info ", info);
        if (err) {
            return next(err);
        }

        if (!user) {
            var lol = info.alert;
            return res.send({ success: false, message: lol });
        }

        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.send({ success: true, message: 'user authenticated', type: user.type });
        });
    })(req, res, next);
});

/* POST upload page. */
router.post('/upload', function(req, res) {
    var datetimestamp = Date.now();
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/images');
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
    });

    var upload = multer({
        storage: storage
    }).single('file');
    upload(req, res, function(err) {
        console.log("file", req.file);
        console.log("all", req.body);
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        } else {
            //console.log(datetimestamp)
            User.findByIdAndUpdate(req.session.passport.user, { $set: { image: req.file.filename } }, function(err, docs) {
                console.log(docs);
                if (docs == null) {
                    res.json({ "err": err });
                } else {
                    res.json({ error_code: 0, err_desc: null });
                }

            });

        }
    });
});

/* POST delete page. */
router.post("/delete", function(req, res) {
    console.log("session ", req.session.passport.user);
    console.log("req name ", req.body.name);
    if (req.session) {
        if (req.session.passport.user) {
            User.findOneAndRemove({ username: req.body.name }, function(err, docs) {
                if (docs == null) {
                    res.json({ "message": "error" });
                } else {
                    res.json({ "message": "success" });
                }
            });
        } else {
            res.json({ "message": "please login" });
        }
    }
});

router.post("/addproduct", function(req, res) {
    var datetimestamp = Date.now();
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/images');
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
    });
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;

    var upload = multer({
        storage: storage
    }).single('file');
    upload(req, res, function(err) {
        console.log("all", req.body);
        console.log("file", req.file);
        console.log("filename", req.file.filename);
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        } else {
            Product({
                product_id: req.body.id,
                product_name: req.body.name,
                product_price: req.body.price,
                product_category: req.body.category,
                image: req.file.filename,
                date: today
            }).save(function(err, docs) {
                console.log("docs ", docs);
                console.log("err ", err);
                if (docs == null) {
                    res.json({ "message": "error" });
                } else {
                    res.json({ error_code: 0, err_desc: null });
                }
            });

        }
    });
});

router.post("/delproduct", function(req, res) {
    console.log("id", req.body.id);
    /*Product.findOneAndRemove*/
    Product.update({ product_id: req.body.id }, { $set: { status: "deleted" } }, function(err, docs) {
        console.log("error ", err);
        console.log("data ", docs);
        if (docs == null) {
            res.json({ "message": "error" });
        } else {
            res.json({ "message": "success" });
        }
    });
});

router.post("/uproduct", function(req, res) {
    var datetimestamp = Date.now();
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/images');
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
    });

    var upload = multer({
        storage: storage
    }).single('file');

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = mm + '/' + dd + '/' + yyyy;
    upload(req, res, function(err) {
        console.log("all", req.body);
        console.log("file", req.file);
        console.log("filename", req.file.filename);
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        } else {
            Product.update({ product_id: req.body.id }, {
                $set: {
                    product_name: req.body.name,
                    product_price: req.body.price,
                    product_category: req.body.category,
                    image: req.file.filename,
                    date: today
                }
            }, function(err, docs) {
                console.log("err", err);
                console.log("docs", docs);
                if (docs == "") {
                    res.json({ "message": err });
                } else {
                    res.json({ "message": "success", error_code: 0 });
                }
            });
        }
    })
});

router.post("/orders", function(req, res) {
    console.log("req.body", req.body)
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = mm + '/' + dd + '/' + yyyy;
    Product.find({ product_name: req.body.name }, function(err, docs) {
        console.log("docs", docs)
        if (docs == "") {
            res.json({ "err": err });
        } else {
            var id = docs[0]["_id"];
            var price = docs[0]["product_price"];
            if (req.session) {
                Order({
                    product_id: id,
                    product_price: price,
                    user_id: req.session.passport.user,
                    date: today
                }).save(function(err, docs) {
                    if (err) {
                        res.json({ "message": "error" });
                    } else {
                        res.json({ "message": "success" });
                    }
                });
            } else {
                res.json({ "err": "please login" });
            }
        }
    });
});




module.exports = router;