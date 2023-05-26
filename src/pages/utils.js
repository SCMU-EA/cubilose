// export function resizeMe(
//   img: any,
//   type: any,
//   max_width: number,
//   max_height: number,
//   callback: BlobCallback,
// ) {
//   const canvas = document.createElement("canvas");
//   let width = img.width;
//   let height = img.height;
//   max_width = !isNaN(max_width) ? max_width : 0;
//   max_height = !isNaN(max_height) ? max_height : 0;
//   // 在这里图片是等比例缩放的，调用方法时填入图片允许的最大宽度或者是最大的高度
//   //如果最大宽度为0 则按照最大高度固定，宽度自适应的方式来实现
//   //如果是最大高度为0，则按照最大的宽度来实现
//   if (max_width == 0) {
//     if (height > max_height) {
//       width = Math.round((width *= max_height / height));
//       height = max_height;
//     }
//   }
//   if (max_height == 0) {
//     if (width > max_width) {
//       height = Math.round((height *= max_width / width));
//       width = max_width;
//     }
//   }
//   canvas.width = width;
//   canvas.height = height;
//   const ctx = canvas.getContext("2d");
//   canvas.width = width;
//   canvas.height = height;
//   ctx.drawImage(img, 0, 0, width, height);
//   type = type === "jpg" ? "jpeg" : type;
//   canvas.toBlob(callback, type, 0.7); //这里的0.7值的是图片的质量
// }

// export function selectFileImage(file: File, callback: BlobCallback) {
//   const reader = new FileReader();
//   const fileName = file.name;
//   const fileType = file.name.split(".")[1];
//   reader.readAsArrayBuffer(file);

//   reader.onload = (ev) => {
//     const blob = new Blob([ev?.target["result"]]);
//     window["URL"] = window["URL"] || window["webkitURL"];
//     const blobURL = window["URL"].createObjectURL(blob);
//     const image = new Image();
//     image.src = blobURL;
//     resizeMe(image, fileType, 300, 200, callback);
//   };
// }
export default formatPassedTime;

export function formatPassedTime(dateTime) {
  const date = new Date(dateTime);
  const now = new Date();
  const minutes = now.getMinutes() - date.getMinutes();
  const hours = now.getHours() - date.getHours();
  const day = now.getDay() - date.getDay();
  const month = now.getMonth() - date.getMonth();
  const year = now.getFullYear() - date.getFullYear();
  console.log(date, now);

  if (year > 0) return year + "年前";
  if (month > 0 && month < 12) return month + "个月前";
  else if (day > 0 && day < 30) return day + "天前";
  else if (hours > 0) return hours + "小时前";
  else return minutes + "分钟前";
}
// const minute = 1000 * 60;
// const hour = minute * 60;
// const day = hour * 24;
// const halfamonth = day * 15;
// const month = day * 30;
// export function formatPassedTime(date) {
//   let y = date.getFullYear();
//   let m = date.getMonth() + 1; //注意这个“+1”
//   m = m < 10 ? "0" + m : m;
//   let d = date.getDate();
//   d = d < 10 ? "0" + d : d;
//   let h = date.getHours();
//   h = h < 10 ? "0" + h : h;
//   let minute = date.getMinutes();
//   minute = minute < 10 ? "0" + minute : minute;
//   let second = date.getSeconds();
//   second = second < 10 ? "0" + second : second;
//   const dateTimeStamp =
//     y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
//   return formatDate(dateTimeStamp);
// }

// //这是第一次打开页面时调用

// export function formatDate(dateTimeStamp) {
//   if (dateTimeStamp == undefined) {
//     return false;
//   } else {
//     dateTimeStamp = dateTimeStamp.replace(/\-/g, "/");

//     const sTime = new Date(dateTimeStamp).getTime(); //把时间pretime的值转为时间戳

//     const now = new Date().getTime(); //获取当前时间的时间戳

//     const diffValue = now - sTime;

//     if (diffValue < 0) {
//       console.log("结束日期不能小于开始日期！");
//     }

//     const monthC = diffValue / month;
//     const weekC = diffValue / (7 * day);
//     const dayC = diffValue / day;
//     const hourC = diffValue / hour;
//     const minC = diffValue / minute;

//     if (monthC >= 1) {
//       return parseInt(monthC) + "个月前";
//     } else if (weekC >= 1) {
//       return parseInt(weekC) + "周前";
//     } else if (dayC >= 1) {
//       return parseInt(dayC) + "天前";
//     } else if (hourC >= 1) {
//       return parseInt(hourC) + "个小时前";
//     } else if (minC >= 1) {
//       return parseInt(minC) + "分钟前";
//     } else {
//       return "刚刚";
//     }
//   }
// }
