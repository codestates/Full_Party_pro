const dummyParty = {
    partyId: 1,
    partyState: 0,
    name: "등 긁어주실 분...",
    image: "../img/defaultThumbnail.png",
    privateLink: "https://open.kakao.com/o/g2ufJhOd",
    content: "등 좀 긁어주세요...",
    region: "경기도 수원시",
    location: "경기도 수원시 장안구 정자동 111 101호",
    // location: "http://full-party-pro-bucket.s3-website.ap-northeast-2.amazonaws.com/",
    isOnline: false,
    startDate: new Date('12/24/2021'),
    endDate: new Date('12/25/2021'),
    favorite: 12,
    // [dev] 이 부분은 임시입니다.
    isFavorite: true,
    isReviewed: false,
    //
    tag: ["이웃", "효자손", "도와주세요"],
    leaderId: 1,
    memberLimit: 11,
    members: [ {
        id: 1,
        name: "귀오미",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/2/29/Molly_NH.png",
        level: 7,
        message: "",
        joinDate: "2021-12-17",
        isReviewed: false,
      }, {
        id: 2,
        name: "마리모",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/b/b8/Deena_NH.png",
        level: 1,
        message: "마리모예요",
        joinDate: "2021-12-17",
        isReviewed: false,
      }, {
        id: 3,
        name: "나키",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/6/6b/Pate_NH.png",
        level: 2,
        message: "나키입니다",
        joinDate: "2021-12-17",
        isReviewed: false,
      }, {
        id: 4,
        name: "지키미",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/e/ec/Scoot_NH.png",
        level: 5,
        message: "지키미다",
        joinDate: "2021-12-18",
        isReviewed: false,
      }, {
        id: 5,
        name: "리처드",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/6/66/Joey_NH.png",
        level: 8,
        message: "리처드여요",
        joinDate: "2021-12-18",
        isReviewed: false,
      }, {
        id: 6,
        name: "코코아",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/c/c1/Bill_NH.png",
        level: 6,
        message: "코코아잖아",
        joinDate: "2021-12-19",
        isReviewed: false,
      }, {
        id: 7,
        name: "봉",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/9/98/Derwin_NH.png",
        level: 1,
        message: "안경을 낀 봉",
        joinDate: "2021-12-19",
        isReviewed: false,
      }, {
        id: 8,
        name: "다랑어",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/7/7d/Freckles_NH.png",
        level: 1,
        message: "다랑어네요",
        joinDate: "2021-12-20",
        isReviewed: false,
      }, {
        id: 9,
        name: "스미모",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/2/28/Mallary_NH.png",
        level: 1,
        message: "스미모란다",
        joinDate: "2021-12-21",
        isReviewed: false,
      }, {
        id: 10,
        name: "케첩",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/4/42/Ketchup_NH.png",
        level: 1,
        message: "케첩이야",
        joinDate: "2021-12-23",
        isReviewed: false,
      }
    ],
    waitingQueue: [ {
        id: 11,
        name: "주디",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/3/32/Pompom_NH.png",
        level: 3,
        message: "주딘데요",
      }, {
        id: 12,
        name: "아잠만",
        profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/6/66/Weber_NH.png",
        level: 0,
        message: "잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만잠깐만",
      }
    ],
    // waitingQueue: [],
    // comments: [],
    comments: [
      {
        comment: {
          id: 1,
          userId: 13,
          userName: "앤",
          profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/9/93/Maelle_NH.png",
          content: "참가비는 1인당 얼마인가요?",
          createdAt: "2021-12-17"
        },
        subcomments: [
          {
            id: 1,
            userId: 1,
            userName: "귀오미",
            profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/2/29/Molly_NH.png",
            content: "5000원입니다.",
            createdAt: "2021-12-17"
          },
          {
            id: 2,
            userId: 13,
            userName: "앤",
            profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/9/93/Maelle_NH.png",
            content: "인원이 많아져도 같나요?",
            createdAt: "2021-12-25"
          },
        ]
      },
      {
        comment: {
          id: 2,
          userId: 14,
          userName: "푸아그라",
          profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/e/e0/Drake_NH.png",
          content: "제 등도 긁어주시나요?",
          createdAt: "2021-12-18"
        },
        subcomments: [
          {
            id: 1,
            userId: 1,
            userName: "귀오미",
            profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/2/29/Molly_NH.png",
            content: "아니요!",
            createdAt: "2021-12-18"
          },
          {
            id: 2,
            userId: 14,
            userName: "푸아그라",
            profileImage: "https://static.wikia.nocookie.net/animalcrossing/images/e/e0/Drake_NH.png",
            content: "넵ㅠㅠ",
            createdAt: "2021-12-18"
          }
        ]
      }
    ]
  };
  
  export default dummyParty;