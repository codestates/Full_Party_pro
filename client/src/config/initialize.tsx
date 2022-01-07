// import dotenv from 'dotenv';
// dotenv.config();
import KAKAO_JAVASCRIPT_KEY from './key';

const { Kakao } = window as any;

export default function initialize() {
  Kakao.init(KAKAO_JAVASCRIPT_KEY);
}