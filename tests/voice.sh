#!/bin/bash
# Build the voiced video. Pass a voice name; run `say -v '?'` to see what is installed.
# Once a Premium voice is downloaded:  ./voice.sh "Ava (Premium)"
set -e
VOICE="${1:-Samantha}"
SC="$(cd "$(dirname "$0")" && pwd)"
SRC=$(ls "$SC"/video/*.webm | head -1)
WORK="$SC/voice-work"; rm -rf "$WORK"; mkdir -p "$WORK"

# One clip per line, laid at the moment its caption appears.
node -e '
const fs=require("fs"), beats=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
beats.forEach((b,i)=>console.log(i+"\t"+b.at+"\t"+b.text));
' "$SC/narration.json" > "$WORK/beats.tsv"

FILTER=""; INPUTS=""; n=0
while IFS=$'\t' read -r i at text; do
    say -v "$VOICE" -o "$WORK/$i.aiff" "$text"
    ffmpeg -loglevel error -y -i "$WORK/$i.aiff" -ar 44100 -ac 2 "$WORK/$i.wav"
    INPUTS="$INPUTS -i $WORK/$i.wav"
    FILTER="$FILTER[$((n+1)):a]adelay=${at}|${at}[a$n];"
    n=$((n+1))
done < "$WORK/beats.tsv"

MIX=""; for ((k=0;k<n;k++)); do MIX="$MIX[a$k]"; done
ffmpeg -loglevel error -y -i "$SRC" $INPUTS \
    -filter_complex "$FILTER$MIX amix=inputs=$n:normalize=0[out]" \
    -map 0:v -map "[out]" -c:v libx264 -pix_fmt yuv420p -crf 23 -c:a aac -shortest \
    "$SC/curriculum-explorer-voiced.mp4"
echo "wrote $SC/curriculum-explorer-voiced.mp4  (voice: $VOICE)"
