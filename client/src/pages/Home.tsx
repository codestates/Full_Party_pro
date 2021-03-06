import React, { useEffect } from 'react';
import styled from 'styled-components';
import AOS from "aos";
import "../../node_modules/aos/dist/aos.css";
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { modalChanger } from '../actions/modal';
import { faClipboardCheck, faMapMarkedAlt, faStreetView, faBirthdayCake, faCodeBranch, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const HomeContainer = styled.div`
  position: absolute;
  width: 100vw;
  left: 0;
  margin-top: 40px;
  overflow: hidden;

  img {
    width: 80vw;
    margin-bottom: 5vh;
  }

  .bannerImg {
    width: 100vw;
    margin-bottom: 5vh;
    display: flex;
    justify-content: center;

    img {
      width: 120vw;
    }
  }

  .main {
    z-index: 5;
    padding: 4vh;
    margin-bottom: 5vh;

    h1 {
      font-style: normal;
      font-weight: bold;
      font-size: 2.5rem;
      line-height: 2.5rem;
      color: #1F1F1F;
      margin-bottom: 3vh;
      margin-left: 5vw;
      margin-top: 10vh;
    }

    p {
      font-style: normal;
      font-weight: normal;
      font-size: 1.4rem;
      line-height: 36px;
      color: #222F3F;
      margin-left: 5vw;
    }
  }

  @media screen and (min-width: 700px) {
    .bannerImg {
      img {
        width: 700px;
      }
    }
  }

  @media screen and (min-width: 800px) {

    .main {
      padding-left: 8vw;

      h1 {
        font-size: 3rem;
        margin-bottom: 5vh;
      }

      p {
        font-size: 2rem;
        line-height: 3.5rem;
      }
    }

    .bannerImg {
      img {
        margin-top: -100px;
      }
    }
  }
`

export const AppInfo = styled.section`
  padding: 5% 8%;
  margin-bottom: 5vh;

  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }

  h2 {
    color: #1F1F1F;
    font-size: 2rem;
    font-weight: bold;
    font-style: normal;
    letter-spacing: -1px;
    line-height: 1.5rem;
    margin-bottom: 35px;
  }

  p {
    font-style: normal;
    font-weight: normal;
    font-size: 21px;
    line-height: 36px;
    letter-spacing: -0.3px;
    color: #666666;
    margin-bottom: 0;
  }

  .signinModalBtn {
    border: 0;
    font-style: normal;
    font-weight: bold;
    font-size: 1.1rem;
    line-height: 28px;
    color: #50C9C3;
    margin-top: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  @media screen and (min-width: 800px) {
    .appInfo{
      padding: 0 12%;
    }
  }

  @media screen and (min-width: 1000px) {
    img {
      width: 700px;
    }
  }
`;

export const Features = styled.section`
  background: linear-gradient(to bottom, #50C9C3 20%, #50C9C3 100%);
  padding: 5% 0; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  h5 {
    font-style: normal;
    font-weight: bold;
    font-size: 1.8rem;
    color: #FFFFFF;
    margin-bottom: 1vh;
  }

  .contentArea p {
    font-style: normal;
    font-weight: normal;
    font-size: 1.1rem;
    line-height: 28px;
    letter-spacing: -0.4px;
    color: #fff;
  }

  .contentArea {
    display: flex;
    white-space: nowrap;
    margin: 10% 0;
  }

  .iconContainer {
    width: 80px;
    height: 80px;
    background-color: white;
    border-radius: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #50C9C3;
    font-size: 2rem;
  }

  .contentBody {
    margin: 0 30px;
  }
`;

export const SignIn = styled.section`
  padding: 12% 10vw;
  text-align: center;
  height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    width: 100%;
  }

  h2 {
    font-style: normal;
    font-weight: bold;
    font-size: 2.5rem;
    line-height: 3.5rem;
    letter-spacing: -1.5px;
    color: black;
    margin-bottom: 6%;
  }

  button {
    width: 65vw;
    height: 10vh;
    font-family: 'SilkscreenBold';
    font-size: 1.2rem;
    text-align: center;
    text-decoration: none;
    color: #50C9C3;
    background-color: white;
    border: none;
    border-radius: 20px;
    box-shadow: rgba(80, 201, 195, 0.4) 0px 8px 24px;
  }

  @media screen and (min-width: 620px) {
    button {
      width: 400px;
    }
  }
`;

export const Footer = styled.footer`
  padding: 30px;
  box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;
  line-height: 2rem;

  .title {
    font-weight: bold;
  }

  .teamMembers {
    margin-bottom: 10px;
  }

  .icon {
    margin-right: 7px;
  }

  a {
    color: black;
    text-decoration: none;
  }

  @media screen and (max-width: 400px) {
    .memberProfile {
      width: 35px;
      height: 35px;
      margin-right: 7px;
    }
  }
`;

export default function Home() {
  const dispatch = useDispatch();

  const handleModal = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
    dispatch(modalChanger(e.currentTarget.className));
  };

  useEffect(() => {
    AOS.init({
      duration : 5000
    });
  }, []);

  return (
    <HomeContainer>
      <section className="main">
        <div
          data-aos="fade-right"
          data-aos-duration="800"
          data-aos-once="true"
        >
          <div className="content">
            <h1>??????,</h1>
            <p>????????? ????????????<br />????????? ?????????<br />??????????????? ??????<br />?????????</p>
          </div>
        </div>
        <div
          className="bannerImg"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-once="true"
        >
          <img src="img/undraw_join_of2w.png" alt="" />
        </div>
      </section>

      <AppInfo>
        <div
          className="appInfoDetails left"
          data-aos="fade-left"
          data-aos-duration="2000"
          data-aos-once="false"
        >
          <h2>???????????? ?????? ?????????</h2>
          <p>
            ????????? ?????????
            <br />????????? ?????? ??? ?????????.
            <br />OTT ?????? ????????????,
            <br />1+1 ?????? ????????????
            <br />???????????? ?????????
            <br />???????????? ?????? ?????? ????????? ?????? ?????????.
          </p>
          <div className="signinModalBtn" onClick={handleModal}>
            Get Started Now ???
          </div>
        </div>
        <div
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-once="false"
        >
          <img src="img/undraw_Good_team_re_j1kc.png" alt="" />
        </div>
      </AppInfo>

      <AppInfo>
        <div className="appInfo right">
          <div
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-once="false"
          >
            <img src="img/undraw_Remote_design_team_re_urdx.png" alt="" />
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-once="false"
          >
            <div className="appInfoDetails right">
              <h2>
                ?????? ?????? ????????????
              </h2>
              <p>
                ????????? ?????? ????????? ??????,
                <br />???????????? ????????? ??????????????????
                <br />????????? ????????? ?????? ????????? ???
                <br />???????????? ?????? ??????!
              </p>
              <div className="signinModalBtn" onClick={handleModal}>
                Get Started Now ???
              </div>
            </div>
          </div>
        </div>
      </AppInfo>

      <Features>
        <div
          data-aos="fade-right"
          data-aos-duration="800"
          data-aos-once="false"
        >
          <div className="contentArea">
            <div className="iconContainer">
              <FontAwesomeIcon icon={ faClipboardCheck } />
            </div>
            <div className="contentBody">
              <h5>????????? ?????????</h5>
              <p>???????????? ?????? ????????? ??????<br />???????????? ???????????? ??????</p>
            </div>
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-duration="800"
          data-aos-once="false"
        >
          <div className="contentArea">
            <div className="iconContainer">
              <FontAwesomeIcon icon={ faMapMarkedAlt } />
            </div>
            <div className="contentBody">
              <h5>?????? ????????????</h5>
              <p>???????????? ????????? ????????????<br />?????? ???????????? ???????????????</p>
            </div>
          </div>
        </div>
        <div
          data-aos="fade-right"
          data-aos-duration="800"
          data-aos-once="false"
        >
          <div className="contentArea">
            <div className="iconContainer">
              <FontAwesomeIcon icon={ faStreetView } />
            </div>
            <div className="contentBody">
              <h5>????????? ??????</h5>
              <p>
                ???????????? ?????? ????????????<br />?????? ???????????? ?????? ??? ?????????</p>
            </div>
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-duration="800"
          data-aos-once="false"
        >
          <div className="contentArea">
            <div className="iconContainer">
              <FontAwesomeIcon icon={ faBirthdayCake } />
            </div>
            <div className="contentBody">
              <h5>
                ????????? ??????</h5>
              <p>
                ?????? ????????? ???????????????
                <br />????????? ???????????? ????????????
              </p>
            </div>
          </div>
        </div>
      </Features>

      <SignIn>
        <div
          className="content"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <h2>?????? ??????<br />????????? ????????????<br />???????????????!</h2>
          <button className="signinModalBtn" onClick={(e) => handleModal(e)}>PRESS START !</button>
        </div>
      </SignIn>

      <Footer>
        <div className="teamMembers">
          <div className="title">
            ?????????????????? 34???
            <br />????????? ???????????? "??????"
          </div>
          ??????: ??????, ?????????, ?????????, ?????????
        </div>
        <div className="contact">
          <div className="title">Contact Us</div>
          <FontAwesomeIcon icon={ faEnvelope } className="icon" />gmfullparty@gmail.com
          <br /><FontAwesomeIcon icon={ faCodeBranch } className="icon" /><a href="https://github.com/codestates/Full_Party_pro/wiki" target="_blank" rel="noreferrer">github.com/codestates/Full_Party_pro</a>
        </div>
      </Footer>
    </HomeContainer>
  );
}