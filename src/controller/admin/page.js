const Page = require("../../models/page");
const cloudinary = require('../../../utiles')
exports.createPage =async (req,res)=>{
    const {banners,products}=req.files;
    const uploader = async (path) => await cloudinary.uploads(path, 'Pages');
    if(banners.length > 0){
     req.body.banners=[]
        for (let i = 0; i < banners.length; i++) {
            const { path } = banners[i];
            const newPath = await uploader(path)
            req.body.banners.push({
                img:`${newPath.url}`,
                navigateTo:`/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`
            })
        }

    }
    if(products.length > 0){
        req.body.products=[]
           for (let i = 0; i < products.length; i++) {
               const { path } = products[i];
               const newPath = await uploader(path)
               req.body.products.push({
                   img:`${newPath.url}`,
                   navigateTo:`/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`
               })
           }
   
       }

    req.body.createdBy=req.user._id;
    Page.findOne({category:req.body.category})
    .exec((error,page)=>{
        if(error) return res.status(400).json({error})
        if(page){
            Page.findOneAndUpdate({category :req.body.category},req.body)
            .exec((error,updatedPage)=>{
                if(error) return res.status(400).json({error})
                if(updatedPage){
                    return res.status(201).json({page:updatedPage})
                }
            })
        }else{
            const page =new Page(req.body)
            page.save((error,page)=>{
                if(error){
                  return  res.status(400).json({error})
                }
                if(page){
                    return res.status(201).json({page})
                }
            })
        }
    })
    
}
exports.getPage =(req,res) =>{
    const {category,type}=req.params;
    if(type === "page"){
        Page.findOne({category:category})
        .exec((error,page)=>{
            if(error) return res.status(400).json({error});
            if(page) return res.status(200).json({page})
        })
    }
}