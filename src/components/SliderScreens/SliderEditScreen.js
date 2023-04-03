import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
// import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { getError } from '../../utils';
// import LoadingBox from '../LoadingBox';
// import MessageBox from '../MessageBox';
import swal from 'sweetalert';

export default function ProductEditScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    // cart: { shippingAddress },
  } = state;
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;
  console.log(productId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/getAllCats`);
        console.log(data);
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  // const uploadFileHandler = (e) => {
  //   console.log(e.target.files);
  //   setSliderFiles(e.target.files);
  // };

  useEffect(() => {
    const fetchDetails = async () => {
      const { data } = await axios.get(
        `/api/sliders/${productId}`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setSliderFields({ ...data });
    };
    fetchDetails();
  }, [productId, userInfo.token]);

  const [sliderFields, setSliderFields] = useState({
    name: '',
    brand: '',
    category: '',
    subCategory: '',
    description: '',
    productID: '',
    sliderType: '',
  });
  const [sliderFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (sliderFields.category) {
      let selectedCategory = categories.find((category) => {
        return category.slug === sliderFields.category;
      });
      setSubCategories(selectedCategory?.subCategory);
    }
  }, [categories, sliderFields.category]);

  const handleSlideFields = (e) => {
    let { name, value } = e.target;
    if (name === 'category') {
      let selectedCategory = categories.find((category) => {
        return category.slug === value;
      });
      setSubCategories(selectedCategory.subCategory);
    }

    setSliderFields({ ...sliderFields, [name]: value });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const submitUpdateForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    for (let i = 0; i < sliderFiles.length; i++) {
      formData.append('file', sliderFiles[i]);
    }
    console.log(sliderFields);
    formData.append('name', sliderFields.name);
    formData.append('brand', sliderFields.brand);
    formData.append('category', sliderFields.category);
    formData.append('subCategory', sliderFields.subCategory);
    formData.append('productID', sliderFields.productID);
    formData.append('description', sliderFields.description);

    try {
      const { data } = await axios.put(
        `/api/sliders/${productId}`,
        sliderFields,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data.message === 'Slider Updated') {
        swal("Slider Updated Successfully", "success");

        // toast.success('Slider Updated Successfully');
        navigate('/admin/sliders');
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
      navigate('/admin/sliders');
    }
  };

  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    // console.log(images);
    // console.log(images.filter((x) => x !== fileName));
    // setImages(images.filter((x) => x !== fileName));
    swal('Image removed successfully. click Update to apply it', "success");

    // toast.success('Image removed successfully. click Update to apply it');
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>
      {/* 
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : ( */}
      <Form onSubmit={submitUpdateForm}>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Slider Name</label>
            <input
              value={sliderFields.name}
              className="form-control"
              name="name"
              onChange={handleSlideFields}
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Brand Name</label>
            <input
              value={sliderFields.brand}
              className="form-control"
              name="brand"
              onChange={handleSlideFields}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Category</label>
            <select
              className="form-select"
              value={sliderFields.category}
              name="category"
              onChange={handleSlideFields}
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
              value={sliderFields.subCategory}
              name="subCategory"
              onChange={handleSlideFields}
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
          <div className="col-md-6 col-sm-12">
            <label>Product Id</label>
            <input
              className="form-control"
              value={sliderFields.productID}
              name="productID"
              onChange={handleSlideFields}
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Description</label>
            <textarea
              className="form-control"
              value={sliderFields.description}
              name="description"
              onChange={handleSlideFields}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Slider Type</label>
            <select
              className="form-select"
              value={sliderFields.sliderType}
              name="sliderType"
              onChange={handleSlideFields}
            >
              <option>Choose option</option>
              <option value="category">Category</option>
              <option value="subCategory">Sub Category</option>
              <option value="product">Product</option>
            </select>
          </div>
        </div>

        <div className="row justify-content-center mt-2">
          <Button
            style={{ width: '80px', marginRight: '10px' }}
            onClick={() => navigate('/admin/sliders')}
          >
            Cancel
          </Button>
          <Button type="submit" style={{ width: '80px' }}>
            Update
          </Button>
        </div>
      </Form>
    </Container>
  );
}
