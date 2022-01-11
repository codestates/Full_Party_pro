const { Kakao } = window as any;

export default function initialize() {
  Kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
}