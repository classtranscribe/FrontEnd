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
export default {
    *media_play({ payload }, { call, put, select, take }) {
        try {
            PlayerData.video1 && (yield PlayerData.video1.play());
            PlayerData.video2 && (yield PlayerData.video2.play());
        } catch (error) {

        }
        yield put({ type: 'setPause', payload: false })
        PlayerData.video1 && uEvent.play(PlayerData.video1?.currentTime);
    },
    *media_pause({ payload }, { call, put, select, take }) {
        try {
            PlayerData.video1 && (yield PlayerData.video1.pause());
            PlayerData.video2 && (yield PlayerData.video2.pause());
        } catch (error) {

        }
        yield put({ type: 'setPause', payload: true })
        PlayerData.video1 && uEvent.pause(PlayerData.video1?.currentTime);
        // this.sendMediaHistories(); NOT IMPLEMENTED
    },
    *media_replay({ payload }, { call, put, select, take }) {
        yield put.resolve({ type: 'media_setCurrTime', payload: 0 })
        yield put({ type: 'media_play' })
    },
    *media_mute({ payload }, { call, put, select, take }) {
        let toSet = payload;
        if(toSet === undefined) {
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
        // transControl.updateCaption(time); NOT IMPLEMENTED
        // this.sendMediaHistories(); NOT IMPLEMENTED
    },
    *onPlayPauseClick({ payload }, { call, put, select, take }) {
        const { watch } = yield select();
        if (watch.paused) {
            yield put({ type: 'media_play' })
        } else {
            yield put({ type: 'media_pause' })
        }
    },
    *onPlayerReady({ payload: { isPrimary } }, { call, put, select, take }) {
        if (PlayerData.canPlayDone) return; //  || !preferControl.autoPlay()
        if (isPrimary) {
            PlayerData.video1CanPlay = true;
            if (PlayerData.video2CanPlay || !PlayerData.video2) {
                PlayerData.canPlayDone = true;
                // this.handleRestoreTime(media);
                yield put({ type: 'media_play', payload: null })
            }
        } else {
            PlayerData.video2CanPlay = true;
            if (PlayerData.video1CanPlay) {
                PlayerData.canPlayDone = true;
                // this.handleRestoreTime(media);
                yield put({ type: 'media_play', payload: null })
            }
        }
    },
    *onSeekingPri({ payload: { seeked, priVideo} }, { call, put, select, take }) {
        const { watch } = yield select();
        if(!seeked) {
            if (watch.ctpPriEvent === CTP_ENDED || watch.ctpPriEvent === CTP_UP_NEXT) {
                yield put({type: 'setCTPEvent', payload: { event: CTP_PLAYING, priVideo}});
            }
        }
        uEvent.seeking(watch.time);
    },
    
}