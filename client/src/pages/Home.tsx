import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppState } from '../reducers';
import axios from 'axios';
import { SIGNIN_SUCCESS } from "../actions/signinType";
import { modalChanger } from '../actions/modal';
import { faClipboardCheck, faMapMarkedAlt, faStreetView, faBirthdayCake, faCodeBranch, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "../../node_modules/aos/dist/aos.css";

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
      font-family: Rubik;
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
      font-family: Rubik;
      font-style: normal;
      font-weight: normal;
      font-size: 1.4rem;
      line-height: 36px;
      color: #222F3F;
      /* margin: 18px 0px 30px 0px; */

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
    font-family: Rubik;
    color: #1F1F1F;
    font-size: 2rem;
    font-weight: bold;
    font-style: normal;
    letter-spacing: -1px;
    line-height: 1.5rem;
    margin-bottom: 35px;
  }

  p {
    font-family: Karla;
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
    
    font-family: Karla;
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

`

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
    font-family: Rubik;
    font-style: normal;
    font-weight: bold;
    font-size: 1.8rem;
    color: #FFFFFF;

    margin-bottom: 1vh;
  }

  .contentArea p {
    font-family: Karla;
    font-style: normal;
    font-weight: normal;
    font-size: 1.1rem;
    line-height: 28px;
    letter-spacing: -0.4px;
    /* or 165% */
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
`

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
    font-family: Rubik;
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
    /* background-image: linear-gradient(to right, #329D9C 20%, #56C596 100%); */
    border: none;
    border-radius: 20px;

    box-shadow: rgba(80, 201, 195, 0.4) 0px 8px 24px;
  }

  @media screen and (min-width: 620px) {
    button {
      width: 400px;
    }
  }
`

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
`

function Home () {
  const dispatch = useDispatch();

  const handleModal = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
    dispatch(modalChanger(e.currentTarget.className));
  }

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
            <h1>풀팟,</h1>
            <p>외로운 도시에서<br />동료가 필요한<br />모험가들을 위한<br />플랫폼</p>
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
          <h2>소소하고 작은 퀘스트</h2>
          <p>
            누구나 사람을 
            <br />구하기 쉬운 건 아니죠.
            <br />OTT 계정 공유부터, 
            <br />1+1 상품 공유까지
            <br />거창하진 않지만 
            <br />혼자서는 하기 힘든 일들을 함께 하세요.
          </p>
          <div className="signinModalBtn" onClick={handleModal}>
            Get Started Now →
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
                우리 동네 파티원들 
              </h2>
              <p>
                동네에 아는 사람은 없고,
                <br />지속적인 관계는 부담스럽지만
                <br />동료가 필요한 일이 생겼을 때
                <br />이웃들과 함께 해요!
              </p>
              <div className="signinModalBtn" onClick={handleModal}>
                Get Started Now →
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
              <h5>소소한 퀘스트</h5>
              <p>소모임을 꾸릴 정도는 아닌<br />소소하고 단기적인 일들</p>
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
              <h5>지역 커뮤니티</h5>
              <p>퀘스트를 함께할 파티원을<br />같은 동네에서 찾아보세요</p>
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
              <h5>다양한 목적</h5>
              <p>
                관심사가 같지 않더라도<br />같은 목적으로 모일 수 있어요</p>
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
                퀘스트 수행</h5>
              <p>
                우리 동네의 파티원들과 
                <br />즐겁게 퀘스트를 수행해요
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
          <h2>지금 바로<br />당신의 파티원을<br />찾아보세요!</h2>
          <button className="signinModalBtn" onClick={(e) => handleModal(e)}>PRESS START !</button>
        </div>
      </SignIn>

      <Footer>
        <div className="teamMembers">
          <div className="title">
            코드스테이츠 34기
            <br />파이널 프로젝트 "풀팟"
          </div>
          팀원: 조범, 김아영, 정재현, 조영현
        </div>
        <div className="contact">
          <div className="title">Contact Us</div>
          <FontAwesomeIcon icon={ faEnvelope } className="icon" />fullparty.gm@gmail.com
          <br /><FontAwesomeIcon icon={ faCodeBranch } className="icon" /><a href="https://github.com/codestates/Full_Party_pro/wiki" target="_blank" rel="noreferrer">github.com/codestates/Full_Party_pro</a>
        </div>      
      </Footer>
    </HomeContainer>
  );
}

export default Home;