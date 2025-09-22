
// // visitor.js
// export function getVisitorId() {
//   let visitorId = localStorage.getItem('visitor_id');
//   if (!visitorId) {
//     visitorId = crypto.randomUUID(); // شناسه یکتا
//     localStorage.setItem('visitor_id', visitorId);
//   }
//   return visitorId;
// }


// visitor.js
export function getVisitorId() {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = crypto.randomUUID(); // شناسه یکتا برای مهمان
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}
