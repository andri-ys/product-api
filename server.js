var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    
    //Mongoose schema definition
    productSchema = new mongoose.Schema({
        title       :   String,
        description :   String,
        size        :   String,
        color       :   String,
        price       :   Number,
        category    :   String        
    }),
    
    productModel = mongoose.model('Product', productSchema),
    mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost:27017/test";
    
mongoose.connect(mongoUri, function(err){
    if (err){
        console.error(err);
    }else{
        console.log("mongoose connected");
    }
});    
    
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
};
    
express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))   
    //API routes
    .get("/api", function(req, res){
        res.status(200).json({ message: "OK" });    
    })
    
    .get("/api/product", function(req, res){
        var filter = {};
        
        if (req.query.size){
            filter.size = req.query.size;
        }
        
        if (req.query.color){
            filter.color = req.query.color;
        }
        
        if (req.query.minPrice || req.query.maxPrice){
            filter.price = {};
            if (req.query.minPrice){
                filter.price.$gte = req.query.minPrice;
            }
            
            if (req.query.maxPrice){
                filter.price.$lte = req.query.maxPrice;
            }
        }
                                
        productModel.find(filter, function(err, products){
            if (err){
                handleError(res, err.message, "Get Product");
            }else{
                res.status(200).json(products);
            }      
        });
    })
    
    .get("/api/product/:id", function(req, res){
        productModel.findById(req.params.id, function(err, product){
            if (err){
                handleError(res, err.message, "Get Product By Id", 404);
            }else{
                res.status(200).json(product);
            }
        });
    })
    
    .post("/api/product", function(req, res){
        var newProduct = new productModel(req.body);
        newProduct.save(function(err){
            if (err){
                handleError(res, err.message, "Post Product");
            }else{
                res.status(200).json(newProduct);
            }
        });
    })
    
    .delete("/api/product/:id", function(req, res){
        productModel.remove({ _id : req.params.id }, function(err){
           if (err){
               handleError(res, err.message, "Delete Product");
           }else{
                res.status(200).json({ message: "OK" });   
           }
        });
    })
    
    .listen(process.env.PORT || 8080);