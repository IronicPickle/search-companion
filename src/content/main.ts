//import cmsHandler from "./interfaces/cms"

const urls = [
  { url: "https://indexcms.co.uk/2.7/case-management", handler: () => {} }
]

setInterval(() => {
  const currentUrl = location.href;
  for(const i in urls) {
    if(currentUrl.includes(urls[i].url)) {
      //urls[i].handler();
    }
  }
  
}, 2500);