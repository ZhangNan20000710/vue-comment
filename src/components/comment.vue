<template>
  <div>
    <div v-for="comment in getRoots()" :key="comment.commentId"  class="comment">
      <img :src="'http://localhost:8081' + comment.user.headPortrait" alt="" />
      <div class="content">
        <h4>{{ comment.user.nickname }}</h4>
        <p>
          {{ comment.commentContent }}
        </p>
        <span>{{ comment.createTime }}<a href="" @click.prevent="clickReply(comment)">回复</a></span>
        <div class="reply comment" v-for="reply in getReplys(comment)" :key="reply.commentId">
          <img :src="'http://localhost:8081' + reply.user.headPortrait" alt=""/>
          <div class="content">
            <h4 v-if="isOne(reply)">
              {{ reply.user.nickname }} ：
            </h4>
            <h4 v-else>
              {{ reply.user.nickname }} 回复<a href="" @click.prevent="clickReply(reply)">@{{ reply.parentComment.user.nickname }}</a> ：
            </h4>
            <p>{{ reply.commentContent }}</p>
            <span>{{ reply.createTime }} <a href="" @click.prevent="clickReply(reply)">回复</a></span>
          </div>
        </div>
        <div :class="{'publish-comment':true,'hide':comment.commentId!==rootCommentId}">
          <img src="" alt="" />
          <textarea name="" id="" cols="30" rows="10" v-model="commentContent" :placeholder="'回复@：'+replyNickname"></textarea>
          <button @click="publishComment">发表评论</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from "../network/request";
export default {
  data() {
    return {
      comments: [],
      replyCommentId:"",
      rootCommentId:"",
      replyNickname:"",
      commentContent:""
    };
  },
  created() {
    request({
      url: "Comment/show",
    }).then((data) => {
      this.comments = data.message.comments.content;
    });
  },
  methods: {
    // 判断是否是根评论
    isRoot(comment) {
      return comment.parentComment === null;
    },
    getRoots(){
      return this.comments.filter((n) => {
        return this.isRoot(n)
      });
    },
    // 接收评论参数，返回该评论下面的子评论
    getReplys(comment) {
      return this.comments.filter((n) => {
        if (this.isRoot(n)) {
          return false;
        }
        while (n.parentComment !== null) {
          n = n.parentComment;
        }
        return n.commentId === comment.commentId;
      });
    },
    // 点击回复只会显示回复框
    clickReply(comment){
      this.commentContent=""
      this.replyNickname=comment.user.nickname
      this.replyCommentId=comment.commentId
      while (comment.parentComment !== null) {
          comment = comment.parentComment;
      }
      this.rootCommentId=comment.commentId
    },
    isOne(reply){
      return reply.parentComment.parentComment===null
    },
    publishComment(){
      let formData= new FormData()
      formData.append("parentComment",this.replyCommentId)
      formData.append("commentContent",this.commentContent)
      request({
        method:"POST",
        url:"/Comment/add",
        data:formData,
      }).then((data)=>{
        request({
          url: "Comment/show",
        }).then((data) => {
          this.comments = data.message.comments.content;
          this.commentContent="";
        });
      })
    }
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.comment {
  overflow: hidden;
  margin: 10px auto;
  padding-top: 30px;
  border-top: 1px solid #bcbcbc;
  width: 950px;
  /* background-color: bisque; */
}

.comment img {
  float: left;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.comment .content {
  float: left;
  width: 850px;
  margin-left: 20px;
}

.comment .content h4 {
  margin-bottom: 8px;
  font-size: 16px;
  color: rgb(132, 117, 122);
}

.comment .content h4 a {
  font-size: 14px;
  font-weight: 400;
  color: rgb(0, 161, 214);
  text-decoration: none;
}

.comment .content p {
  word-break: break-all;
  word-wrap: break-word;
}

.comment .content span {
  display: block;
  padding: 5px 0;
}
.comment .content span a,
.comment .content span {
  font-size: 14px;
  color: rgb(153, 162, 170);
}

.comment .content span a {
  margin-left: 20px;
  text-decoration: none;
}

.reply {
  padding-top: 10px;
  width: 850px;
}

.reply img {
  width: 40px;
  height: 40px;
}

.reply .content {
  width: 750px;
  margin-left: 10px;
}

.reply .content h4 {
  margin-bottom: 5px;
  font-size: 13px;
}

.reply .content p {
  font-size: 14px;
}

.publish-comment {
  overflow: hidden;
  margin-bottom: 40px;
}

.publish-comment textarea {
  float: left;
  border: 0;
  outline-color: rgb(0, 161, 214);
  resize: none;
  font-size: 14px;
  font-family: "微软雅黑";
  margin-left: 40px;
  height: 50px;
  width: 600px;
}

.publish-comment button {
  float: left;
  width: 50px;
  height: 50px;
  text-align: center;
  padding: 0 6px;
  margin-left: 10px;
  color: #ffffff;
  border: 0;
  outline: none;
  border-radius: 5px;
  background-color: rgb(0, 161, 214);
}

.hide {
  display: none;
}
</style>