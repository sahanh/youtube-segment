/**
 * Youtube visitor segment script for facebook pixel
 * @author  Sahan H <sahan@sahanz.com>
 */
window.onload = function(){
            (function(){
                var timer;
                var player;
                var injected = false;

                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                var containerId = options.containerId || 'youtube-embed';

                window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
                    player = new YT.Player(containerId, {
                        height: options.height,
                        width: options.width,
                        videoId: options.videoId,
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }

                function onPlayerReady(event) {
                    if (options.autoplay == true)
                        event.target.playVideo();
                }

                function onPlayerStateChange(event) {
                    if (event.data == YT.PlayerState.PLAYING) {
                        var playerTotalTime = player.getDuration();
                        timer = setInterval(function() {
                            var playerCurrentTime = player.getCurrentTime();
                            var playProgress = Math.ceil((playerCurrentTime / playerTotalTime) * 100);

                            if (playProgress > options.injectionProgress && !injected) {
                                if (!injected) {
                                    var eventData;
                                    if (options.customEvent !== false) {
                                        eventData = options.customEvent + '&cd[progress]='+ playProgress;
                                    } else {
                                        eventData = 'PageView';
                                    }

                                    var pixeltag = document.createElement('img');
                                    pixeltag.src = 'https://www.facebook.com/tr?id='+options.facebookPixelId+'&ev=' + eventData + '&noscript=1';
                                    pixeltag.height = 1;
                                    pixeltag.width = 1;
                                    document.body.appendChild(pixeltag);
                                    injected = true;
                                }
                            }
                        }, 1000);
                    } else {
                        clearTimeout(timer);
                    }
                }
            })();
        };