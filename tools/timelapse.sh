#!/bin/zsh

# Takes a screenshot every n seconds (Only works on OSX)

i=1; n=5
while [ 1 ]; do
  screencapture -t jpg -x ~/Desktop/day2/${(l:8::0:)i}.jpg
  let i++
  sleep $n
done

# Turn into video
# ffmpeg -r 18 -i %8d.jpg timelapse.mov
