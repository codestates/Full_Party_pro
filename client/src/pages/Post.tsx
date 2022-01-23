import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import AWS from 'aws-sdk';
import PostMap from '../components/PostMap';
import PostCancelModal from '../components/PostCancelModal';
import Slider from 'rc-slider';
import ErrorModal from '../components/ErrorModal';
import Loading from '../components/Loading';
import { useNavigate, Navigate } from 'react-router-dom';
import { cookieParser } from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowLeft, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RootReducerType } from '../store/store';

export const PostContainer = styled.div`
  width: 100%;
  background-color: #fff;
  position: absolute;
  left: 0;
  z-index: 910;
  margin: 60px 0;
  overflow: hidden;
`;

export const TopNavigation = styled.nav`
  width: 100vw;
  height: 60px;
  padding: 0 20px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 920;
  background-color: #fff;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  button {
    color: #777;
    font-size: 12pt;
    font-weight: bold;
    background-color: white;
    border: none;
    cursor: pointer;

    &.post {
      margin-right: 10px;

      &:disabled {
        color: #d5d5d5;
      }
    }
  }
`;

export const BottomNavigation = styled.nav`
  width: 100vw;
  height: 60px;
  padding: 0 20px;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 920;
  background-color: #fff;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  button {
    width: 25vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #777;
    font-size: 10pt;
    background-color: #fff;
    border: none;
    cursor: pointer;

    .icon {
      font-size: 16pt;
      margin-bottom: 3px;
    }
  }
`;

export const PostCard = styled.div`
  width: 100%;
  padding: 40px 10%;
  display: flex;
  flex-direction: column;

  fieldset {
    border: none;
    margin-bottom: 30px;

    .label {
      margin-bottom: 10px;
      font-size: 1rem;
      font-weight: bold;

      &.content {
        margin-bottom: 15px;
        display: flex;
        align-items: center;

        .error {
          margin-top: 0;
          margin-left: 10px;
          font-weight: normal;
        }
      }
    }

    input {
      width: 100%;
      height: 25px;
      border: none;
      border-bottom: 1px solid #d5d5d5;
      padding: 5px;

      &:focus {
        outline-style:none;
      }
    }

    .details {
      font-size: 0.8rem;
      color: #777;
      margin-bottom: 5px;
    }
  }

  .basicInfo {

    .imageContainer {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 100%;
        max-height: 40vh;
      }
      button {
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 100%;
        background: rgba(255, 255, 255, 0.6);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      }
    }

    .infoContainer {
      margin-top: 20px;
    }

    fieldset {
      &:focus {
        outline-style:none;
      }

      .date {
        font-size: 0.8rem;
        font-weight: bold;
        margin-bottom: 5px;
      }

      input[type=date] {
        font-family: "-apple-system";
        background-color: #fff;
      }

      div.startDate {
        margin-bottom: 10px;
      }
    }
  }

  .locationTitle {
    color: #000;

    button {
      background-color: white;
      border: none;
      font-weight: bold;
      cursor: pointer;

      &.unfocused {
        font-weight: normal;
        color: #777;
      }
    }
  }

  .mapDesc {
    width: 100%;
    height: 230px;
    margin: 20px 0;
  }

  textarea {
    width: 100%;
    height: 300px;
    padding: 15px;
    border: 1px solid #d5d5d5;
    font-family: "-apple-system";

    &:focus {
      outline-style:none;
    }
  }

  .error {
    font-size: 12px;
    color: #f34508;
    margin-top: 8px;
  }

  .btn {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }

  @media screen and (min-width: 790px) {
    padding: 40px 20%;
  }
`;

