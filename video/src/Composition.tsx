import React from 'react';
import { Composition, Audio, staticFile, AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { IntroScene } from './scenes/IntroScene';
import { ProblemScene } from './scenes/ProblemScene';
import { SolutionScene } from './scenes/SolutionScene';
import { DashboardScene } from './scenes/DashboardScene';
import { WebsiteScene } from './scenes/WebsiteScene';
import { ReservationScene } from './scenes/ReservationScene';
import { RestaurantScene } from './scenes/RestaurantScene';
import { AnalyticsScene } from './scenes/AnalyticsScene';
import { HeroScene } from './scenes/HeroScene';
import { AdScene } from './scenes/AdScene';
import { VIDEO, DURATIONS } from './constants';
import { FilmGrain, Vignette } from './overlays';
import './fonts';

// Transition duration — 20 frames = ~0.67s elegant fade
const TD = 20;

const MainVideo: React.FC = () => (
    <>
        {/* True black base — no transparency ever shows */}
        <AbsoluteFill style={{ background: '#000000' }} />

        <Audio src={staticFile('voiceover.mp3')} />
        <Audio
            src={staticFile('bgmusic.mp3')}
            volume={(f) => {
                if (f < 120) return (f / 120) * 0.06;
                if (f > VIDEO.durationInFrames - 120) return ((VIDEO.durationInFrames - f) / 120) * 0.06;
                return 0.06;
            }}
        />

        {/* All 9 scenes with cinematic fade transitions between them */}
        <TransitionSeries>
            <TransitionSeries.Sequence durationInFrames={DURATIONS.intro}>
                <IntroScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={fade()} timing={linearTiming({ durationInFrames: TD })}
            />
            <TransitionSeries.Sequence durationInFrames={DURATIONS.problem}>
                <ProblemScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={fade()} timing={linearTiming({ durationInFrames: TD })}
            />
            <TransitionSeries.Sequence durationInFrames={DURATIONS.solution}>
                <SolutionScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={fade()} timing={linearTiming({ durationInFrames: TD })}
            />
            <TransitionSeries.Sequence durationInFrames={DURATIONS.dashboard}>
                <DashboardScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={fade()} timing={linearTiming({ durationInFrames: TD })}
            />
            <TransitionSeries.Sequence durationInFrames={DURATIONS.website}>
                <WebsiteScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={fade()} timing={linearTiming({ durationInFrames: TD })}
            />
            <TransitionSeries.Sequence durationInFrames={DURATIONS.reservation}>
                <ReservationScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={fade()} timing={linearTiming({ durationInFrames: TD })}
            />
            <TransitionSeries.Sequence durationInFrames={DURATIONS.restaurant}>
                <RestaurantScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={fade()} timing={linearTiming({ durationInFrames: TD })}
            />
            <TransitionSeries.Sequence durationInFrames={DURATIONS.analytics}>
                <AnalyticsScene />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={fade()} timing={linearTiming({ durationInFrames: TD })}
            />
            <TransitionSeries.Sequence durationInFrames={DURATIONS.hero}>
                <HeroScene />
            </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* Global cinematic overlays — applied over everything */}
        <FilmGrain opacity={0.04} />
        <Vignette strength={0.45} />
    </>
);

export const PitchVideo: React.FC = () => (
    <>
        <Composition
            id="PitchVideo"
            component={MainVideo}
            durationInFrames={VIDEO.durationInFrames}
            fps={VIDEO.fps}
            width={VIDEO.width}
            height={VIDEO.height}
        />
        <Composition
            id="AdVideo"
            component={AdScene}
            durationInFrames={600}
            fps={30}
            width={1920}
            height={1080}
        />
    </>
);
