import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import swal from 'sweetalert';

function CreateProduct() {
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
  });

  const [productImages, setProductImages] = useState({ image: '', images: [] });
  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  const navigate = useNavigate();

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

  function handleAdditionalInputFields(e) {
    setProductImages({ ...productImages, images: e.target.files });
  }
  function handleInputFields(e) {
    let { name, value } = e.target;

    if (name === 'slug') {
      value = value.trim();
    }
    if (name === 'category') {
      let selectedCategory = categories.find((category) => {
        return category.slug === value;
      });
      setSubCategories(selectedCategory.subCategory);
      console.log(selectedCategory._id);
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
console.log('in side the create prtoduct', productImages)
  function handleFormSubmit(e) {
    e.preventDefault();
    // console.log(productFields)
    // console.log(productImages)

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
    axios
      .post('/api/products/createProduct', formData, {})
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message === 'Product Created') {
          swal('Product Created Successfully', "success");

          // toast.success('Product Created SuccessFully');
          navigate('/admin/products');
        }
      })
      .catch((err) => {
        swal({
          title: "Warning",
          text: getError(err),
          icon: "warning",
          button: "close",
        });
        // toast.error(getError(err));
        // console.log('error in create', err)
        navigate('/admin/products');
      });

    console.log(productFields.subCategory);
  }

  const handleChange = (val) => {
    if (val === 'true') {
      console.log('vsl in hsndle chsnge:::', val);
      // return (productFields.blackFridaySale = true);
      setProductFields({ ...productFields, blackFridaySale: true });
    } else {
      setProductFields({ ...productFields, blackFridaySale: false });

      // return (productFields.blackFridaySale = false);
    }
  };
  console.log('getting all fields', productFields);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Name</label>
            <input
              onChange={handleInputFields}
              name="name"
              className="form-control"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Slug</label>
            <input
              onChange={handleInputFields}
              name="slug"
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
              name="subCategory"
              defaultValue={''}
              onChange={handleInputFields}
            >
              <option value="">No Sub Category</option>
              {subCategories?.map((subCat) => (
                <option value={subCat.slug} key={subCat.slug}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <label>Price</label>
            <input
              onChange={handleInputFields}
              name="price"
              className="form-control"
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <label>Discount Price</label>
            <input
              onChange={handleInputFields}
              name="productDiscountedPrice"
              className="form-control"
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <label>Count in Stock</label>
            <input
              onChange={handleInputFields}
              name="countInStock"
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <label>Black Friday Sale</label>
          <select
            defaultValue=""
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
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Brand</label>
            <input
              onChange={handleInputFields}
              name="brand"
              className="form-control"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Description</label>
            <textarea
              name="description"
              onChange={handleInputFields}
              className="form-control"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Additional Info</label>
            <textarea
              name="additionalInfo"
              onChange={handleInputFields}
              className="form-control"
            />
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
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;