export const SliderContainer = styled.div`
  .sign {
    opacity: 0;
    position: absolute;
    margin-left: -11px;
    top: -39px;
    z-index: 920;
    background-color: #50C9C3;
    color: #fff;
    width: 28px;
    height: 28px;
    border-radius: 28px;
    -webkit-border-radius: 28px;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    text-align: center;

    &:after {
      position: absolute;
      content: '';
      left: 0;
      border-radius: 16px;
      top: 19px;
      border-left: 14px solid transparent;
      border-right: 14px solid transparent;
      border-top-width: 16px;
      border-top-style: solid;
      border-top-color: #50C9C3;
    }

    & > span {
      font-size: 12px;
      font-weight: 700;
      line-height: 28px;
    }
  }

  &:hover {
    .sign {
      opacity: 1;
    }
  }

  .rc-slider {
    position: relative;
    height: 14px;
    padding: 5px 0;
    width: 100%;
    border-radius: 6px;
    touch-action: none;
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .rc-slider * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .rc-slider-rail {
    position: absolute;
    width: 100%;
    background-color: #e9e9e9;
    height: 10px;
    border-radius: 6px;
  }

  .rc-slider-track {
    position: absolute;
    left: 0;
    height: 10px;
    border-radius: 6px;
    background-color: #50C9C3;
  }

  .rc-slider-handle {
    position: absolute;
    width: 16px;
    height: 16px;
    cursor: pointer;
    cursor: -webkit-grab;
    margin-top: -3px;
    cursor: grab;
    border-radius: 50%;
    border: solid 2px #50C9C3;
    background-color: #fff;
    touch-action: pan-x;
  }

  .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging {
    border-color: #50C9C3;
    box-shadow: 0 0 0 5px #50C9C3;
  }

  .rc-slider-handle:focus {
    outline: none;
  }

  .rc-slider-handle-click-focused:focus {
    border-color: #50C9C3;
    box-shadow: unset;
  }

  .rc-slider-handle:hover {
    border-color: #50C9C3;
  }

  .rc-slider-handle:active {
    border-color: #50C9C3;
    box-shadow: 0 0 5px #50C9C3;
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }

  .rc-slider-mark {
    position: absolute;
    top: 18px;
    left: 0;
    width: 100%;
    font-size: 12px;
  }

  .rc-slider-mark-text {
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    color: #999;
  }

  .rc-slider-mark-text-active {
    color: #666;
  }

  .rc-slider-step {
    position: absolute;
    width: 100%;
    height: 4px;
    background: transparent;
  }

  .rc-slider-dot {
    position: absolute;
    bottom: -2px;
    margin-left: -4px;
    width: 8px;
    height: 8px;
    border: 2px solid #e9e9e9;
    background-color: #fff;
    cursor: pointer;
    border-radius: 50%;
    vertical-align: middle;
  }

  .rc-slider-dot-active {
    border-color: #50C9C3;
  }

  .rc-slider-dot-reverse {
    margin-right: -4px;
  }

  .rc-slider-disabled {
    background-color: #e9e9e9;
  }

  .rc-slider-disabled .rc-slider-track {
    background-color: #ccc;
  }

  .rc-slider-disabled .rc-slider-handle,
  .rc-slider-disabled .rc-slider-dot {
    border-color: #ccc;
    box-shadow: none;
    background-color: #fff;
    cursor: not-allowed;
  }

  .rc-slider-disabled .rc-slider-mark-text,
  .rc-slider-disabled .rc-slider-dot {
    cursor: not-allowed !important;
  }

  .rc-slider-vertical {
    width: 14px;
    height: 100%;
    padding: 0 5px;
  }

  .rc-slider-vertical .rc-slider-rail {
    height: 100%;
    width: 4px;
  }

  .rc-slider-vertical .rc-slider-track {
    left: 5px;
    bottom: 0;
    width: 4px;
  }

  .rc-slider-vertical .rc-slider-handle {
    margin-left: -5px;
    touch-action: pan-y;
  }

  .rc-slider-vertical .rc-slider-mark {
    top: 0;
    left: 18px;
    height: 100%;
  }

  .rc-slider-vertical .rc-slider-step {
    height: 100%;
    width: 4px;
  }

  .rc-slider-vertical .rc-slider-dot {
    left: 2px;
    margin-bottom: -4px;
  }

  .rc-slider-vertical .rc-slider-dot:first-child {
    margin-bottom: -4px;
  }

  .rc-slider-vertical .rc-slider-dot:last-child {
    margin-bottom: -4px;
  }

  .rc-slider-tooltip-zoom-down-enter,
  .rc-slider-tooltip-zoom-down-appear {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    display: block !important;
    animation-play-state: paused;
  }

  .rc-slider-tooltip-zoom-down-leave {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    display: block !important;
    animation-play-state: paused;
  }

  .rc-slider-tooltip-zoom-down-enter.rc-slider-tooltip-zoom-down-enter-active,
  .rc-slider-tooltip-zoom-down-appear.rc-slider-tooltip-zoom-down-appear-active {
    animation-name: rcSliderTooltipZoomDownIn;
    animation-play-state: running;
  }

  .rc-slider-tooltip-zoom-down-leave.rc-slider-tooltip-zoom-down-leave-active {
    animation-name: rcSliderTooltipZoomDownOut;
    animation-play-state: running;
  }

  .rc-slider-tooltip-zoom-down-enter,
  .rc-slider-tooltip-zoom-down-appear {
    transform: scale(0, 0);
    animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  }

  .rc-slider-tooltip-zoom-down-leave {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }

  @keyframes rcSliderTooltipZoomDownIn {
    0% {
      opacity: 0;
      transform-origin: 50% 100%;
      transform: scale(0, 0);
    }
    100% {
      transform-origin: 50% 100%;
      transform: scale(1, 1);
    }
  }

  @keyframes rcSliderTooltipZoomDownOut {
    0% {
      transform-origin: 50% 100%;
      transform: scale(1, 1);
    }
    100% {
      opacity: 0;
      transform-origin: 50% 100%;
      transform: scale(0, 0);
    }
  }

  .rc-slider-tooltip {
    position: absolute;
    left: -9999px;
    top: -9999px;
    visibility: visible;
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .rc-slider-tooltip * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .rc-slider-tooltip-hidden {
    display: none;
  }

  .rc-slider-tooltip-placement-top {
    padding: 4px 0 8px 0;
  }

  .rc-slider-tooltip-inner {
    padding: 6px 2px;
    min-width: 24px;
    height: 24px;
    font-size: 12px;
    line-height: 1;
    color: #fff;
    text-align: center;
    text-decoration: none;
    background-color: #6c6c6c;
    border-radius: 6px;
    box-shadow: 0 0 4px #d9d9d9;
  }

  .rc-slider-tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
  }

  .rc-slider-tooltip-placement-top .rc-slider-tooltip-arrow {
    bottom: 4px;
    left: 50%;
    margin-left: -4px;
    border-width: 4px 4px 0;
    border-top-color: #6c6c6c;
  }
`;

