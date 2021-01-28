import { isMobile } from 'react-device-detect';
import { api, user, prompt, InvalidDataError, uurl, links } from 'utils';
import PlayerData from '../player'
import { uEvent } from '../Utils/UserEventController';
import {
    NORMAL_MODE,
    PS_MODE,
    NESTED_MODE /** THEATRE_MODE, */,
    CTP_PLAYING,
    CTP_LOADING,
    CTP_ENDED,
    CTP_UP_NEXT,
    CTP_ERROR,
    HIDE_TRANS,
} from '../Utils/constants.util';

function handleRestoreTime(media) {
    const search = uurl.useSearch();
    const begin = search.begin || media.watchHistory.timestamp;
    if (Boolean(begin) && !this.timeRestored) {
        this.currTime(Number(begin));
        this.timeRestored = true;
        window.history.replaceState(null, null, links.watch(media.id));
    }
}
function enterFullScreen(watch) {
    try {
        let elem = document.getElementById('watch-page') || {};
        if (isMobile) {
            elem = document.getElementById(watch.isSwitched ? 'ct-video-2' : 'ct-video-1') || {};
        }
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.webkitEnterFullscreen) {
            /* Safari IOS Mobile */
            elem.webkitEnterFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE/Edge */
            elem.msRequestFullscreen();
        }
        uEvent.fullscreenchange(watch.time, true);
    } catch (error) {
        console.error('Failed to enter fullscreen.');
    }
}
function exitFullScreen(watch) {
    try {
        if (isMobile) {
            const elem = document.getElementById(watch.isSwitched ? 'ct-video-2' : 'ct-video-1') || {};
            // console.log(elem.webkitExitFullscreen)
        }
        if (!PlayerData.video1) return;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE/Edge */
            document.msExitFullscreen();
        }
        uEvent.fullscreenchange(watch.time, false);
    } catch (error) {
        console.error('Failed to exit fullscreen.');
    }
}
export default {
    *media_play({ payload }, { call, put, select, take }) {
        try {
            PlayerData.video1 && PlayerData.video1.play();
            PlayerData.video2 && PlayerData.video2.play();
        } catch (error) {
            // 
        }
        yield put({ type: 'setPause', payload: false })
        PlayerData.video1 && uEvent.play(PlayerData.video1?.currentTime);
    },
    *media_forward({ payload: sec = 10 }, { call, put, select, take }) {
        const { watch } = yield select();
        const now = watch.time;
        yield put({ type: 'media_setCurrTime', payload: Math.min(now + sec, watch.duration) });
    },
    *media_backward({ payload: sec = 10 }, { call, put, select, take }) {
        const { watch } = yield select();
        const now = watch.time;
        yield put({ type: 'media_setCurrTime', payload: Math.max(now - sec, 0) });
    },
    *media_pause({ payload }, { call, put, select, take }) {
        try {
            PlayerData.video1 && (PlayerData.video1.pause());
            PlayerData.video2 && (PlayerData.video2.pause());
        } catch (error) {
            // 
        }
        yield put({ type: 'setPause', payload: true })
        PlayerData.video1 && uEvent.pause(PlayerData.video1?.currentTime);
        yield put({ type: 'sendMediaHistories' });
    },
    *media_replay({ payload }, { call, put, select, take }) {
        yield put.resolve({ type: 'media_setCurrTime', payload: 0 })
        yield put({ type: 'media_play' })
    },
    *media_mute({ payload }, { call, put, select, take }) {
        let toSet = payload;
        if (toSet === undefined) {
            const { playerpref } = yield select();
            toSet = !playerpref.muted;
        }
        PlayerData.video1 && (PlayerData.video1.muted = toSet);
        PlayerData.video2 && (PlayerData.video2.muted = toSet);
        // preferControl.defaultMute(volume); NOT IMPLEMENTED
        yield put({ type: 'playerpref/setMute', payload: toSet })
    },
    *media_volume({ payload: toSet }, { call, put, select, take }) {
        PlayerData.video1 && (PlayerData.video1.volume = toSet);
        PlayerData.video2 && (PlayerData.video2.volume = toSet);
        // preferControl.defaultVolume(volume); NOT IMPLEMENTED
        yield put({ type: 'playerpref/setVolume', payload: toSet })
    },
    *media_setCurrTime({ payload }, { call, put, select, take }) {
        // currtime = 0
        PlayerData.video1 && (PlayerData.video1.currentTime = payload);
        PlayerData.video2 && (PlayerData.video2.currentTime = payload);
        yield put({ type: 'setTime', payload })
        yield put({ type: 'sendMediaHistories' });
    },
    *media_playbackrate({ payload: playbackRate }, { call, put, select, take }) {
        const { watch } = yield select();
        PlayerData.video1 && (PlayerData.video1.playbackRate = playbackRate);
        PlayerData.video2 && (PlayerData.video2.playbackRate = playbackRate);
        yield put({ type: 'playerpref/setPlaybackrate', payload: playbackRate })
        // preferControl.defaultPlaybackRate(playbackRate);
        uEvent.changespeed(watch.time, playbackRate);
    },
    *seekToPercentage({ payload: p = 0 }, { put, select }) {
        if (typeof p !== 'number' || p > 1 || p < 0) return;
        const { watch } = yield select();
        const seekTo = watch.duration * p;
        yield put({ type: 'media_setCurrTime', payload: seekTo });
    },
    *onPlayPauseClick({ payload }, { call, put, select, take }) {
        const { watch } = yield select();
        if (watch.paused) {
            yield put({ type: 'media_play' })
        } else {
            yield put({ type: 'media_pause' })
        }
    },
    *toggleFullScreen({ payload: bool }, { call, put, select, take }) {
        const { watch, playerpref } = yield select();
        const newState = bool === undefined ? !watch.isFullscreen : bool;
        if (newState) {
            if (!PlayerData.video1) return;
            if (newState) {
                enterFullScreen()
                yield put({ type: 'playerpref/setTransView', payload: { view: null, config: { updatePrefer: false } } });
            } else {
                exitFullScreen()
                yield put({ type: 'playerpref/setTransView', payload: { view: HIDE_TRANS, config: { updatePrefer: false } } });
            }
        }
        yield put({ type: 'setFullscreen', payload: newState });
    },
    *switchVideo({ payload: bool }, { call, put, select, take }) {
        // NOT IMPLEMENTED
        if (!PlayerData.video2) return;
        const { watch } = yield select();
        const toSet = bool === undefined ? !watch.isSwitched : bool;
        yield put({ type: 'switchScreen', payload: toSet })
    },
    *onPlayerReady({ payload: { isPrimary } }, { call, put, select, take }) {
        if (PlayerData.param.canPlayDone //  || !preferControl.autoPlay() NOT IMPLEMENTED, USE PLAYERPREF MODEL
        ) return;
        if (isPrimary) {
            PlayerData.param.video1CanPlay = true;
            if (PlayerData.param.video2CanPlay || !PlayerData.video2) {
                PlayerData.param.canPlayDone = true;
                // this.handleRestoreTime(media); NOT IMPLEMENTED
                yield put({ type: 'media_play', payload: null })
            }
        } else {
            PlayerData.param.video2CanPlay = true;
            if (PlayerData.param.video1CanPlay) {
                PlayerData.param.canPlayDone = true;
                // this.handleRestoreTime(media); NOT IMPLEMENTED
                yield put({ type: 'media_play', payload: null })
            }
        }
    },
    *onSeekingPri({ payload: { seeked, priVideo } }, { call, put, select, take }) {
        const { watch } = yield select();
        if (!seeked) {
            if (watch.ctpPriEvent === CTP_ENDED || watch.ctpPriEvent === CTP_UP_NEXT) {
                yield put({ type: 'setCTPEvent', payload: { event: CTP_PLAYING, priVideo } });
            }
        }
        uEvent.seeking(watch.time);
    },
    *onFullScreenChange({ payload: e }, { call, put, select, take }) {
        const isFullscreen = !!document.fullscreenElement;
        const { watch } = yield select();
        if (isFullscreen !== watch.isFullscreen) {
            yield put({ type: 'toggleFullScreen', payload: isFullscreen })
        }
    },
    *sendMediaHistories({ payload }, { call, put, select, take }) {
        const { watch } = yield select();
        const { id } = watch.media
        if (id && user.isLoggedIn) {
            yield call(api.sendMediaWatchHistories,
                id, watch.time, (watch.time / watch.duration) * 100);
        }
    },
    *setWatchMode({ payload: { mode, config = {} } }, { call, put, select, take }) {
        const { sendUserAction = true, restore = false } = config;
        const { watch } = yield select();
        if (window.innerWidth <= 900 && mode === PS_MODE) {
            mode = NESTED_MODE;
        } else if (restore) {
            mode = watch.prevmode || NORMAL_MODE;
        }
        // if (mode === THEATRE_MODE) {
        //   transControl.transView(HIDE_TRANS)
        // }
        yield put({ type: 'setMode', payload: mode })
        if (sendUserAction) uEvent.screenmodechange(watch.time, mode);
    }
}