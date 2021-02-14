const Category = require("../models/category");
const slugify = require("slugify");
const shortId = require('shortid')
function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type:cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.addCategory = (req, res) => {
  const CategoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortId.generate()}`,
  };
  if (req.file) {
    CategoryObj.categoryImage =req.file.location;
  }

  if (req.body.parentId) {
    CategoryObj.parentId = req.body.parentId;
  }
  const categ = new Category(CategoryObj);
  categ.save((error, category) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (category) {
      return res.status(201).json({ category });
    }
  });
};
exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) {
      res.status(400).json({ error });
    }
    if (categories) {
      const categoriList = createCategories(categories);
      res.status(200).json({ categoriList });
    }
  });
};
exports.updateCategories= async (req,res)=>{
  const {_id,name,parentId,type}=req.body
  const updatedCategories=[]
  if(name instanceof Array){
        for(let i=0;i<name.length;i++){
          const category={
            name:name[i],
            type:type[i]
          }
            if(parentId[i] !== ""){
              category.parentId=parentId[i]          
            }
         const updatedCategory= await Category.findOneAndUpdate({_id:_id[i]},category,{new:true})
              updatedCategories.push(updatedCategory)
            
        }
        return res.status(201).json({ updatedCategories })
  }else{
        const category={
          name,
          type
        }
        if(parentId !== ""){
          category.parentId = parentId
        }
        const updatedCategory=  await Category.findOneAndUpdate({_id:_id},category,{new:true})
          return res.status(201).json({updatedCategory})
      }
  
}
exports.deleteCategories = async(req,res)=>{
  const {ids} = req.body.payload;
  const deletedCategories =[];
  for(let i=0;i<ids.length;i++){
        const deleteCategory = await Category.findOneAndDelete({_id: ids[i]._id})  
          deletedCategories.push(deleteCategory)
      }
      if(deletedCategories.length == ids.length){
       res.status(200).json({message:'Categories removed'})
      }else{
        res.status(400).json({message:'somthing went wrong'})
      }
}


