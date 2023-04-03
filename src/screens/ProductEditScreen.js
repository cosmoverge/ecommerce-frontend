import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import LoadingBox from '../components/LoadingBox';
// import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
// import ListGroup from 'react-bootstrap/ListGroup';
// import { Helmet } from 'react-helmet-async';
import swal from 'sweetalert';

export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [productFields, setProductFields] = useState({
    name: '',
    slug: '',
    brand: '',
    category: '',
    subCategory: '',
    description: '',
    additionalInfo:'',
    price: '',
    countInStock: '',
    productDiscountedPrice: '',
    categoryID: '',
    blackFridaySale: false,
    
  });

  const [productImages, setProductImages] = useState({ image: '', images: [] });
  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/getAllCats`);
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      let { data } = await axios.get(`/api/products/${productId}`);
      setProductFields({ ...data });
      // setProductImages({...productImages,image:data.image,images:data.images})
    };
    fetchProduct();
  }, [productId]);

  function handleAdditionalInputFields(e) {
    setProductImages({ ...productImages, images: e.target.files });
  }
  const handleChange = (val) => {
    if (val === 'true') {
      console.log('vsl in hsndle chsnge:::', val);
      // return (productFields.blackFridaySale = true);
      setProductFields({ ...productFields, blackFridaySale: true });
    } else if (val === 'false') {
      setProductFields({ ...productFields, blackFridaySale: false });

      // return (productFields.blackFridaySale = false);
    }
  };
  console.log('in side edit screen', productFields.blackFridaySale);
  useEffect(() => {
    if (productFields.category) {
      let selectedCategory = categories.find((category) => {
        return category.slug === productFields.category;
      });
      setSubCategories(selectedCategory?.subCategory);
    }
  }, [categories, productFields.category]);

  function handleInputFields(e) {
    const { name, value } = e.target;
    if (name === 'category') {
      let selectedCategory = categories.find((category) => {
        return category.slug === value;
      });
      setSubCategories(selectedCategory.subCategory);
      setProductFields({
        ...productFields,
        categoryID: selectedCategory._id,
        category: value,
      });
      return;
    }
    setProductFields({ ...productFields, [name]: value });
  }

  function handleMainFile(e) {
    setProductImages({ ...productImages, image: e.target.files[0] });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    // console.log(productFields)
    // console.log(productImages)

    let filesStatus = 'NO_UPDATE';
    if (productImages.image && productImages.images.length > 0) {
      filesStatus = 'ALL_IMAGES';
    } else if (productImages.images.length > 0) {
      filesStatus = 'ADDITIONAL_IMAGE';
    } else if (productImages.image) {
      filesStatus = 'MAIN_IMAGE';
    }

    const formData = new FormData();
    formData.append('file', productImages.image);
    for (let i = 0; i < productImages.images.length; i++) {
      formData.append('file', productImages.images[i]);
    }
    console.log(productFields);
    formData.append('name', productFields.name);
    formData.append('slug', productFields.slug);
    formData.append('brand', productFields.brand);
    formData.append('category', productFields.category);
    formData.append('subCategory', productFields.subCategory);
    formData.append('description', productFields.description);
    formData.append('additionalInfo',productFields.additionalInfo);
    formData.append('price', productFields.price);
    formData.append('countInStock', productFields.countInStock);
    formData.append(
      'productDiscountedPrice',
      productFields.productDiscountedPrice
    );
    formData.append('categoryID', productFields.categoryID);
    formData.append('IMAGE_STATUS', filesStatus);
    formData.append('blackFridaySale', productFields.blackFridaySale);

    try {
      const { data } = await axios.put(`/api/products/${productId}`, formData, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      if (data.message === 'Product Updated') {
        swal('Product Updated Successfully', "success");

        // toast.success('Product Updated Successfully');
        navigate('/admin/products');
      }
    } catch (error) {
      // swal(getError(error), "warning");
      swal({
        title: "Warning",
        text: getError(error),
        icon: "warning",
        button: "close",
      });
      // toast.error(getError(error));
      navigate('/admin/products');
    }
  }
  console.log('getting all fields', productFields);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // console.log('form data', formData);
  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Name</label>
            <input
              onChange={handleInputFields}
              value={productFields.name}
              name="name"
              className="form-control"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Slug</label>
            <input
              onChange={handleInputFields}
              name="slug"
              value={productFields.slug}
              className="form-control"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Category</label>
            <select
              className="form-select"
              name="category"
              value={productFields.category}
              onChange={handleInputFields}
            >
              {categories?.map((category) => (
                <option value={category.slug} key={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Sub Category</label>
            <select
              className="form-select"
              value={productFields.subCategory}
              name="subCategory"
              onChange={handleInputFields}
            >
              {subCategories?.map((subCat) => (
                <option value={subCat.slug} key={subCat.slug}>
                  {subCat.name}
                </option>
              ))}
              <option value="">No Sub Category</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <label>Price</label>
            <input
              onChange={handleInputFields}
              name="price"
              value={productFields.price}
              className="form-control"
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <label>Discount Price</label>
            <input
              onChange={handleInputFields}
              name="productDiscountedPrice"
              value={productFields.productDiscountedPrice}
              className="form-control"
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <label>Count in Stock</label>
            <input
              onChange={handleInputFields}
              name="countInStock"
              value={productFields.countInStock}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Brand</label>
            <input
              onChange={handleInputFields}
              name="brand"
              value={productFields.brand}
              className="form-control"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Description</label>
            <textarea
              name="description"
              onChange={handleInputFields}
              value={productFields.description}
              className="form-control"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Additional Info</label>
            <textarea
              name="additionalInfo"
              onChange={handleInputFields}
              value={productFields.additionalInfo}
              className="form-control"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Black Friday Sale</label>
            <select
              value={productFields.blackFridaySale}
              // defaultValue=""
              onChange={(e) => {
                console.log('e:', e);
                handleChange(e.target.value);
              }}
            >
              <option value="">select</option>

              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Main Image</label>
            <input
              onChange={handleMainFile}
              name="singleFile"
              type="file"
              className="form-control"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Additional Images</label>
            <input
              onChange={handleAdditionalInputFields}
              name="additionalFiles"
              type="file"
              className="form-control"
              multiple
            />
          </div>
        </div>

        <div className="row justify-content-center mt-2">
          <Button
            style={{ width: '80px', marginRight: '10px' }}
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
          <Button type="submit" style={{ width: '80px' }}>
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
