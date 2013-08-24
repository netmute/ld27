#!/bin/zsh

# Note on ogg: Only multi-channel wav can be converted into ogg,
# just duplicate the mono channel with Audacity or something.

pushd ../orig_media/
  for f in *.wav
  do
    ffmpeg -i $f -vol 256 -ab 192k ../media/${f:r}.mp3
    ffmpeg -i $f -vol 256 -strict -2 -acodec vorbis -aq 10 ../media/${f:r}.ogg
  done
popd
