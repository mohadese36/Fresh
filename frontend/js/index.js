const $ = document;
const landingTitle = $.querySelector(".Landing__title");
// const landingProductsCount = $.querySelector("#products-count");
// const landingMinutesCount = $.querySelector("#minutes-counter");
// const landingUsersCount = $.querySelector("#users-counter");

window.addEventListener("load", () => {
  let landingText = "Craving Something Fresh & Satisfying !";
  let typeIndex = 0;

  typeWriter(landingText, typeIndex);
  // makeCounter(3_396, landingProductsCount);
  // makeCounter(3_320, landingMinutesCount);
  // makeCounter(3_071, landingUsersCount);
});

function typeWriter(text, index) {
  if (index < text.length) {
    landingTitle.innerHTML += text[index];
    index++;
  }

  setTimeout(() => {
    typeWriter(text, index);
  }, 150);
}

// function makeCounter(max, elem) {
//   let counter = 0;
//   const interval = setInterval(() => {
//     if (counter === max) {
//       clearInterval(interval);
//     }

//     elem.innerHTML = counter;
//     counter++;
//   }, 0.5);
// }



///////////////

// import { createClient } from '@supabase/supabase-js';

// // جایگزین کن با اطلاعات واقعی خودت
// const SUPABASE_URL = 'https://dowddaaqxhpkgjstkgqh.supabase.co';
// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvd2RkYWFxeGhwa2dqc3RrZ3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDA5OTIsImV4cCI6MjA1NzI3Njk5Mn0.GBkh1bv-ch-tqKyx0gOCeBxPionzM9lSqL_Hcbp--qs';

// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// async function testConnection() {
//     const { data, error } = await supabase.from('your_table').select('*');
    
//     if (error) {
//         console.error('خطا در دریافت داده‌ها:', error);
//     } else {
//         console.log('داده‌های دریافت‌شده:', data);
//     }
// }

// testConnection();

