//api 호출 함수, url을 스트링 타입이 아닌 자바스크립트 제공 툴 이용(URL), url이라는 클래스를 제공해주는데 그걸 가져다 쓸것
//url 클래스를 가져다쓰면 메서드들을 통해서 알아서 분석해줌
//클래스 부를때는 앞에 new 써주면 됨
let news =[]
let menu = document.querySelectorAll('.menu li')
//for문대신 forEach
menu.forEach(menu => menu.addEventListener('click', (event) => getNewsByTopic(event)))//event같이 넘겨주는 이유 = 누구를 클릭했는지 알기위해
let searchButton = document.getElementById('search-button')
let url;
let mMenuButton = document.querySelector('.mobile-menu-btn');
let mCloseButton = document.querySelector('.mobile-close-btn');
//pagination
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;



//모바일 메뉴

const openNav = () => {
    document.getElementById("mobile-menu").style.width = "350px";
    document.querySelector("#mobile-menu ul").style.display = "block";
    mCloseButton.style.display = "block";
};
  
  const closeNav = () => {
    document.getElementById("mobile-menu").style.width = "0";
    document.querySelector("#mobile-menu ul").style.display = "none";
    mCloseButton.style.display = "none";
};

mMenuButton.addEventListener('click', openNav);
mCloseButton.addEventListener('click', closeNav);

//검색창
const openSearchBox = () => {
    let inputArea = document.querySelector(".input-area");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };
  const openSearchBox2 = () => {
    let inputArea = document.querySelector(".input-area2");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };

//<<코드 리팩토링>>
//각 함수에서 다른 것 = url
//각 함수에서 필요한 url을 만든다.
//api 호출 함수를 부른다.

//<<에러핸들링>>
//이상한 키워드를 검색했을때.
/*1.받은 api데이터가 0개라면 화면에 No matches for your search라는 메세지 화면에 띄우기
  2.받은 응답코드가 200이 아니라면 (400, 401, 402 등) 받은 에러메세지를 화면에 띄우기*/


//함수의 중복부분 try catch문   
const getNews = async () => {
    try{
        let header = new Headers({
            'x-api-key': '5lWBGuMFFmP9A-g8BpKzBP4YAfuS6Qjg0KXVeA76ZDQ'
            //'x-api-key': '--eJnWS6GXm6gPpaLUg6KWF_33OQvcMu2J7YJ4RgCAY'
            //'x-api-key':'N-4R6bpwHj0J-8uHKC0teZCX8v6DaD0uNAmUsQCIhmw'
            //'x-api-key':'OlUv0q7jdM962bqVqmcuwlRlNrPckSBD0AfnM8-Huko'
            //'x-api-key':'d658687' //에러값
        })

        url.searchParams.set("page",page); // &page = page
        url.searchParams.set("pageSize",pageSize);
        // response는 응답을 받을 것
        // 자바스크립트의 기본원리 
        let response = await fetch(url,{headers:header}); //데이터 전송 방법 = ajax, axios, fetch
        //response에서 데이터 뽑아냄//json = 서버통신에서 많이쓰이는 자료형 타입
        //data에서 json 추출
        let data = await response.json();
        //console.log(data) totalResult 검색해봄
        if(response.status == 200){
            if(data.total_hits == 0){
            throw new Error("검색된 결과값이 없습니다")
            } 
            // console.log('받은 데이터는', data)
            news = data.articles;
            totalResults = data.totalResults;
            //console.log(news)
            render();
            paginationRender();
        }else{
            throw new Error(data.message)
        }
        //데이터의 기사들을 넣음
        
    }catch(error){
        console.log('잡힌에러는',error.message);
        errorRender(error.message);
    }

    
}

const errorRender = (message) => {
 let errorHTML = `<div style="display:block; background : red; color: #fff; height : 40px; line-height: 40px; padding-left:20px">${message}</div>`;
 document.getElementById("news").innerHTML = errorHTML;
}

console.log(document.getElementById("news"))

const getLatestNews = async() => {
    url =  new URL(
        // `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business&page_size=10`
        `https://newsappweb.netlify.app/top-headlines?country=kr`
        ); 
    getNews();
}

//주제별 뉴스
//event는 addEventListener가 주는 모든 정보를 담아다 줌
// const getNewsByCategory = async(event) => {
//     console.log('클릭됨', event.target.textContent) //어떤 이벤트가 검색되었는지 검색 textContent = 어떤 태그안에있는 내용만 가지고옴
//     let category = event.target.textContent.toLowerCase()//소문자변환
//     url = new URL(
//         // `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&page_size=10&topic=${topic}`
//         `https://newswebpage.netlify.app/top-headlines?country=kr&category=${category}`
//         )
//     getNews();
// }
const getNewsByTopic = async (event) => {
    const Topic = event.target.textContent.toLowerCase();
    url = new URL(`https://newsappweb.netlify.app/top-headlines?country=kr&category=${Topic}`);
    getNews();
}


const getNewsByKeyword = async () => {
    //1.검색키워드 읽어오기
    //2.url에 검색 키워드 붙이기
    //3.헤더 준비
    //4.url부르기
    //5.데이터 가져오기
    //6.데이터 보여주기
    let keyword = document.getElementById('search-input').value;
    url = new URL(
        // `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=US&page_size=10`
        `https://newsappweb.netlify.app/top-headlines?country=kr&q=${keyword}`
        );
    getNews();
}


//join = return string
const render = () => {
    let newsHTML = ''
    //array function (map의 결과값은 array)
    // <img src="${item.media}" alt="">
    //<p>${item.summary}</p>
    //<div>${item.rights}*${item.published_date}</div>
    newsHTML = news.map((item) => {
       return   `<div class="news-box">
                    <div class="news-img">
                        <img src="${item.urlToImage}" alt="${item.title}의 이미지" />
                    </div>
                    <div class="news-content">
                        <div>
                            <h2><a href="${item.url}">${item.title}</a></h2>
                            <p>${item.description}</p>
                        </div>
                        <div>${item.author}/ ${item.publishedAt}</div>
                    </div>
                </div>`
    }).join('');
    document.getElementById("news").innerHTML = newsHTML;
   
}

searchButton.addEventListener('click', getNewsByKeyword);

const paginationRender = () => {
   //totalResult = getNews 할때마다 data에 totalResult라는 값이 들어있음 / 196
   //page
   //pageSize
   //totalPages
   const totalPages = Math.ceil(totalResults / pageSize);
   //groupSize 몇개씩 보여줄지
   //pageGroup 내가 몇번째 그룹에 속해있는지
   const pageGroup = Math.ceil(page / groupSize); //올림
   //lastPage 마지막 페이지 그룹이 그룹사이즈보다 작으면 마지막page = totalPage
   let lastPage = pageGroup * groupSize;
    if(lastPage > totalPages) {
        lastPage = totalPages;
    }
   //firstPage
   const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

    let paginationHTML = ``;

    for (let i = firstPage; i <= lastPage; i++){
        paginationHTML += `<li class="page-item ${i===page?'active':''}" onClick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    document.querySelector('.pagination').innerHTML = paginationHTML;
}

const moveToPage = (pageNum) => {
    page = pageNum;
    getNews();
}


getLatestNews();
