import ImageKit from "imagekit";

const initImageKit =  ()=> {
  var imagekit = new ImageKit({
    publicKey: process.env.PUBLICKEY_IMAGEKIT,
    privateKey: process.env.PRIVATEKEY_IMAGEKIT,
    urlEndpoint: process.env.ENDPOINT_URL,
  });
  return imagekit;
};
 export default initImageKit;