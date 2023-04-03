import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';
function SubMenuComp({ category }) {
  const [subMenu, setSubMenu] = useState(false);
  const handleSidebar = () => {
    setSubMenu(!subMenu);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Nav.Item>
      <NavLink
        to={`/products/categories?type=category&name=${category.slug}`}
        style={{ textDecoration: 'none', color: 'white', fontSize: '18px' }}
      >
        {category.name}
      </NavLink>
      {subMenu ? (
        <RiArrowUpSFill onClick={handleSidebar} />
      ) : (
        <RiArrowDownSFill onClick={handleSidebar} />
      )}
      <div className="side-bar-sub-category-div">
        {subMenu &&
          category?.subCategory &&
          category.subCategory.map((item, i) => (
            <NavLink
              className="sub-menu-item"
              key={i}
              to={`/products/categories?type=subCategory&name=${item.slug}`}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              {item.name}
            </NavLink>
          ))}
      </div>
    </Nav.Item>
  );
}

export default SubMenuComp;
