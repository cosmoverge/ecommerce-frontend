import Carousel from 'react-bootstrap/Carousel';
import React, { useEffect, useReducer, useState } from 'react';
// import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import axios from 'axios';
// import LoadingBox from '../LoadingBox';
// import MessageBox from '../MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, sliders: action?.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action?.payload };
    default:
      return state;
  }
};

function Slider() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const [{ sliders }, dispatch] = useReducer(reducer, {
    sliders: [],
    loading: true,
    error: '',
  });
  // console.log("Hello from slider")

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/sliders');
        // console.log(result.data)
        dispatch({ type: 'FETCH_SUCCESS', payload: result?.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const navigateToSlider = (slide) => {
    console.log('slide', slide);
    if (
      slide?.sliderType === 'category' ||
      slide?.sliderType === 'subCategory'
    ) {
      let sliderValue = slide?.category;
      if (slide?.sliderType === 'subCategory') {
        sliderValue = slide?.subCategory;
      }
      let navValues = {
        sliderType: slide?.sliderType,
        sliderValue,
        name: slide?.name,
      };
      navigate(`/slider/${slide?._id}`, { state: navValues });
    } else {
      navigate(`/product/sliderProduct`, { state: slide?.productID });
    }
  };
  return (
    <Carousel
      style={{ width: '100%' }}
      activeIndex={index}
      onSelect={handleSelect}
    >
      {sliders?.map((slide, i) => {
        return (
          <Carousel.Item key={i} style={{ height: '300px' }}>
            <Row>
              <Col className="hero__section">
                <div onClick={() => navigateToSlider(slide)}>
                  <img
                    // backgroundColor="green"
                    className="d-block w-100"
                    src={slide.images[0]}
                    alt={slide.name}
                    width="100%"
                    height="400"
                    style={{
                      display: 'block',
                      maxHeight: '350px',
                      width: 'auto',
                      height: 'auto',
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}

export default Slider;
