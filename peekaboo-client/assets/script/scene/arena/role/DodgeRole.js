
var AtlasStorage = require('AtlasStorage');
var Tween = require('TweenLite');
var Timeline = require('TimelineLite');
var net = require('net');
var EventDispatcher = require('EventDispatcher');
var EventType = require('EventType');
var Player = require('Player');

/**
 * 躲 角色
 */
cc.Class({
    extends: cc.Component,

    properties: {
        itemSpr: cc.Sprite,
        nicknameTxt: cc.Label
    },

    onLoad: function(){
        this.animation = null;
        this.isDeath = false;
    },

    setNickname: function(nickname){
        this.nicknameTxt.string = nickname;
    },

    // 隐藏名字
    hiddenNickname: function() {
        this.nicknameTxt.node.opacity = 0;
    },

    // 设置颜色
    nicknameColor: function () {
        this.nicknameTxt.node.color = cc.Color.GREEN;
    },

    // 设置精灵
    setItemSpr: function (id) {
        this.itemSpr.spriteFrame = AtlasStorage().getItemSprite(id);
    },

    // 被发现
    wasfound: function (argument) {
        var role = this.node.parent.getComponent('binRole');
        if(role.uid === Player.uid){
            net.send('connector.gameHandler.wasfound', {});
        }
    },

    // 死亡
    death: function () {
        if(this.isDeath){
            return;
        }
        this.isDeath = true;
        // 把碰撞关掉
        var collider = this.node.getComponent(cc.BoxCollider);
        collider.enabled = false;
        // 播放动画
        var self = this;
        let tl = new Timeline();
        tl.add([
            Tween.to(self.itemSpr.node, 0.2, {scale: 0, onComplete: function(){
                self.setItemSpr(0);
            }}),
            Tween.to(self.itemSpr.node, 0.3, {scale: 1.2}),
            Tween.to(self.itemSpr.node, 0.2, {scale: 1}),
            Tween.to(self.nicknameTxt.node, 0.5, {opacity: 255}),
            ], '', 'sequence');
        tl.play();
    }

});
