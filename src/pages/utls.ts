export function resizeMe(
  img: any,
  type: any,
  max_width: number,
  max_height: number,
  callback: BlobCallback,
) {
  const canvas = document.createElement("canvas");
  let width = img.width;
  let height = img.height;
  max_width = !isNaN(max_width) ? max_width : 0;
  max_height = !isNaN(max_height) ? max_height : 0;
  // 在这里图片是等比例缩放的，调用方法时填入图片允许的最大宽度或者是最大的高度
  //如果最大宽度为0 则按照最大高度固定，宽度自适应的方式来实现
  //如果是最大高度为0，则按照最大的宽度来实现
  if (max_width == 0) {
    if (height > max_height) {
      width = Math.round((width *= max_height / height));
      height = max_height;
    }
  }
  if (max_height == 0) {
    if (width > max_width) {
      height = Math.round((height *= max_width / width));
      width = max_width;
    }
  }
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  type = type === "jpg" ? "jpeg" : type;
  canvas.toBlob(callback, type, 0.7); //这里的0.7值的是图片的质量
}

export function selectFileImage(file: File, callback: BlobCallback) {
  const reader = new FileReader();
  const fileName = file.name;
  const fileType = file.name.split(".")[1];
  reader.readAsArrayBuffer(file);

  reader.onload = (ev) => {
    const blob = new Blob([ev?.target["result"]]);
    window["URL"] = window["URL"] || window["webkitURL"];
    const blobURL = window["URL"].createObjectURL(blob);
    const image = new Image();
    image.src = blobURL;
    resizeMe(image, fileType, 300, 200, callback);
  };
}
export default resizeMe;
