/*! (C) 2020 Conviva, Inc. All rights reserved. Confidential and proprietary. */
!function(a,b){if("function"==typeof define&&define.amd?define(b):"object"==typeof exports&&(module.exports=b()),void 0!==a)if(void 0===a.Conviva){if(void 0!==a.ConvivaModule)return
;if(a.ConvivaModuleLoading)return;a.ConvivaModuleLoading=!0,a.ConvivaModule=b(),delete a.ConvivaModuleLoading}else{if(void 0!==a.Conviva.ProxyMonitor)return;if(a.ConvivaModuleLoading)return;var c=b()
;a.ConvivaModuleLoading=!0,a.Conviva.ProxyMonitor=c.ProxyMonitor,a.Conviva.Impl.V2Proxy=c.Impl.V2Proxy,delete a.ConvivaModuleLoading}}(this,function(){var a={};return function(){"use strict"
;!function(){a.ProxyMonitor={_proxyMonitor:null,release:function(){null!=this._proxyMonitor&&this._proxyMonitor.cleanup()},initConvivaDropIn:function(b,c,d,e,f){var g="No player proxy initialized"
;if(null!==c)return this._proxyMonitor=new a.Impl.V2Proxy(b,c,d,e,f),this._proxyMonitor;throw new Error(g)}};a.Impl=a.Impl||{};var b=a.Impl.V2Proxy=function(a,c,d,e,f){function g(a,c,d,e,f){
if(!c)throw new Error("v2Proxy: mediaElement argument cannot be null.");this._castPlayer=c,this._player=a,this._videoAnalytics=e,this._loggingInterface=d.buildLogger(),
this._loggingInterface.setModuleName("v2Proxy"),this._log("v2Proxy._constr()"),this._registerVideoEventListeners(),this._resetPlayHeadTimes(),this._resetTimeupdate(),this._startPolling(),
this._setDeviceMetadata();var g={};g[f.Constants.MODULE_NAME]="Chromecast V2 Receiver",g[f.Constants.MODULE_VERSION]=b.version,this._videoAnalytics.setContentInfo(g);var h={}
;h[f.Constants.FRAMEWORK_NAME]="Cast Player",void 0!==cast.receiver&&(h[f.Constants.FRAMEWORK_VERSION]=cast.receiver.VERSION),this._videoAnalytics.setPlayerInfo(h)}var h=this,i=500,j=4e3/i,k=2e3/i
;h._lastPlayHeadTimeSpeeds=[],h._timeupdate=0,h._lastTimeupdate=0,h._currentTimeIsInvalid=!1,this._timerInterface=new f.Impl.Html5Timer,this._videoWidth=-1,this._videoHeight=-1,
this._playerState=f.Constants.PlayerState.UNKNOWN,this._playBackRequested=!1,this._bitrate=0,this._duration=-1,this._streamUrl="",this._loadStart=!1,this._paused=!1,this._prevTotalFrames=0,
this._prevTotalDroppedFrames=0,this._droppedFrames=0,this._framerateSamples=0,this._registerVideoEventListeners=function(){h._log("V2Proxy._setAllEventListeners()"),
h._castPlayer&&(h._castPlayer.addEventListener("loadstart",h.onLoadstart),h._castPlayer.addEventListener("loadedmetadata",h.onLoadedMetadata),h._castPlayer.addEventListener("ended",h.onEnded),
h._castPlayer.addEventListener("pause",h.onPause),h._castPlayer.addEventListener("timeupdate",h.onDurationchange),h._castPlayer.addEventListener("abort",h.onStalled),
h._castPlayer.addEventListener("seeking",h.onSeeking),h._castPlayer.addEventListener("playing",h.onPlay),h._castPlayer.addEventListener("error",h.onError),
h._castPlayer.addEventListener("seeked",h.onSeekComplete))},this._removeVideoEventListeners=function(){h._log("V2Proxy._removeAllEventListeners()"),
h._castPlayer&&(h._castPlayer.removeEventListener("loadstart",h.onLoadstart),h._castPlayer.removeEventListener("loadedmetadata",h.onLoadedMetadata),
h._castPlayer.removeEventListener("ended",h.onEnded),h._castPlayer.removeEventListener("pause",h.onPause),h._castPlayer.removeEventListener("timeupdate",h.onDurationchange),
h._castPlayer.removeEventListener("abort",h.onStalled),h._castPlayer.removeEventListener("seeking",h.onSeeking),h._castPlayer.removeEventListener("play",h.onPlay),
h._castPlayer.removeEventListener("error",h.onError),h._castPlayer.removeEventListener("seeked",h.onSeekComplete))},this.onLoadstart=function(){h._log("v2Proxy.onLoadstart"),h._loadStart=!0,
h._updateConvivaPlayerState(f.Constants.PlayerState.BUFFERING)},this.onLoadedMetadata=function(a){h._log("v2Proxy.onLoadedMetadata"),h._updateConvivaPlayerStatus()},this.onDurationChange=function(a){
h._log("V2Proxy.onDurationchange"),h._updateBitrate(),h._castPlayer&&h._updateConvivaPlayerStatus()},this._updateBitrate=function(){if(h._player&&h._loadStart){var a,b,c=0,d=0
;if(null!=h._player.getStreamingProtocol()&&"function"==typeof h._player.getStreamingProtocol().getStreamCount){var e=h._player.getStreamingProtocol().getStreamCount()
;for(d=0;d<e;d++)a=h._player.getStreamingProtocol().getStreamInfo(d),0!==a.mimeType.indexOf("video")&&0!=a.mimeType.indexOf("audio")||(b=h._player.getStreamingProtocol().getQualityLevel(d),
c+=h._player.getStreamingProtocol().getStreamInfo(d).bitrates[b]);c>0&&c!=h._bitrate&&(h._bitrate=c,h._log("V2Proxy._updateBitrate"),
h._videoAnalytics.reportPlaybackMetric(f.Constants.Playback.BITRATE,Math.round(h._bitrate/1e3),"CONVIVA"))}}},this.onPlay=function(){if(h._log("V2Proxy.onPlay"),
h.firstPlay)return h._log("V2Proxy.onPlay :First Play IGNORED!!"),void(h.firstPlay=!1);h._updateConvivaPlayerState(f.Constants.PlayerState.PLAYING)},this.onStalled=function(a,b,c){
h._log("V2Proxy.onStalled - abort event"),h._updateConvivaPlayerState(f.Constants.PlayerState.STOPPED)},this.onPause=function(a,b,c){h._log("v2Proxy.onPause"),
h._player&&h._player.getState().underflow?h._updateConvivaPlayerState(f.Constants.PlayerState.BUFFERING):h._updateConvivaPlayerState(f.Constants.PlayerState.PAUSED)},this.onEnded=function(a,b,c){
h._log("v2Proxy.onMediaFinished"),h._castPlayer&&h._updateConvivaPlayerState(f.Constants.PlayerState.STOPPED)},this.onSeeking=function(a,b,c){h.isSeekStarted||(h.isSeekStarted=!0,
h._log("V2Proxy.onSeeking"),h._videoAnalytics.reportPlaybackMetric(f.Constants.Playback.SEEK_STARTED,"CONVIVA"))},this.onSeekComplete=function(a,b,c){h._log("v2Proxy.onSeekComplete"),
h._videoAnalytics.reportPlaybackMetric(f.Constants.Playback.SEEK_ENDED,"CONVIVA"),h.isSeekStarted=!1},this.onError=function(a){if(h._log("v2Proxy.onError"),h._castPlayer){var b,c=h._castPlayer.error
;b=null!=c?h._convertError(c?c.code:99):h._convertError(99),h._videoAnalytics.reportPlaybackError(b,f.Constants.ErrorSeverity.FATAL)}},this._convertError=function(a){var b;switch(a){case 0:
b="MEDIA_ERR_CUSTOM";break;case 1:b="MEDIA_ERR_ABORTED";break;case 2:b="MEDIA_ERR_NETWORK";break;case 3:b="MEDIA_ERR_DECODE";break;case 4:b="MEDIA_ERR_SRC_NOT_SUPPORTED";break;default:
b="MEDIA_ERR_UNKNOWN"}return h._log("MediaError: "+b),b},this._updateConvivaPlayerState=function(a){h._playerState=a,
h._videoAnalytics.reportPlaybackMetric(f.Constants.Playback.PLAYER_STATE,a,"CONVIVA"),h._resetPlayHeadTimes(),h._playerStateRecentlyChanged=!0},this._updateConvivaPlayerStatus=function(){
if(h._castPlayer){if("function"==typeof h._castPlayer.getVideoPlaybackQuality){var a=h._castPlayer.getVideoPlaybackQuality().droppedVideoFrames
;!isNaN(a)&&a>=0&&a!==h._droppedFrames&&(h._droppedFrames=a,h._videoAnalytics.reportPlaybackMetric(f.Constants.Playback.DROPPED_FRAMES_TOTAL,a,"CONVIVA"))}
var b=h._castPlayer.videoWidth,c=h._castPlayer.videoHeight;(!isNaN(b)&&b>0&&b!=h._videoWidth||!isNaN(c)&&c>0&&c!=h._videoHeight)&&(h._videoWidth=b,h._videoHeight=c,
h._videoAnalytics.reportPlaybackMetric(f.Constants.Playback.RESOLUTION,b,c,"CONVIVA"));var d={};if(h._castPlayer.duration>0){var e=h._castPlayer.duration;e!=h._duration&&(h._duration=e,
d[f.Constants.DURATION]=e)}"{}"!=JSON.stringify(d)&&h._videoAnalytics.setContentInfo(d)}},this._setDeviceMetadata=function(){if(null!=h._videoAnalytics){var a={}
;a[f.Constants.DeviceMetadata.TYPE]=f.Constants.DeviceType.SETTOP,a[f.Constants.DeviceMetadata.CATEGORY]=f.Constants.DeviceCategory.CHROMECAST,f.Analytics.setDeviceMetadata(a)}},
this._startPolling=function(){this._previousPosition=0,this._currentPosition=0,this._currentBufferLength=0,this._pollingTimerCancel=this._timerInterface.createTimer(this._poll,500,"v2Proxy._poll()")},
this._poll=function(){if(h._videoAnalytics.reportPlaybackMetric(f.Constants.Playback.PLAY_HEAD_TIME,1e3*h._castPlayer.currentTime,"CONVIVA"),
h._castPlayer&&"function"==typeof h._castPlayer.getVideoPlaybackQuality){if(h._framerateSamples%2==0){var a=h._castPlayer.getVideoPlaybackQuality().droppedVideoFrames,b=a-h._prevTotalDroppedFrames
;h._prevTotalDroppedFrames=a;var c=h._castPlayer.getVideoPlaybackQuality().totalVideoFrames,d=Math.floor(c-h._prevTotalFrames-b);h._prevTotalFrames=c,
!isNaN(d)&&d>=0&&h._videoAnalytics.reportPlaybackMetric(f.Constants.Playback.RENDERED_FRAMERATE,d,"CONVIVA")}h._framerateSamples++}h._updateBitrate(),h._updateConvivaPlayerStatus(),h._pollPosition(),
h._inferPlayerStateFromPosition()},this._pollPosition=function(){h._previousPosition=h._currentPosition,h._currentPosition=h._castPlayer.currentTime;var a=Date.now()
;if(h._lastPollTime>0&&a>h._lastPollTime){var b=h._currentPosition-h._previousPosition;b<0&&(b=0);var c=b/(a-h._lastPollTime)*1e3;h._lastPlayHeadTimeSpeeds.push(c)}h._lastPollTime=a,
h._lastPlayHeadTimeSpeeds.length>Math.max(j,k)&&h._lastPlayHeadTimeSpeeds.shift()},this._inferPlayerStateFromPosition=function(){var a=h._lastPlayHeadTimeSpeeds.length;if(a>=Math.min(k,j)){
for(var b=0,c=h._lastPlayHeadTimeSpeeds.slice(),d=0;d<c.length;d++)b+=c[d];b/=a;var e=1,g=.25,i=h._castPlayer.playbackRate;if(!isNaN(i)&&i!=1/0&&i>0&&(e*=i,g*=i),
h._playerState!==f.Constants.PlayerState.PLAYING&&a>=k&&Math.abs(b-e)<g)return h._log("Adjusting Conviva player state to: PLAYING"),void h._updateConvivaPlayerState(f.Constants.PlayerState.PLAYING)
;if(h._playerState===f.Constants.PlayerState.PLAYING&&a>=j&&0==b)return h._log("Adjusting Conviva player state to: BUFFERING"),void h._updateConvivaPlayerState(f.Constants.PlayerState.BUFFERING)}},
this._stopPolling=function(){null!=this._pollingTimerCancel&&this._pollingTimerCancel()},this._resetPlayHeadTimes=function(){h._lastPlayHeadTimeSpeeds=[],h._previousPosition=-1,h._lastPollTime=0},
this._resetTimeupdate=function(){h._lastTimeupdate=0,h._timeupdate=0},this._log=function(a){this._loggingInterface.log(a,f.SystemSettings.LogLevel.DEBUG)},g.apply(this,arguments),
this.cleanup=function(){this._log("v2Proxy.cleanup()"),this._stopPolling(),this._removeVideoEventListeners(),this._castPlayer=null}};b.version="4.0.8"}()}(),a});