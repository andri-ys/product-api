var supertest = require("supertest"),
  should = require("should"),
  server = supertest.agent("http://localhost:8080");
  
describe("Product API unit test", function(){
  //
  it("should return ok on home page", function(done){
    server
    .get("/api")
    .expect(200)
    .end(function(err){
      if (err){
        throw err;
      }
      done();
    });
  });
  //
  var _id = null;
  it("should be able to create a new product", function(done){
    var product = {
      title: "title",
      description: "description",
      size: "34",
      color: "magenta",
      price: 25,
      category: "unknown"      
    };
    
    server
    .post("/api/product")
    .send(product)
    .expect("Content-type", /json/)
    .expect(200)
    .end(function(err, res){
      if (err){
        throw err;
      }
      
      var data = res.body;
      data.should.have.property("_id");
      _id = data._id;
      data.title.should.equal(product.title);
      data.description.should.equal(product.description); 
      data.size.should.equal(product.size);
      data.color.should.equal(product.color);
      data.price.should.equal(product.price);      
      data.category.should.equal(product.category);
      done();
    })
  });
  //
  it("should be able to delete existing product", function(done){
    server
    .del("/api/product/" + _id)
    .expect(200)
    .end(function(err){
      if (err){
        throw err;
      }
      
      done();
    });
  });
  //
  it("should return not found on non-existed product", function(done){
    server
    .get("/api/product/" + _id)
    .expect(404)
    .end(function(err){
      if (err){
        throw err;
      }  
          
      done();
    });
  })
});