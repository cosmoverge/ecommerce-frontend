import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { MdDelete } from 'react-icons/md';
import { GrAddCircle } from 'react-icons/gr';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import swal from 'sweetalert';

function CreateCateogry() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      let result = await axios.get('/api/products/getAllCats');
      console.log(result.data);
      setCategoriesList(result.data);
    };
    fetchCategories();
  }, []);

  const [categoriesList, setCategoriesList] = useState([]);
  const [isUpdate, setUpdate] = useState(false);
  const [isUpdateForm, setUpdateForm] = useState({ status: false, data: {} });

  const [categoryInputs, setCategoryInputs] = useState({
    name: '',
    slug: '',
    subCategory: [{ name: '', slug: '' }],
  });
  function handleInputFields(e) {
    let { name, value } = e.target;
    if (name === 'slug') {
      value = value.trim();
    }

    setCategoryInputs({ ...categoryInputs, [name]: value });
  }

  function handleSubCat(e, index) {
    let { name, value } = e.target;
    if (name === 'slug') {
      value = value.trim();
    }

    let list = [...categoryInputs.subCategory];
    list[index][name] = value;
    setCategoryInputs({ ...categoryInputs, subCategory: list });
    console.log(categoryInputs.subCategory);
  }

  const addSubCategory = () => {
    setCategoryInputs({
      ...categoryInputs,
      subCategory: [...categoryInputs.subCategory, { name: '', slug: '' }],
    });
  };

  const deleteSubCategory = (index) => {
    // if (categoryInputs.subCategory.length <= 1) {
    //     return
    // }
    let filteredSubCat = categoryInputs.subCategory.filter((subCat, i) => {
      console.log(categoryInputs.subCategory.length >= 2);
      return i !== index;
    });
    setCategoryInputs({ ...categoryInputs, subCategory: filteredSubCat });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('/api/products/newCategory', categoryInputs)
      .then((res) => {
        if (res.data.message === 'Category Created') {
          swal('Category Created Successfully', "success");

          // toast.success('Category Created Successfully');
          navigate('/admin/products');
        }
      })
      .catch((err) => {
        // swal(getError(err), "warning");
        swal({
          title: "Warning",
          text: getError(err),
          icon: "warning",
          button: "close",
        });
        // toast.error(getError(err));
        navigate('/admin/products');
      });
  };

  const handleUpdateForm = (category) => {
    setUpdateForm({ status: true, data: category });
    setCategoryInputs({ ...category });
  };

  const deleteHandler = async (cat) => {
    console.log(cat);
    let catID = cat._id;

    try {
      let { data } = await axios.delete(
        `/api/products/deleteCategory/${catID}`
      );
      if (data.message === 'Category Deleted') {
        swal('Category Deleted Successfully', "success");

        // toast.success('Category Deleted Successfully');
        navigate('/admin/products');
      }
    } catch (error) {
      swal({
        title: "Warning",
        text: getError(error),
        icon: "warning",
        button: "close",
      });
      // toast.error(getError(error));
      navigate('/admin/products');
    }
  };

  const submitUpdateForm = async (e) => {
    e.preventDefault();
    console.log(categoryInputs);
    const categoryID = categoryInputs._id;

    try {
      const { data } = await axios.put(
        `/api/products/updateCategory/${categoryID}`,
        categoryInputs
      );
      if (data.message === 'Category Updated') {
        swal('Category updated Successfully', "success");

        // toast.success('Category Updated Successfully');
        navigate('/admin/products');
      }
    } catch (error) {
      swal({
        title: "Warning",
        text: getError(error),
        icon: "warning",
        button: "close",
      });
      // toast.error(getError(error));
      navigate('/admin/products');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-end">
        {!isUpdate ? (
          <Button
            type="submit"
            style={{ width: '220px' }}
            onClick={() => setUpdate(true)}
          >
            Update Existing Category
          </Button>
        ) : (
          !isUpdateForm.status && (
            <Button
              type="submit"
              style={{ width: '80px' }}
              onClick={() => setUpdate(false)}
            >
              Create
            </Button>
          )
        )}
      </div>
      {isUpdate ? (
        <>
          <h4 className="text-center">Update Form</h4>
          {!isUpdateForm.status && (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>Slug</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {categoriesList?.map((category) => (
                  <tr key={category._id}>
                    <td>{category._id}</td>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>

                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => handleUpdateForm(category)}
                      >
                        Edit
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => deleteHandler(category)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isUpdateForm.status && (
            <div>
              <form onSubmit={submitUpdateForm}>
                <div className="row">
                  <h4>Product Category</h4>
                  <div className="col-md-6 col-sm-12">
                    <label>Name</label>
                    <input
                      onChange={handleInputFields}
                      name="name"
                      value={categoryInputs.name}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <label>Slug</label>
                    <input
                      onChange={handleInputFields}
                      name="slug"
                      value={categoryInputs.slug}
                      className="form-control"
                    />
                  </div>
                </div>

                <h4>Product Sub Category</h4>
                {categoryInputs.subCategory?.map((subCat, i) => {
                  return (
                    <div className="row" key={i}>
                      <div className="col-md-5 col-sm-12">
                        <label>Name</label>
                        <input
                          onChange={(e) => handleSubCat(e, i)}
                          value={subCat.name}
                          name="name"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-5 col-sm-12">
                        <label>Slug</label>
                        <input
                          onChange={(e) => handleSubCat(e, i)}
                          value={subCat.slug}
                          name="slug"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-2 col-sm-12 action-icons-container">
                        <GrAddCircle
                          size={25}
                          onClick={() => addSubCategory()}
                        />
                        <MdDelete
                          size={25}
                          onClick={() => deleteSubCategory(i)}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="row justify-content-center mt-2">
                  <Button type="submit" style={{ width: '80px' }}>
                    Update
                  </Button>
                </div>
              </form>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <div className="row">
              <h4>Product Category</h4>
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

            <h4>Product Sub Category</h4>
            {categoryInputs.subCategory?.map((subCat, i) => {
              return (
                <div className="row" key={i}>
                  <div className="col-md-5 col-sm-12">
                    <label>Name</label>
                    <input
                      onChange={(e) => handleSubCat(e, i)}
                      value={subCat.name}
                      name="name"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-5 col-sm-12">
                    <label>Slug</label>
                    <input
                      onChange={(e) => handleSubCat(e, i)}
                      value={subCat.slug}
                      name="slug"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-2 col-sm-12 action-icons-container">
                    <GrAddCircle size={25} onClick={() => addSubCategory()} />
                    <MdDelete size={25} onClick={() => deleteSubCategory(i)} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="row justify-content-center mt-2">
            <Button type="submit" style={{ width: '80px' }}>
              Create
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreateCateogry;