export const TagInput = styled.div`
  > ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;

    > .tag{
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      padding: 8px;
      font-size: 0.8rem;
      list-style: none;
      border-radius: 6px;
      margin: 0 8px 8px 0;
      background: #50C9C3;

      > .tagIcon {
        color: #fff;
        cursor: pointer;
        margin-left: 5px;
      }
    }
  }
`;

export const Button = styled.button`
  width: 250px;
  height: 60px;
  border: none;
  border-radius: 20px;
  background-color: #50C9C3;
  font-family: 'SilkscreenBold';
  font-size: 1.5rem;
  color: white;
  margin-bottom: 30px;
  cursor: pointer;

  &:disabled {
    border: 1px solid #50C9C3;
    color: #50C9C3;
    background-color: #fff;
    cursor: default;
  }
`;

export default function Post() {
  const navigate = useNavigate();
  const fileRef = useRef<any>();
  const imgRef = useRef<any>(null);

  const signinReducer = useSelector(
    (state: RootReducerType) => state.signinReducer
  );

  AWS.config.update({
    region: "ap-northeast-2",
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "ap-northeast-2:d4282d0a-72a9-4d98-a6b6-335f48bbf863"
    })
  });

  const [ partyInfo, setPartyInfo ] = useState({
    image: 'https://teo-img.s3.ap-northeast-2.amazonaws.com/defaultThumbnail.png',
    name: '',
    startDate: '',
    endDate: '',
    memberLimit: 2,
    location: '',
    latlng: { lat: 0, lng: 0 },
    privateLink: '',
    content: ''
  });

  const [ isName, setIsName ] = useState({
    err: false,
    msg: ''
  });

  const [ isStrDate, setIsStrDate ] = useState({
    err: false,
    msg: ''
  });

  const [ isEndDate, setIsEndDate ] = useState({
    err: false,
    msg: ''
  });

  const [isContent, setIsContent] = useState({
    err: false,
    msg: ''
  });

  const [ isPLink, setIsPLink ] = useState({
    err: false,
    msg: ''
  });

  const [ isLocation, setIsLocation ] = useState({
    err: false,
    msg: ''
  });

  const [ fixedLocation, setFixedLocation ] = useState('');
  const [ formatLocation, setFormatLocation ] = useState('');
  const [ tags, setTags ] = useState<string[]>([]);
  const [ inputTxt, setInputTxt ] = useState('');
  const [ isOnline, setIsOnline ] = useState(false);
  const [ isPosted, setIsPosted ] = useState(false);
  const [ imgLoading, setImgLoading ] = useState(false);
  const [ cancelModal, setCancelModal ] = useState(false);
  const [ isErrorModalOpen, setIsErrorModalOpen ] = useState(false);

  const handleRefClick = (e: any) => {
    e.preventDefault();
    fileRef.current.click();
  };

  const handleImgLoad = async (e: any) => {
    setImgLoading(true);
    let file = e.target.files[0]
    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: "teo-img",
        Key: `${signinReducer.userInfo.id}_${partyInfo.name}_image.jpg`,
        Body: file,
      }
    });
    const promise = upload.promise();
    promise.then(
      (data) => {
        console.log("✅ Uploaded Successfully");
        setPartyInfo({
          ...partyInfo,
          image: data.Location
        })
        setImgLoading(false);
      },
      (err) => {
        return console.log('🚫 Upload Failed:', err.message);
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setPartyInfo({
      ...partyInfo,
      [name]: value
    });
    if (partyInfo.name) setIsName({ err: false, msg: ''});
    if (partyInfo.location) setIsLocation({ err: false, msg: '' });
    if (partyInfo.privateLink) setIsPLink({ err: false, msg: '' });
    if (partyInfo.content) setIsContent({ err: false, msg: '' });
  };

  const getCurrentDate = () => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return year + "-" + (month < 10 ? `0${month}` : `${month}`) + "-" + date;
  };

  const validationCheck = () => {
    if (partyInfo.startDate > partyInfo.endDate) {
      setIsEndDate({
        err: true,
        msg: '종료일이 시작일보다 빠를 수 없습니다.'
      });
    }
    else {
      setIsStrDate({
        err: false,
        msg: '',
      });
      setIsEndDate({
        err: false,
        msg: ''
      });
    }

    if (partyInfo.startDate > partyInfo.endDate) {
      setIsEndDate({
        err: true,
        msg: '종료일이 시작일보다 빠를 수 없습니다.'
      });
    }
    else {
      setIsEndDate({
        err: false,
        msg: ''
      });
    }
  };

  const handleSlider = (value: number) => {
    setPartyInfo({
      ...partyInfo,
      memberLimit: value
    });
  };

  const handleCoordsChange = (lat: number, lng: number) => {
    setPartyInfo({
      ...partyInfo,
      latlng: { lat: lat, lng: lng }
    });
  };

  const handleFormatLocationChange = (address: string) => setFormatLocation(address);

  const handleSearchLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' || e.code === 'Space' || e.code === 'ArrowRight') setFixedLocation(partyInfo.location);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPartyInfo({
      ...partyInfo,
      [name]: value
    });
    if (partyInfo.content !== '') {
      setIsContent({
        err: false,
        msg: ''
      });
    }
  };

  const handleIsOnline = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.className === 'isOnline' || e.currentTarget.className === 'isOnline unfocused')
      setIsOnline(true);
    else setIsOnline(false);
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      if (!tags.includes(inputTxt) && inputTxt && tags.length < 3) {
        setTags([...tags, inputTxt]);
        setInputTxt('');
      }
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((tag) => {
      return tags.indexOf(tag) !== index
    }));
  };

  const postCancelHandler = () => {
    if (cancelModal) setCancelModal(false);
    else setCancelModal(true);
  };

  const errorModalHandler = () => {
    if (isErrorModalOpen) setIsErrorModalOpen(false);
    else setIsErrorModalOpen(true);
  };

  const backToPage = () => {
    navigate(-1);
  }

  const createParty = () => {
    const regex = {
      url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    };

    if (partyInfo.name === '') {
      setIsName({
        err: true,
        msg: '퀘스트 제목을 입력해주세요.'
      });
    }
    if (partyInfo.startDate === '') {
      setIsStrDate({
        err: true,
        msg: '퀘스트 시작하는 날을 선택해주세요.'
      });
    }
    if (partyInfo.endDate === '') {
      setIsEndDate({
        err: true,
        msg: '퀘스트가 끝나는 날을 선택해주세요.'
      });
    }
    if (partyInfo.content === '') {
      setIsContent({
        err: true,
        msg: '퀘스트 내용을 입력해주세요.'
      });
    }
    if (partyInfo.location === '') {
      setIsLocation({
        err: true,
        msg: '퀘스트 장소를 입력해주세요.'
      });
    }
    if (partyInfo.privateLink === '') {
      setIsPLink({
        err: true,
        msg: '오픈채팅방 링크를 입력해주세요.'
      });
    }
    else if (!regex.url.test(partyInfo.privateLink)) {
      setIsPLink({
        err: true,
        msg: "유효한 링크를 입력해주세요. 링크는 'https://'를 포함합니다."
      });
    }

    if (partyInfo.name && partyInfo.startDate && partyInfo.endDate && partyInfo.location &&
      partyInfo.privateLink && regex.url.test(partyInfo.privateLink) && partyInfo.content &&
      !isName.err && !isStrDate.err && !isEndDate.err && !isContent.err && !isLocation.err && !isPLink.err) {
        setIsPosted(true);
    }
  }

  const postParty = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/list/creation`, {
      userId: signinReducer.userInfo?.id,
      partyInfo: {
        name: partyInfo.name,
        image: partyInfo.image,
        memberLimit: partyInfo.memberLimit,
        content: partyInfo.content,
        region: 
          isOnline? 
          signinReducer.userInfo.address.split(" ")[0] + " " + signinReducer.userInfo.address.split(" ")[1]
          : formatLocation,
        location: partyInfo.location,
        latlng: partyInfo.latlng,
        startDate: partyInfo.startDate,
        endDate: partyInfo.endDate,
        isOnline: isOnline,
        privateLink: partyInfo.privateLink,
        tag: tags
      }
    }, {
      withCredentials: true
    });
    return res;
  }

  useEffect(() => {
    validationCheck();
  }, [ partyInfo.startDate, partyInfo.endDate, partyInfo.privateLink ]);

  useEffect(() => {
    if (isPosted){
      postParty()
      .then((res) => {
        setIsPosted(false);
        navigate(`../party/${res.data.newParty.partyId}`);
      })
      .catch((err) => {
        setIsErrorModalOpen(true);
        setIsPosted(false);
      });
    }
  }, [ isPosted ]);

  if (cookieParser().isLoggedIn === "0") return <Navigate to="../" />

  return (
    <PostContainer>
      {imgLoading ? <Loading /> : null}
      {cancelModal ?
        <PostCancelModal 
          postCancelHandler={postCancelHandler}
          backToPage={backToPage}
        />
      : null}
      {isErrorModalOpen ?
        <ErrorModal 
          errorModalHandler={errorModalHandler}
        />
      : null}
      <TopNavigation>
        <button className="cancelBtn" onClick={postCancelHandler}>
          <FontAwesomeIcon icon={ faArrowLeft } className="icon" /> 
        </button>
        <div className="partyName">{partyInfo.name}</div>
        <button className="post" onClick={createParty}>
          등록
        </button>
      </TopNavigation>
      <PostCard>
        <section className="basicInfo">
          <div className="imageContainer">
            {imgLoading ? null :
            <>
              <img className="preview" src={partyInfo.image} alt="thumbnail"
                onError={() => {
                  return (imgRef.current.src = 'https://teo-img.s3.ap-northeast-2.amazonaws.com/defaultThumbnail.png')
                }}
              />
              <input 
                ref={fileRef}
                type='file'
                className='imgInput'
                id='partyImg'
                accept='image/*'
                name='file'
                hidden={true}
                autoComplete='off'
                onChange={handleImgLoad}
              />
            </>
            }
          </div>
          <div className="infoContainer">
            <fieldset>
              <div className='label'>퀘스트 제목</div>
              <input
                name='name'
                type='text'
                value={partyInfo.name}
                maxLength={30}
                autoComplete='off'
                onChange={(e) => {handleInputChange(e)}}
              />
              {isName.err ?
              <div className='error'>{isName.msg}</div> : null}
            </fieldset>
            <fieldset>
              <div className='label'>퀘스트 기간</div>
              <div className="startDate">
                <div className='date'>시작일</div>
                <input
                  name='startDate'
                  type='date'
                  className="startDate"
                  min={getCurrentDate()}
                  value={partyInfo.startDate}
                  onChange={(e) => {handleInputChange(e)}}
                />
                {isStrDate.err ?
                <div className='error'>{isStrDate.msg}</div> : null}
              </div>
              <div className="endDate">
                <div className='date'>종료일</div>
                <input
                  name='endDate'
                  type='date'
                  min={partyInfo.startDate}
                  value={partyInfo.endDate}
                  onChange={(e) => {handleInputChange(e)}}
                />
                {isEndDate.err ?
                <div className='error'>{isEndDate.msg}</div> : null}
              </div>
            </fieldset>

            <fieldset>
              <div className='label'>파티 정원 <span style={{ fontWeight: "normal" }}>(1/{partyInfo.memberLimit})</span></div>
              <SliderContainer>
                <Slider 
                  min={2}
                  max={10}
                  step={1}
                  value={partyInfo.memberLimit}
                  onChange={handleSlider}
                >
                  <div className="sign" style={{ left: `${(partyInfo.memberLimit)*12.5-26}%` }}>
                    <span id="value">{partyInfo.memberLimit}</span>
                  </div>
                </Slider>
              </SliderContainer>
            </fieldset>

          </div>
        </section>

        <section className="infoDetails">
          <fieldset>
            <div className='locationTitle'>
              <div className='label'>퀘스트 장소</div>
              <div className="details">
                <button className={isOnline ? 'unfocused' : ''} onClick={(e) => {handleIsOnline(e)}}>오프라인</button>
                <span> | </span>
                <button className={isOnline ? 'isOnline' : 'isOnline unfocused'} onClick={(e) => {handleIsOnline(e)}}>온라인</button>
              </div>
            </div>
            {!isOnline ? 
              <div className='mapContainer'>
                <div id='map' className='mapDesc'>
                  <PostMap 
                    location={fixedLocation} 
                    name={partyInfo.name}
                    image={partyInfo.image} 
                    handleCoordsChange={handleCoordsChange}
                    handleFormatLocationChange={handleFormatLocationChange}
                  />
                </div>
                <input 
                  className='mapInput'
                  name='location'
                  type='text'
                  value={partyInfo.location}
                  autoComplete='off'
                  onChange={(e) => handleInputChange(e)}
                  onKeyUp={(e) => handleSearchLocation(e)}
                />
              </div>
            :
              <input 
                name='location'
                type='text'
                value={partyInfo.location}
                autoComplete='off'
                onChange={(e) => {handleInputChange(e)}}
              />
            }
            {isLocation.err ?
            <div className='error'>{isLocation.msg}</div> : null}
          </fieldset>
          <fieldset>
            <div className='label'>오픈채팅방 링크</div>
            <div className="details">
              파티원들간의 소통을 위한 오픈채팅방 링크를 입력해주세요.
            </div>
            <input
              name='privateLink'
              type='text'
              value={partyInfo.privateLink}
              autoComplete='off'
              onChange={(e) => {handleInputChange(e)}}
            />
            {isPLink.err ?
            <div className='error'>{isPLink.msg}</div> : null}
          </fieldset>
          <fieldset>
            <div className='label'>태그</div>
            <TagInput>
              <ul id='tags'>
                {tags.map((tag, index) => (
                  <li key={index} className='tag'>
                    <span className='tagTitle'>{tag}</span>
                    <span className='tagIcon' onClick={() => {removeTag(index)}}>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </li>
                ))}
              </ul>
              <input
                className='tag-input'
                name='tagInput'
                type='text'
                maxLength={10}
                value={inputTxt}
                placeholder={tags.length === 3 ? '' : '최대 3개까지 추가할 수 있습니다.'}
                autoComplete='off'
                onChange={(e) => setInputTxt(e.target.value)}
                onKeyUp={(e) => addTag(e)}
              />
            </TagInput>
          </fieldset>
          <fieldset>
            <div className='label content'>
              퀘스트 내용
              {isContent.err ? <div className='error'>{isContent.msg}</div> : null}  
            </div>
            <textarea
              placeholder='파티원들이 퀘스트 내용을 이해할 수 있도록 자세히 작성해주세요.'
              name='content'
              value={partyInfo.content}
              onChange={(e) => {handleTextareaChange(e)}}
            />
          </fieldset>
        </section>

        <div className='btn'>
          <Button onClick={createParty} disabled={isPosted}>QUEST</Button>
        </div>
      </PostCard>
      <BottomNavigation>
        <button className="button" onClick={(e) => handleRefClick(e)}>
          <FontAwesomeIcon icon={ faCamera } className="icon" /> 사진 등록
        </button>
      </BottomNavigation>
    </PostContainer>
  );
}