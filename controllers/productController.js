const Product = require('../services/productService');

async function getAllProducts(req, res, next) {
    try{
        const products = await Product.getAllProducts();
        res.json({data: products});
    }catch(err){
        next(err);
    }
}

async function getProductById(req, res, next) {
    try {
        const product = await Product.getProductById(req.params.id);
        if (!product) return res.status(404).json({message: "Product not found"});
        res.json({data: product});
    } catch (err) {
        next(err);
    }
}

async function createProduct(req, res, next) {
    try{
        const newProduct = await Product.createProduct(req.body);
        res.status(201).json({data: newProduct});
    }catch(err){
        next(err);
    }
}

async function updateProduct(req, res, next){
    try{
        const updatedProduct = await Product.updateProduct(req.params.id, req.body);
        if(!updatedProduct){
            return res.status(404).json({message: "Product not found"});
        }
        res.json({data: updatedProduct});
    }catch(err){
        next(err);
    }
}

async function deleteProduct(req, res, next){
    try{
        const deletedProduct = await Product.deleteProduct(req.params.id);
        if(!deletedProduct){
            return res.status(404).json({message: "Product not found"});
        }
        res.json({message: "Product deleted successfully"});
    }catch(err){
        next(err);
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}