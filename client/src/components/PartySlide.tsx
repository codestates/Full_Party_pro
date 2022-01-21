import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faMapMarkerAlt, faCalendarAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';

export const PartySlideContainer = styled.div`
  width: 100%;
  height: 100%;  

  padding: 0 20px;
  margin-bottom: 50px;

  .cover {
    cursor: pointer;
  }

  h3 {
    color: #fff;
    margin: 10px;
    text-align: center;
    border-radius: 20px;

    .partyImg {
      width: 100%;
      height: 250px;

      padding: 50px 20px;
      border-radius: 20px;

      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    @media screen and (max-width: 480px) {
      .partyImg {
        height: 180px;
      }
    }

    .title {
      height: 30px;
      
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 3.5px;
    }

    .location, .date {
      font-size: 1rem;
      font-weight: normal;
    }

    .location {
      margin-bottom: 3px;
    }
  }

  .slick-next, .slick-prev {
    font-size: 1rem !important;
    text-align: center;
    color: #000;

    &:hover {
      color: #000;
    }

    &.slick-disabled {
      color: #d5d5d5;

      &.hover {
        color: #d5d5d5 !important;
      }
    }
  }

  .slick-next:before, .slick-prev:before {
    content: '';
  }
  
  .center h3 {
      transition: all .3s ease;
  }

  .slick-dots li.slick-active button:before { 
    opacity: 1; 
    color: #50C9C3; 
  }
`

function NextArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={ faChevronRight } />
    </div>
  );
}

function PrevArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={ faChevronLeft } />
    </div>
    
  );
}

type Props = {
  myParty: Array<{[key: string]: any}>,
}

export default function PartySlide ({ myParty }: Props) {
  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 400,
    slidesToShow: (myParty.length <= 3 ? 1 : 3),
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const navigate = useNavigate();

  function formatDate(date: Date){
    // const date = timestamp.getDate();
    // const month = timestamp.getMonth() + 1;
    // const year = timestamp.getFullYear();

    // return year + "/" + month + "/" + date;

    return String(date).slice(0, 11);
  }

  return (
    <PartySlideContainer>
      <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
			<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
				<Slider {...settings}>
          {myParty.map((party, idx) => {
            const { id, name, image, startDate, endDate, isOnline, location } = party;
            const region = location && location.split(" ").length >= 2 ? location.split(" ")[0] + " " + location.split(" ")[1] : location;
            return (
              <div key={idx} className="cover" onClick={() => navigate(`../party/${id}`)}>
                <h3 style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }} >
                  <div className="partyImg" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
                    <div className="title">{name}</div>
                    <div className="location">
                      {isOnline ? <><FontAwesomeIcon icon={ faGlobe } className="icon" /> 온라인 퀘스트</>
                       : <><FontAwesomeIcon icon={ faMapMarkerAlt } className="icon" /> {region}</>}
                    </div>
                    <div className="date"><FontAwesomeIcon icon={ faCalendarAlt } className="icon" /> {formatDate(startDate)} ~ {formatDate(endDate)}</div>  
                  </div>
                </h3>
              </div>
            )
          })}
				</Slider>
    </PartySlideContainer>
  );
}