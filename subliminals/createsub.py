from pydub import AudioSegment
from pydub.effects import speedup
import math


# =========================
# CONFIG
# =========================
VOICE_FILE = "affirmation.m4a"       # your single voice recording
BACKGROUND_FILE = "background.m4a"   # optional (rain/noise/music)
OUTPUT_FILE = "subliminal_output.m4a"

TOTAL_DURATION_MINUTES = 5

# volume settings (negative = quieter)
VOICE_VOLUME_DB = -25
BACKGROUND_VOLUME_DB = -8

# overlap offsets (milliseconds)
OFFSET_1 = 0
OFFSET_2 = 700
OFFSET_3 = 1400


# =========================
# HELPERS
# =========================
def change_speed(sound, speed=1.0):
    new_frame_rate = int(sound.frame_rate * speed)

    altered = sound._spawn(
        sound.raw_data,
        overrides={"frame_rate": new_frame_rate}
    )

    return altered.set_frame_rate(sound.frame_rate)


def loop_to_duration(sound, target_ms):
    repetitions = math.ceil(target_ms / len(sound))
    looped = sound * repetitions
    return looped[:target_ms]


# =========================
# LOAD VOICE
# =========================
voice = AudioSegment.from_file(VOICE_FILE)

# create variants
voice_normal = voice
voice_slow = change_speed(voice, 0.9)
voice_fast = change_speed(voice, 1.1)

# reduce volume
voice_normal = voice_normal + VOICE_VOLUME_DB
voice_slow = voice_slow + VOICE_VOLUME_DB
voice_fast = voice_fast + VOICE_VOLUME_DB

# create staggered layer
layer_duration = max(
    len(voice_normal) + OFFSET_1,
    len(voice_slow) + OFFSET_2,
    len(voice_fast) + OFFSET_3
)

base = AudioSegment.silent(duration=layer_duration)

layered = base.overlay(voice_normal, position=OFFSET_1)
layered = layered.overlay(voice_slow, position=OFFSET_2)
layered = layered.overlay(voice_fast, position=OFFSET_3)

# target duration
target_ms = TOTAL_DURATION_MINUTES * 60 * 1000

# loop affirmation stack
affirmation_track = loop_to_duration(layered, target_ms)

# =========================
# BACKGROUND (optional)
# =========================
try:
    background = AudioSegment.from_file(BACKGROUND_FILE)
    background = background + BACKGROUND_VOLUME_DB
    background = loop_to_duration(background, target_ms)

    final_track = background.overlay(affirmation_track)

except FileNotFoundError:
    final_track = affirmation_track

# export
final_track.export(OUTPUT_FILE, format="ipod", bitrate="128k")

print(f"Done! Saved as {OUTPUT_FILE}")
