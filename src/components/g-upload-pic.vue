<template>
  <view class="photo-list">
    <block v-for="(item, index) in photoList" :key="index">
      <view class="img-content flex-ctr">
        <image class="img-item" mode="aspectFill" :src="item" @click.stop="previewImg(index)" />
        <image class="delete-photo" src="/static/images/delete_photo.png" :data-index="index" data-type="delete"
          @click="deletePhoto" />
      </view>
    </block>
    <view v-if="photoList.length < max" class="modal-comment-upload" @click="uploadImage">
      <image class="img" src="/static/images/add_img.png"></image>
    </view>
  </view>
</template>

<script>
import { Resource } from '@/server/resource-api';
export default {
  props: {
    photoList: {
      type: Array,
      default: () => []
    },
    max: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      list: []
    };
  },
  methods: {
    // 图片上传
    uploadImage: function () {
      let that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        // 'album', 'camera'
        success(res) {
          that.conversionAddress(res.tempFilePaths);
        }
      });
    },

    // 获取图片信息
    getImageInfo: function (src) {
      let _this = this;
      uni.getImageInfo({
        src,
        success(res) {
          let canvasWidth = res.width; //图片原始长宽
          let canvasHeight = res.height;
          let img = new Image();
          img.src = res.path;
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          canvas.width = canvasWidth / 2;
          canvas.height = canvasHeight / 2;
          ctx.drawImage(img, 0, 0, canvasWidth / 2, canvasHeight / 2);
          const url = canvas.toDataURL('image/jpeg', 0.5).replace(/^data:image\/\w+;base64,/, '');
          _this.uploadFile(url);
        }
      });
    },

    uploadFile: function (base64) {
      const { photoList, uploadNumber } = this;
      let that = this;
      let photoListArr = [];
      const param = {
        content: base64,
        fileType: 'jpeg'
      };
      Resource.uploadImage.post({}, param, { loadingDelay: true, txt: '正在上传...' }).then(res => {
        let { code, data = '' } = res;
        console.log('上传支付凭证返回结果', res)
        data = [data]
        if (code === 1) {
          photoListArr = [...photoList, ...data];
          Object.assign(that, {
            uploadNumber: uploadNumber + data.length,
            list: photoListArr
          });
          that.$emit('uploadCall', photoListArr);
        } else {
          ToastInfo('图片上传失败');
        }
      });
    },

    // 图片转换
    conversionAddress: function (tempFilePaths) {
      let that = this;
      tempFilePaths.forEach(item => {
        // #ifdef H5
        this.getImageInfo(item);
        return;
        // #endif

        uni.compressImage({
          src: item,
          // 图片路径
          quality: 60,
          // 压缩质量
          success: res => {
            uni.getFileSystemManager().readFile({
              filePath: res.tempFilePath,
              //选择图片返回的相对路径
              encoding: 'base64',
              //编码格式
              success: res => {
                console.log(res);
                let baseImg = res.data;
                that.uploadFile(baseImg);
              },
              fail: () => {
                ToastInfo('图片上传失败');
              }
            });
          },
          fail: () => {
            ToastInfo('图片压缩失败');
          }
        });
      });
    },

    // 图片删除
    deletePhoto: function (e) {
      console.log(e);
      const { index } = e.currentTarget.dataset;
      const { photoList: list, uploadNumber } = this;
      list.splice(index, 1);
      Object.assign(this, {
        list,
        uploadNumber: uploadNumber - 1
      });
      this.$emit('uploadCall', list);
    },
    previewImg(index) {
      uni.previewImage({
        current: index,
        urls: this.list,
        loop: true,
        indicator: 'number'
      });
    }
  }
};
</script>

<style scoped>
.modal-comment-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 24rpx; */
  height: 300rpx;
  width: 300rpx;
  background: #fafafa;
}
.modal-comment-upload .img {
  height: 100rpx;
  width: 100rpx;
}
.photo-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  border-radius: 8rpx;
  border: 1px solid #e3d6d6;
  overflow: hidden;
}
.img-content {
  position: relative;
  width: 300rpx;
  height: 300rpx;
  overflow: hidden;
  border-radius: 8rpx;
  padding: 10rpx;
}

.img-item {
  width: 100%;
  height: 100%;
  background: #faf7f7;

  /* display: flex;
  align-items: center;
  justify-content: center; */
}

.delete-photo {
  width: 30rpx;
  height: 30rpx;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
