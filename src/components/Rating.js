import React from 'react';
import Icon from '@mdi/react';
import { mdiHexagramOutline } from '@mdi/js';
export default function Rating(props) {
  return (
    <div className="rating">
      <div className="rating-star">
        {/* <i
          className={
            props.rating >= 1
              ? 'fas fa-star'
              : props.rating >= 0.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        /> */}
        {props.rating}

        <svg
          height="20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path
            fill="#cbeb2f"
            d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
          />
        </svg>
      </div>
      {/* <span>
        <i
          className={
            props.rating >= 2
              ? 'fas fa-star'
              : props.rating >= 1.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span> */}
      {/* <span>
        <i
          className={
            props.rating >= 3
              ? 'fas fa-star'
              : props.rating >= 2.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span> */}
      {/* <span>
        <i
          className={
            props.rating >= 4
              ? 'fas fa-star'
              : props.rating >= 3.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span> */}
      {/* <span>
        <i
          className={
            props.rating >= 5
              ? 'fas fa-star'
              : props.rating >= 4.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      </span> */}
      {props.caption ? (
        <span style={{ color: '#6aa907' }}>{props.caption}</span>
      ) : (
        <span>{' ' + props.numReviews + ' reviews'}</span>
      )}
    </div>
  );
}
